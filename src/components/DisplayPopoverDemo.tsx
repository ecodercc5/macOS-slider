import React, { useEffect, useState } from "react";
import { Card } from "./Card";
import { TestSlider } from "./TestSlider";

export const DisplayPopoverDemo = () => {
  const [value, setValue] = useState(1);

  useEffect(() => {
    document.documentElement.style.filter = `brightness(${value})`;
  }, [value]);

  return (
    <Card>
      <span className="control__title">Display</span>
      <TestSlider
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
        }}
      />
    </Card>
  );
};
