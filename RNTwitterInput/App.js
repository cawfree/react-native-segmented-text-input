import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import {name as faker} from "faker";

const {firstName} = faker;

import SegmentedTextInput from "./lib";

export default () => {
  const [value, onChange] = useState(['', []]);
  return (
    <SafeAreaView>
      <SegmentedTextInput
        value={value}
        onChange={onChange}
        onSuggest={(text) => new Promise(
          resolve => setTimeout(resolve, 200),
        ).then(
          () => [...Array(3)]
            .map(() => `@${firstName()}`),
        )}
      />
    </SafeAreaView>
  );
};
