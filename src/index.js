import React, {useState, useCallback, useEffect, useRef} from "react";
import PropTypes from "prop-types";
import { ActivityIndicator, Platform, Text, TextInput, View, StyleSheet, TouchableOpacity } from "react-native";
import { typeCheck } from "type-check";
import { isEqual, debounce } from "lodash";
import { useDebounce } from "use-debounce";

const styles = StyleSheet.create({
  segments: { flexWrap: "wrap", flexDirection: "row" },
  center: { alignItems: "center", justifyContent: "center" },
});

export const PATTERN_MENTION = "(^|\s)@[a-z_\d-]+";
export const PATTERN_HASHTAG = "(^|\s)#[a-z_\d-]+";

const SegmentedTextInput = React.forwardRef(
  (
    {
      style,
      textStyle,
      textInputStyle,
      invalidTextStyle,
      segmentContainerStyle,
      value: [value, segments],
      onChange,
      patterns,
      placeholder,
      placeholderTextColor,
      disabled,
      shouldRenderInvalid,
      max,
      onSuggest,
      suggestionsContainerStyle,
      minSuggestionLength,
      debounce: suggestionDebounce,
      renderSuggestions,
      multiline,
      numberOfLines,
      ...extraProps
    },
    providedRef,
  ) => {
    const localRef = useRef();
    const ref = providedRef || localRef;
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [debouncedLoading] = useDebounce(loadingSuggestions, suggestionDebounce * 0.5);
    const [debouncedSuggestions, {flush}] = useDebounce(suggestions, suggestionDebounce * 0.5);

    const [debouncedSuggestion] = useState(
      () => debounce(
        async (str) => {
          try {
            setLoadingSuggestions(true);
            setSuggestions(await onSuggest(str));
          } catch (e) {
            console.error(e);
          } finally {
            setLoadingSuggestions(false);
          }
        },
        suggestionDebounce,
      ),
    );

    const nextSegments = React.useMemo(
      () => {
        return ((typeCheck("String", value) && value)  || "")
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
      },
      [value, patterns],
    );

    // XXX: Latch the final segment (this is text that's in-dev).
    const [lastSegmentText, isValidLastSegment] = nextSegments[nextSegments.length - 1];

    // XXX: Filter all previous segments that didn't match.
    const existingSegmentText = React.useMemo(() => segments .map(([text]) => text), [segments]);

    const validSegments = React.useMemo(() => {
      return [
        ...nextSegments
          .filter(([_, match], i, orig) => (i !== (orig.length - 1) && !!match))
          .filter(([text]) => existingSegmentText.indexOf(text) < 0),
      ];
    }, [nextSegments, existingSegmentText]);

    React.useEffect(() => {
      lastSegmentText.trim().length === 0 && suggestions.length && setSuggestions([]);
    }, [lastSegmentText, suggestions, setSuggestions]);

    // XXX: Prevent duplicates.
    const onChangeTextCallback = useCallback(
      (nextValue) => {
        debouncedSuggestion.cancel();
        if (!isEqual(value, nextValue)) {
          const nextSegments = [...segments, ...validSegments]
            .filter((e, i, orig) => (orig.indexOf(e) === i));
          return onChange([nextValue, nextSegments]);
        }
        return undefined;
      },
      [onChange, value, segments, validSegments, debouncedSuggestion],
    ); 

    const renderLastSegmentAsInvalid = lastSegmentText.length > 0 && (!isValidLastSegment && !!shouldRenderInvalid(lastSegmentText));
    const segmentsToRender = React.useMemo(() => {
      return [...(segments || []), ...validSegments];
    }, [segments, validSegments]);
    const shouldDisable = disabled || (segmentsToRender.length >= max);

    useEffect(
      () => {
        if (shouldDisable) { /* blur if disabled */
          debouncedSuggestion.cancel();
          setSuggestions([]);
          ref.current.isFocused() && ref.current.blur();
        }
        return undefined;
      },
      [shouldDisable],
    );

    /* suggestion handling */
    useEffect(
      () => {
        if (!shouldDisable && !renderLastSegmentAsInvalid && lastSegmentText.length >= minSuggestionLength) {
          debouncedSuggestion.cancel();
          /* request suggestion debounce */
          debouncedSuggestion(lastSegmentText);
        }
        return undefined;
      },
      [renderLastSegmentAsInvalid, lastSegmentText, minSuggestionLength, debouncedSuggestion],
    );

    useEffect(
      () => {
        if (!isEqual(segmentsToRender, segments)) {
          onChange([lastSegmentText, segmentsToRender]);
        }
      },
      [segmentsToRender, segments, onChange],
    );

    const renderedSegments = React.useMemo(() => {
      return segmentsToRender.map(([str, regexp], i) => {
        const Component = patterns[regexp] || React.Fragment;
        return (
          <Component
            key={str}
            style={textStyle}
            children={str}
            onRequestDelete={() => {
              const filteredSegments = segmentsToRender.filter(
                ([t]) => t !== str
              );
              onChange([lastSegmentText, filteredSegments]);
              ref.current.focus(); /* refocus the field */
            }}
          />
        );
      });
    }, [patterns, segmentsToRender, lastSegmentText, onChange]);

    const onKeyPress = React.useCallback((e) => {
      const {
        nativeEvent: { key: keyValue },
      } = e;
      /* delete old segments */
      if (lastSegmentText.length === 0 && segmentsToRender.length > 0) {
        if (keyValue === "Backspace") {
          //debouncedSuggestion.cancel();
          onChange([
            lastSegmentText,
            segmentsToRender.filter((_, i, orig) => i < orig.length - 1),
          ]);
        }
      }
      return undefined;
    }, [lastSegmentText, segmentsToRender, onChange]);

    React.useEffect(() => {
      if ((renderLastSegmentAsInvalid || !value.length) && suggestions.length > 0) {
        setSuggestions([]);
        debouncedSuggestion.cancel();
        flush();
      }
    }, [renderLastSegmentAsInvalid, debouncedSuggestion, setSuggestions, flush]);

    const computedTextInputStyle = React.useMemo(() => {
      return [
        textStyle,
        textInputStyle,
        !!renderLastSegmentAsInvalid && invalidTextStyle,
        /* hide text field when disabled */
        !!shouldDisable && { height: 0 },
      ].filter((e) => !!e);
    }, [textStyle, textInputStyle, renderLastSegmentAsInvalid, invalidTextStyle, shouldDisable]);

    const onSubmitEditing = React.useCallback(() => {
      onChange([`${lastSegmentText} `, segmentsToRender]);
    }, [lastSegmentText, segmentsToRender]);

    //const shouldRenderSuggestions = React.useMemo(() => {
    //  return !shouldDisable && suggestions.length > 0;
    //  //return ((!shouldDisable && lastSegmentText.length >= minSuggestionLength && Array.isArray(suggestions) && suggestions.length > 0) || loadingSuggestions);
    //}, [shouldDisable, lastSegmentText, minSuggestionLength, suggestions, loadingSuggestions]);

    const shouldPickSuggestion = React.useCallback(([suggestion, regexp]) => {
      if (!typeCheck("String", suggestion)) {
        throw new Error(
          `Expected String suggestion, encountered ${suggestion}.`
        );
      } else if (!typeCheck("String", regexp)) {
        throw new Error(`Expected String regexp, encountered ${regexp}.`);
      }

      debouncedSuggestion.cancel();

      setSuggestions([]);
      onChange(["", [...segmentsToRender, [suggestion, regexp]]]);
    }, [debouncedSuggestion, setSuggestions, onChange, segmentsToRender]);
    return (
      <>
        <View {...extraProps} style={[styles.segments, style]}>
          <View style={[styles.segments, segmentContainerStyle]}>
            {renderedSegments}
          </View>
          <TextInput
            multiline={multiline}
            numberOfLines={numberOfLines}
            pointerEvents={shouldDisable ? "none" : "auto"}
            onKeyPress={onKeyPress}
            ref={ref}
            disabled={shouldDisable}
            style={computedTextInputStyle}
            placeholder={shouldDisable ? "" : placeholder}
            placeholderTextColor={placeholderTextColor}
            value={lastSegmentText}
            onChangeText={onChangeTextCallback}
            onSubmitEditing={onSubmitEditing}
          />
        </View>
        {/* TODO since the request must conform to a selected regexp, we can be the ones to pick it */}
        <View style={suggestionsContainerStyle}>
          {renderSuggestions({
            loadingSuggestions: debouncedLoading,
            suggestions: debouncedSuggestions,
            pickSuggestion: shouldPickSuggestion,
          })}
        </View>
      </>
    );
  },
);

SegmentedTextInput.propTypes = {
  value: PropTypes.arrayOf(PropTypes.any),
  onChange: PropTypes.func,
  patterns: PropTypes.shape({}),
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  disabled: PropTypes.bool,
  textStyle: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.number]),
  textInputStyle: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.number]),
  invalidTextStyle: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.number,
  ]),
  segmentContainerStyle: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.number]),
  suggestionsContainerStyle: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.number]),
  shouldRenderInvalid: PropTypes.func,
  max: PropTypes.number,
  onSuggest: PropTypes.func,
  minSuggestionLength: PropTypes.number,
  debounce: PropTypes.number,
  renderSuggestions: PropTypes.func,
  multiline: PropTypes.bool,
  numberOfLines: PropTypes.number,
};

SegmentedTextInput.defaultProps = {
  value: ['', []],
  onChange: Promise.resolve,
  patterns: {
    /* a twitter @mention */
    [PATTERN_MENTION]: ({style, onRequestDelete, children, ...extraProps}) => (
      <TouchableOpacity
        onPress={onRequestDelete}
      >
        <Text
          {...extraProps}
          style={[style, { fontWeight: "bold" }]}
          children={`${children} `}
        />
      </TouchableOpacity>
    ),
  },
  placeholder: "Add some @mentions...",
  placeholderTextColor: undefined,
  disabled: false,
  textStyle: {
    fontSize: 28,
  },
  textInputStyle: {
    minWidth: 100,
  },
  invalidTextStyle: {
    color: "red",
  },
  segmentContainerStyle: {},
  suggestionsContainerStyle: {},
  /* don't mark the first character as an invalid animation */
  shouldRenderInvalid: str => !str.startsWith("@"),
  max: 3,
  onSuggest: text => Promise.resolve([]),
  minSuggestionLength: 2,
  debounce: 350,
  renderSuggestions: ({loadingSuggestions, suggestions, pickSuggestion}) => (
    <View
      pointerEvents={loadingSuggestions ? "none" : "auto"}
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    > 
      {!!loadingSuggestions && (
        <ActivityIndicator />
      )}
      {suggestions.map(
        (suggestion, i) => (
          <TouchableOpacity
            key={i}
            style={{
              opacity: loadingSuggestions ? 0.4 : 1.0,
            }}
            onPress={() => pickSuggestion([suggestion, PATTERN_MENTION.toString()])}
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
  multiline: false,
  numberOfLines: 1,
};

export default React.memo(SegmentedTextInput);
