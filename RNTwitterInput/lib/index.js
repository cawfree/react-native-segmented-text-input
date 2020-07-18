import React, {useState, useCallback, useEffect, useRef} from "react";
import PropTypes from "prop-types";
import { UIManager, LayoutAnimation,  Platform, Text, TextInput, View, StyleSheet, TouchableOpacity } from "react-native";
import { typeCheck } from "type-check";
import { isEqual, debounce } from "lodash";

const styles = StyleSheet.create({
  segments: { flexWrap: "wrap", flexDirection: "row" },
  center: { alignItems: "center", justifyContent: "center" },
});

const SegmentedTextInput = ({style, textStyle, invalidTextStyle, value: [value, segments], onChange, patterns, placeholder, disabled, shouldRenderInvalid, max, minWidth, onSuggest, minSuggestionLength, debounce: suggestionDebounce, renderSuggestions, ...extraProps}) => {
  const ref = useRef();
  const [suggestions, setSuggestions] = useState([]);

  const shouldPrettyAnimate = useCallback(
    () => LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut),
  );

  const [debouncedSuggestion] = useState(
    () => debounce(
      /* force async */
      str => Promise.resolve().then(() => onSuggest(str))
        .then((suggestions) => {
          shouldPrettyAnimate();
          setSuggestions(suggestions);
        }),
      suggestionDebounce,
    ),
  );

  useEffect(
    () => {
      if (Platform.OS === 'android') {
        if (UIManager.setLayoutAnimationEnabledExperimental) {
          UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        shouldPrettyAnimate();
      }
    },
    [],
  ); 

  // XXX: Attempt to match the input strings into corresponding segments.
  const nextSegments = ((typeCheck("String", value) && value)  || "")
    .split(/[ ,]+/)
    .map(
      str => [
        str,
        Object.keys(patterns)
          .reduce(
            (selected, regExp) => (selected || (new RegExp(regExp, "gm").test(str)) && regExp),
            null,
        ),
      ],
    );

  // XXX: Latch the final segment (this is text that's in-dev).
  const [lastSegmentText, isValidLastSegment] = nextSegments[nextSegments.length - 1];

  // XXX: Filter all previous segments that didn't match.
  const existingSegmentText = segments
    .map(([text]) => text);

  const validSegments = [
    ...nextSegments
      .filter(([_, match], i, orig) => (i !== (orig.length - 1) && !!match))
      .filter(([text]) => existingSegmentText.indexOf(text) < 0),
  ];

  // XXX: Prevent duplicates.
  const onChangeTextCallback = useCallback(
    (nextValue) => {
      if (!isEqual(value, nextValue)) {
        return onChange([
          nextValue,
          [...segments, ...validSegments]
            .filter((e, i, orig) => (orig.indexOf(e) === i)),
        ]);
      }
      return undefined;
    },
    [onChange, value, segments, validSegments],
  ); 

  const renderLastSegmentAsInvalid = lastSegmentText.length > 0 && (!isValidLastSegment && !!shouldRenderInvalid(lastSegmentText));

  const segmentsToRender = [...(segments || []), ...validSegments];
  const shouldDisable = disabled || (segmentsToRender.length >= max);

  useEffect(
    () => {
      /* blur if disabled */
      if (shouldDisable) {
        setSuggestions([]);
        if (ref.current.isFocused()) {
          ref.current.blur();
        }
      }
      return undefined;
    },
    [shouldDisable],
  );

  /* suggestion handling */
  useEffect(
    () => {
      if (!renderLastSegmentAsInvalid && lastSegmentText.length >= minSuggestionLength) {
        /* request suggestion debounce */
        debouncedSuggestion(lastSegmentText);
      }
      return undefined;
    },
    [renderLastSegmentAsInvalid, lastSegmentText, minSuggestionLength, debouncedSuggestion],
  );

  return (
    <>
      <View
        {...extraProps}
        style={[styles.segments, style]}
      >
        {(segmentsToRender).map(
          ([str, regexp], i) => {
            const Component = patterns[regexp] || React.Fragment;
            return (
              <React.Fragment
                key={str}
              >
                <View
                  style={styles.center}
                >
                  <Component
                    style={textStyle}
                    children={str}
                    onRequestDelete={() => {
                      const filteredSegments = segmentsToRender
                        .filter(([t]) => (t !== str));
  
                      shouldPrettyAnimate();
  
                      onChange([lastSegmentText, filteredSegments]);
                      /* refocus the field */
                      ref.current.focus();
                    }}
                  />
                </View>
                <Text
                  style={textStyle}
                  children=" "
                />
              </React.Fragment>
            );
          },
        )}
        <TextInput
          pointerEvents={shouldDisable ? "none" : "auto"}
          ref={ref}
          disabled={shouldDisable}
          style={[textStyle, !!renderLastSegmentAsInvalid && invalidTextStyle, { minWidth }].filter(e => !!e)}
          placeholder={shouldDisable ? "" : placeholder}
          value={lastSegmentText}
          onChangeText={onChangeTextCallback}
        /> 
      </View>
      {/* TODO since the request must conform to a selected regexp, we can be the ones to pick it */}
      {(!shouldDisable && Array.isArray(suggestions) && suggestions.length > 0) && renderSuggestions({
          suggestions,
          // XXX: Assert that the selected suggestion must conform to the expected format.
          pickSuggestion: ([suggestion, regexp]) => {
            if (!typeCheck("String", suggestion)) {
              throw new Error(`Expected String suggestion, encountered ${suggestion}.`);
            } else if (!typeCheck("String", regexp)) {
              throw new Error(`Expected String regexp, encountered ${regexp}.`);
            }
            debouncedSuggestion.cancel();

            shouldPrettyAnimate();

            setSuggestions([]);
            onChange(['', [...segmentsToRender, [suggestion, regexp]]]);
          },
        })}
    </>
  );
};

SegmentedTextInput.propTypes = {
  value: PropTypes.arrayOf(PropTypes.any),
  onChangeText: PropTypes.func,
  patterns: PropTypes.shape({}),
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  segments: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  onChangeSegments: PropTypes.func,
  textStyle: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.number]),
  invalidTextStyle: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.number,
  ]),
  shouldRenderInvalid: PropTypes.func,
  max: PropTypes.number,
  minWidth: PropTypes.number,
  onSuggest: PropTypes.func,
  minSuggestionLength: PropTypes.number,
  debounce: PropTypes.number,
  renderSuggestions: PropTypes.func,
};

SegmentedTextInput.defaultProps = {
  value: ['', []],
  onChange: Promise.resolve,
  patterns: {
    /* a twitter @mention */
    ["(^|\s)@[a-z\d-]+"]: ({style, onRequestDelete, ...extraProps}) => (
      <TouchableOpacity
        style={{
          backgroundColor: "orange",
          borderRadius: 10,
          padding: 5,
        }}
        onPress={onRequestDelete}
      >
        <Text
          {...extraProps}
          style={[style, { fontWeight: "bold", color: "white" }]}
        />
      </TouchableOpacity>
    ),
  },
  placeholder: "Add some @mentions...",
  disabled: false,
  textStyle: {
    fontSize: 28,
  },
  invalidTextStyle: {
    color: "red",
  },
  /* don't mark the first character as an invalid animation */
  shouldRenderInvalid: str => !str.startsWith("@"),
  max: 3,
  minWidth: 100,
  onSuggest: text => Promise.resolve([]),
  minSuggestionLength: 2,
  debounce: 250,
  renderSuggestions: ({suggestions, pickSuggestion}) => (
    <View
      style={{
        flexDirection: "row",
      }}
    >
      {suggestions.map(
        (suggestion, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => pickSuggestion([suggestion, "(^|\s)@[a-z\d-]+"])}
          >
            <Text
              style={{
                fontSize: 14,
              }}
              children={`${suggestion} `}
            />
          </TouchableOpacity>
        ),
      )}
    </View>
  ),
};

export default SegmentedTextInput;
