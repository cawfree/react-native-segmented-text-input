import React, {useState, useRef, useEffect} from "react";
import PropTypes from "prop-types";
import { SafeAreaView, StyleSheet, View } from "react-native";
import SegmentedTextInput, {PATTERN_MENTION} from "react-native-segmented-text-input";

const styles = StyleSheet.create({
  container: { padding: 15 },
});

export default () => {
  const ref = useRef();
  const [value, onChange] = useState(['', [["@cawfree", PATTERN_MENTION]]]);
  const [_, {length: numberOfSegments}] = value;
  console.warn(`Number of segments: ${numberOfSegments}.`);
  useEffect(
    () => {
      ref.current.focus();
    },
    [],
  );
  return (
    <SafeAreaView
    >
      <View
        style={styles.container}
      >
        <SegmentedTextInput
          multiline
          numberOfLines={3}
          ref={ref}
          value={value}
          onChange={onChange}
          placeholder="Some really, really, really, really, really long prompt."
          suggestionsContainerStyle={{
            backgroundColor: "red",
          }}
          onSuggest={(str) => new Promise(resolve => setTimeout(resolve, 2000))
            .then(() => [
              `${str}0`,
              `${str}1`,
              `${str}2`,
            ])}
        />
      </View>
    </SafeAreaView>
  );
};
