import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Page, Content, Header } from "@alita/flow";
export const Layout = () => {
  const { pathname } = useLocation();
  return (
    <Page>
      <Header>当前路由:{pathname}</Header>
      <Content>
        <Outlet />
      </Content>
    </Page>
  );
};
