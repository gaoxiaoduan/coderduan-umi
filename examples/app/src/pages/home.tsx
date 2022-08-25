import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./home.css";

const Hello = () => {
  const [text, setText] = useState("Hello coderduan-umi~");
  const [count, setCount] = useState(0);
  return (
    <>
      <p className="coderduan-umi-home" onClick={() => setText("Hi~")}>
        {text}
      </p>
      <p>{count}</p>
      <p>
        <button onClick={() => setCount((count) => count + 1)}>
          Add count
        </button>
      </p>
      <Link to="/users">Users</Link>
    </>
  );
};
export default Hello;
