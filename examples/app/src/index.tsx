import React, { useState, useContext } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "./layouts/Layout";
import KeepAliveLayout, { KeepAliveContext } from "@coderduan-umi/keepalive";

const Hello = () => {
  const [text, setText] = useState("Hello coderduan-umi~");
  const [count, setCount] = useState(0);
  return (
    <>
      <p onClick={() => setText("Hi~")}>{text}</p>
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

const Users = () => {
  const [count, setCount] = useState(0);
  const { pathname } = useLocation();
  const { dropByCacheKey } = useContext<any>(KeepAliveContext);
  return (
    <>
      <p>Users</p>
      <p>{count}</p>
      <p>
        <button onClick={() => setCount((count) => count + 1)}>
          Add count
        </button>
      </p>
      <p>
        <button onClick={() => dropByCacheKey(pathname)}>Clear cache!</button>
      </p>
      <Link to="/me">to Me</Link>
    </>
  );
};

const Me = () => {
  return (
    <>
      <p>Me</p>
      <Link to="/">to Hello</Link>
    </>
  );
};

const App = () => {
  return (
    <KeepAliveLayout keepalive={[/./]}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Hello />} />
            <Route path="/users" element={<Users />} />
            <Route path="/me" element={<Me />} />
          </Route>
        </Routes>
      </HashRouter>
    </KeepAliveLayout>
  );
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));
