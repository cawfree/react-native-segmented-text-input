"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactNative = require("react-native");

var _typeCheck = require("type-check");

var _lodash = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var styles = _reactNative.StyleSheet.create({
  segments: {
    flexWrap: "wrap",
    flexDirection: "row"
  },
  center: {
    alignItems: "center",
    justifyContent: "center"
  }
});

var SegmentedTextInput = function SegmentedTextInput(_ref) {
  var style = _ref.style,
      textStyle = _ref.textStyle,
      textInputStyle = _ref.textInputStyle,
      invalidTextStyle = _ref.invalidTextStyle,
      _ref$value = _slicedToArray(_ref.value, 2),
      value = _ref$value[0],
      segments = _ref$value[1],
      onChange = _ref.onChange,
      patterns = _ref.patterns,
      placeholder = _ref.placeholder,
      disabled = _ref.disabled,
      shouldRenderInvalid = _ref.shouldRenderInvalid,
      max = _ref.max,
      minWidth = _ref.minWidth,
      onSuggest = _ref.onSuggest,
      minSuggestionLength = _ref.minSuggestionLength,
      suggestionDebounce = _ref.debounce,
      renderSuggestions = _ref.renderSuggestions,
      layoutAnimationDisabled = _ref.layoutAnimationDisabled,
      layoutAnimation = _ref.layoutAnimation,
      extraProps = _objectWithoutProperties(_ref, ["style", "textStyle", "textInputStyle", "invalidTextStyle", "value", "onChange", "patterns", "placeholder", "disabled", "shouldRenderInvalid", "max", "minWidth", "onSuggest", "minSuggestionLength", "debounce", "renderSuggestions", "layoutAnimationDisabled", "layoutAnimation"]);

  var ref = (0, _react.useRef)();

  var _useState = (0, _react.useState)([]),
      _useState2 = _slicedToArray(_useState, 2),
      suggestions = _useState2[0],
      setSuggestions = _useState2[1];

  var shouldPrettyAnimate = (0, _react.useCallback)(function () {
    if (!layoutAnimationDisabled) {
      _reactNative.LayoutAnimation.configureNext(layoutAnimation);
    }

    return undefined;
  }, [layoutAnimationDisabled, layoutAnimation]);

  var _useState3 = (0, _react.useState)(function () {
    return (0, _lodash.debounce)(
    /* force async */
    function (str) {
      return Promise.resolve().then(function () {
        return onSuggest(str);
      }).then(function (suggestions) {
        shouldPrettyAnimate();
        setSuggestions(suggestions);
      });
    }, suggestionDebounce);
  }),
      _useState4 = _slicedToArray(_useState3, 1),
      debouncedSuggestion = _useState4[0];

  (0, _react.useEffect)(function () {
    if (_reactNative.Platform.OS === 'android') {
      if (_reactNative.UIManager.setLayoutAnimationEnabledExperimental && !layoutAnimationDisabled) {
        _reactNative.UIManager.setLayoutAnimationEnabledExperimental(true);
      }

      shouldPrettyAnimate();
    }
  }, [layoutAnimationDisabled]); // XXX: Attempt to match the input strings into corresponding segments.

  var nextSegments = ((0, _typeCheck.typeCheck)("String", value) && value || "").split(/[ ,]+/).map(function (str) {
    return [str, Object.keys(patterns).reduce(function (selected, regExp) {
      return selected || new RegExp(regExp, "gm").test(str) && regExp;
    }, null)];
  }); // XXX: Latch the final segment (this is text that's in-dev).

  var _nextSegments = _slicedToArray(nextSegments[nextSegments.length - 1], 2),
      lastSegmentText = _nextSegments[0],
      isValidLastSegment = _nextSegments[1]; // XXX: Filter all previous segments that didn't match.


  var existingSegmentText = segments.map(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 1),
        text = _ref3[0];

    return text;
  });

  var validSegments = _toConsumableArray(nextSegments.filter(function (_ref4, i, orig) {
    var _ref5 = _slicedToArray(_ref4, 2),
        _ = _ref5[0],
        match = _ref5[1];

    return i !== orig.length - 1 && !!match;
  }).filter(function (_ref6) {
    var _ref7 = _slicedToArray(_ref6, 1),
        text = _ref7[0];

    return existingSegmentText.indexOf(text) < 0;
  })); // XXX: Prevent duplicates.


  var onChangeTextCallback = (0, _react.useCallback)(function (nextValue) {
    if (!(0, _lodash.isEqual)(value, nextValue)) {
      var _nextSegments2 = [].concat(_toConsumableArray(segments), _toConsumableArray(validSegments)).filter(function (e, i, orig) {
        return orig.indexOf(e) === i;
      });

      return onChange([nextValue, _nextSegments2]);
    }

    return undefined;
  }, [onChange, value, segments, validSegments, shouldPrettyAnimate]);
  var renderLastSegmentAsInvalid = lastSegmentText.length > 0 && !isValidLastSegment && !!shouldRenderInvalid(lastSegmentText);
  var segmentsToRender = [].concat(_toConsumableArray(segments || []), _toConsumableArray(validSegments));
  var shouldDisable = disabled || segmentsToRender.length >= max;
  (0, _react.useEffect)(function () {
    /* blur if disabled */
    if (shouldDisable) {
      setSuggestions([]);

      if (ref.current.isFocused()) {
        ref.current.blur();
      }
    }

    return undefined;
  }, [shouldDisable]);
  /* suggestion handling */

  (0, _react.useEffect)(function () {
    if (!renderLastSegmentAsInvalid && lastSegmentText.length >= minSuggestionLength) {
      /* request suggestion debounce */
      debouncedSuggestion(lastSegmentText);
    }

    return undefined;
  }, [renderLastSegmentAsInvalid, lastSegmentText, minSuggestionLength, debouncedSuggestion]);
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_reactNative.View, _extends({}, extraProps, {
    style: [styles.segments, style]
  }), segmentsToRender.map(function (_ref8, i) {
    var _ref9 = _slicedToArray(_ref8, 2),
        str = _ref9[0],
        regexp = _ref9[1];

    var Component = patterns[regexp] || _react["default"].Fragment;
    return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, {
      key: str
    }, /*#__PURE__*/_react["default"].createElement(_reactNative.View, {
      style: styles.center
    }, /*#__PURE__*/_react["default"].createElement(Component, {
      style: textStyle,
      children: str,
      onRequestDelete: function onRequestDelete() {
        var filteredSegments = segmentsToRender.filter(function (_ref10) {
          var _ref11 = _slicedToArray(_ref10, 1),
              t = _ref11[0];

          return t !== str;
        });
        shouldPrettyAnimate();
        onChange([lastSegmentText, filteredSegments]);
        /* refocus the field */

        ref.current.focus();
      }
    })), /*#__PURE__*/_react["default"].createElement(_reactNative.Text, {
      style: textStyle,
      children: " "
    }));
  }), /*#__PURE__*/_react["default"].createElement(_reactNative.TextInput, {
    pointerEvents: shouldDisable ? "none" : "auto",
    onKeyPress: function onKeyPress(_ref12) {
      var keyValue = _ref12.nativeEvent.key;

      /* delete old segments */
      if (lastSegmentText.length === 0 && segmentsToRender.length > 0) {
        if (keyValue === "Backspace") {
          onChange([lastSegmentText, segmentsToRender.filter(function (_, i, orig) {
            return i < orig.length - 1;
          })]);
          shouldPrettyAnimate();
        }
      }

      return undefined;
    },
    ref: ref,
    disabled: shouldDisable,
    style: [textStyle, textInputStyle, !!renderLastSegmentAsInvalid && invalidTextStyle, {
      minWidth: minWidth
    }].filter(function (e) {
      return !!e;
    }),
    placeholder: shouldDisable ? "" : placeholder,
    value: lastSegmentText,
    onChangeText: onChangeTextCallback
  })), !shouldDisable && lastSegmentText.length >= minSuggestionLength && Array.isArray(suggestions) && suggestions.length > 0 && renderSuggestions({
    suggestions: suggestions,
    // XXX: Assert that the selected suggestion must conform to the expected format.
    pickSuggestion: function pickSuggestion(_ref13) {
      var _ref14 = _slicedToArray(_ref13, 2),
          suggestion = _ref14[0],
          regexp = _ref14[1];

      if (!(0, _typeCheck.typeCheck)("String", suggestion)) {
        throw new Error("Expected String suggestion, encountered ".concat(suggestion, "."));
      } else if (!(0, _typeCheck.typeCheck)("String", regexp)) {
        throw new Error("Expected String regexp, encountered ".concat(regexp, "."));
      }

      debouncedSuggestion.cancel();
      setSuggestions([]);
      shouldPrettyAnimate();
      onChange(['', [].concat(_toConsumableArray(segmentsToRender), [[suggestion, regexp]])]);
    }
  }));
};

SegmentedTextInput.propTypes = {
  value: _propTypes["default"].arrayOf(_propTypes["default"].any),
  onChangeText: _propTypes["default"].func,
  patterns: _propTypes["default"].shape({}),
  placeholder: _propTypes["default"].string,
  disabled: _propTypes["default"].bool,
  segments: _propTypes["default"].arrayOf(_propTypes["default"].arrayOf(_propTypes["default"].string)),
  onChangeSegments: _propTypes["default"].func,
  textStyle: _propTypes["default"].oneOfType([_propTypes["default"].shape({}), _propTypes["default"].number]),
  textInputStyle: _propTypes["default"].oneOfType([_propTypes["default"].shape({}), _propTypes["default"].number]),
  invalidTextStyle: _propTypes["default"].oneOfType([_propTypes["default"].shape({}), _propTypes["default"].number]),
  shouldRenderInvalid: _propTypes["default"].func,
  max: _propTypes["default"].number,
  minWidth: _propTypes["default"].number,
  onSuggest: _propTypes["default"].func,
  minSuggestionLength: _propTypes["default"].number,
  debounce: _propTypes["default"].number,
  renderSuggestions: _propTypes["default"].func,
  layoutAnimationDisabled: _propTypes["default"].bool,
  layoutAnimation: _propTypes["default"].shape({})
};
SegmentedTextInput.defaultProps = {
  value: ['', []],
  onChange: Promise.resolve,
  patterns: _defineProperty({}, "(^|\s)@[a-z\d-]+", function sAZd(_ref15) {
    var style = _ref15.style,
        onRequestDelete = _ref15.onRequestDelete,
        extraProps = _objectWithoutProperties(_ref15, ["style", "onRequestDelete"]);

    return /*#__PURE__*/_react["default"].createElement(_reactNative.TouchableOpacity, {
      onPress: onRequestDelete
    }, /*#__PURE__*/_react["default"].createElement(_reactNative.Text, _extends({}, extraProps, {
      style: [style, {
        fontWeight: "bold"
      }]
    })));
  }),
  placeholder: "Add some @mentions...",
  disabled: false,
  textStyle: {
    fontSize: 28
  },
  textInputStyle: {},
  invalidTextStyle: {
    color: "red"
  },

  /* don't mark the first character as an invalid animation */
  shouldRenderInvalid: function shouldRenderInvalid(str) {
    return !str.startsWith("@");
  },
  max: 3,
  minWidth: 100,
  onSuggest: function onSuggest(text) {
    return Promise.resolve([]);
  },
  minSuggestionLength: 2,
  debounce: 250,
  renderSuggestions: function renderSuggestions(_ref16) {
    var suggestions = _ref16.suggestions,
        pickSuggestion = _ref16.pickSuggestion;
    return /*#__PURE__*/_react["default"].createElement(_reactNative.View, {
      style: {
        flexDirection: "row"
      }
    }, suggestions.map(function (suggestion, i) {
      return /*#__PURE__*/_react["default"].createElement(_reactNative.TouchableOpacity, {
        key: i,
        onPress: function onPress() {
          return pickSuggestion([suggestion, "(^|\s)@[a-z\d-]+"]);
        }
      }, /*#__PURE__*/_react["default"].createElement(_reactNative.Text, {
        style: {
          fontSize: 14
        },
        children: "".concat(suggestion, " ")
      }));
    }));
  },
  layoutAnimationDisabled: false,
  layoutAnimation: _reactNative.LayoutAnimation.Presets.easeInEaseOut
};
var _default = SegmentedTextInput;
exports["default"] = _default;