import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Link, Route, Routes } from "react-router-dom";
import { Layout } from "./layouts/Layout";

const Hello = () => {
  return (
    <>
      <p>Hello</p>
      <Link to="/users">Users</Link>
    </>
  );
};
const Users = () => {
  return (
    <>
      <p>Users</p>
      <Link to="/me">Me</Link>
    </>
  );
};
const Me = () => {
  return (
    <>
      <p>Me</p>
      <Link to="/">Hello</Link>
    </>
  );
};

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Hello />} />
          <Route path="/users" element={<Users />} />
          <Route path="/me" element={<Me />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));
