import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Page, Content, Header, Footer } from "@alita/flow";
import { useKeepOutlets } from "@coderduan-umi/keepalive";
import { Badge, NavBar, TabBar } from "antd-mobile";
import { AppOutline, UnorderedListOutline } from "antd-mobile-icons";
import "./index.css";

const Layout = () => {
  const { pathname } = useLocation();
  const element = useKeepOutlets();
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState(pathname);

  const tabs = [
    {
      key: "/",
      title: "首页",
      icon: <AppOutline />,
      badge: Badge.dot,
    },
    {
      key: "/users",
      title: "我的待办",
      icon: <UnorderedListOutline />,
      badge: "5",
    },
  ];

  const titleHash = {
    "/": "首页",
    "/users": "我的待办",
  };

  return (
    <Page className="coderduan-umi-layout">
      {/* <Header>当前路由:{pathname}</Header> */}
      <Header>
        <NavBar>{titleHash[activeKey]}</NavBar>
      </Header>

      <Content>{element}</Content>

      <Footer>
        <TabBar
          onChange={(value) => {
            setActiveKey(value);
            navigate(value);
          }}
          activeKey={activeKey}
        >
          {tabs.map((item: any) => (
            <TabBar.Item
              key={item.key}
              icon={item.icon}
              title={item.title}
              badge={item.badge}
            />
          ))}
        </TabBar>
      </Footer>
    </Page>
  );
};
export default Layout;
