import React from "react";
import ReactDOM from "react-dom";
const Hello = () => {
  const [text, setText] = React.useState("Hello coderduan-umi!");
  return (
    <span
      onClick={() => {
        setText("Hi!");
      }}
    >
      {text}
    </span>
  );
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(Hello));
