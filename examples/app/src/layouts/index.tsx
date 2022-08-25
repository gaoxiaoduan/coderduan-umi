import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Page, Content, Header } from "@alita/flow";
import { useKeepOutlets } from "@coderduan-umi/keepalive";
import "./index.css";

const Layout = () => {
  const { pathname } = useLocation();
  const element = useKeepOutlets();
  return (
    <Page className="coderduan-umi-layout">
      <Header>当前路由:{pathname}</Header>
      <Content>
        {/* <Outlet /> */}
        {element}
      </Content>
    </Page>
  );
};
export default Layout;
