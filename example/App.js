import React, {useState} from "react";
import PropTypes from "prop-types";
import { SafeAreaView, StyleSheet, View } from "react-native";
import SegmentedTextInput from "react-native-segmented-text-input";

export default () => {
  const [value, onChange] = useState(['', []]);
  return (
    <SegmentedTextInput
      value={value}
      onChange={onChange}
    />
  );
};
