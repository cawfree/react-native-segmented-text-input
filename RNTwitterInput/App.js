import React, { useState } from "react";
import { SafeAreaView } from "react-native";

import SegmentedTextInput from "./lib";

export default () => {
  const [value, onChange] = useState(['', []]);
  return (
    <SafeAreaView>
      <SegmentedTextInput
        value={value}
        onChange={onChange}
      />
    </SafeAreaView>
  );
};
