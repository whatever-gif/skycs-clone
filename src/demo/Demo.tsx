import { TextBox } from "devextreme-react";

const Demo = () => {
  const maskRules = {
    // a single character
    S: "$",

    // a regular expression
    H: /[0-9A-F]/,

    // an array of characters
    N: ["$", "%", "&", "@"],

    // a function
    F: (char: any) => {
      return char == char.toUpperCase();
    },
  };

  return (
    <div className="p-4">
      <TextBox
        mask="000:00:00"
        maskInvalidMessage="The input value does not match the mask"
        width={100}
      />
    </div>
  );
};

export default Demo;
