import React, {useState} from "react";
import PropTypes from "prop-types";
import { SafeAreaView, StyleSheet, View } from "react-native";
import SegmentedTextInput from "react-native-segmented-text-input";

const styles = StyleSheet.create({
  container: { padding: 15 },
});

export default () => {
  const [value, onChange] = useState(['', []]);
  return (
    <SafeAreaView
    >
      <View
        style={styles.container}
      >
        <SegmentedTextInput
          value={value}
          onChange={onChange}
          onSuggest={() => new Promise(resolve => setTimeout(resolve, 200))
            .then(() => [
              "@some",
              "@fake",
              "@suggestions",
            ])}
        />
      </View>
    </SafeAreaView>
  );
};
