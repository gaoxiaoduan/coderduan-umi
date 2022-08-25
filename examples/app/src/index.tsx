import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import KeepAliveLayout from "@coderduan-umi/keepalive";
import Layout from "./layouts/index";
import Home from "./pages/home";
import Users from "./pages/users";
import Me from "./pages/me";

const App = () => {
  return (
    <KeepAliveLayout keepalive={[/./]}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
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
