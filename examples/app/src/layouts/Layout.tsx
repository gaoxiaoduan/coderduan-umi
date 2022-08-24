import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Page, Content, Header } from "@alita/flow";
import { useKeepOutlets } from "@coderduan-umi/keepalive";
export const Layout = () => {
  const { pathname } = useLocation();
  const element = useKeepOutlets();
  return (
    <Page>
      <Header>当前路由:{pathname}</Header>
      <Content>
        {/* <Outlet /> */}
        {element}
      </Content>
    </Page>
  );
};
