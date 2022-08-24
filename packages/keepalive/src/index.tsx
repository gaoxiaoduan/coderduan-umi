import React, { createContext, useContext } from "react";
import { useOutlet, useLocation, matchPath } from "react-router-dom";
import type { FC } from "react";

export const KeepAliveContext = createContext<KeepAliveLayoutProps>({
  keepalive: [],
  keepElements: [],
});

const isKeepPath = (aliveList: any[], path: string) => {
  let isKeep = false;
  aliveList.map((item) => {
    if (item === path) {
      isKeep = true;
    }
    if (item instanceof RegExp && item.test(path)) {
      isKeep = true;
    }
    if (typeof item === "string" && item.toLowerCase() === path) {
      isKeep = true;
    }
  });
  return isKeep;
};

export function useKeepOutlets() {
  const location = useLocation();
  const element = useOutlet();
  const { keepalive, keepElements } = useContext<any>(KeepAliveContext);
  const isKeep = isKeepPath(keepalive, location.pathname);
  if (isKeep) {
    keepElements.current[location.pathname] = element;
  }

  const divWrapStyle = {
    height: "100%",
    width: "100%",
    position: "relative",
    overflow: "hidden auto",
  };

  return (
    <>
      {Object.entries(keepElements.current).map(([pathname, element]: any) => (
        <div
          key={pathname}
          className="runtime-keep-alive-layout"
          style={divWrapStyle}
          hidden={!matchPath(location.pathname, pathname)}
        >
          {element}
        </div>
      ))}
      <div
        className="runtime-keep-alive-layout-no"
        style={divWrapStyle}
        hidden={isKeep}
      >
        {!isKeep && element}
      </div>
    </>
  );
}

interface KeepAliveLayoutProps {
  keepalive: any[];
  keepElements?: any;
  dropByCacheKey?: (path: string) => void;
}

const KeepAliveLayout: FC<KeepAliveLayoutProps> = (props) => {
  const { keepalive, ...other } = props;
  const keepElements = React.useRef<any>({});
  function dropByCacheKey(path: string) {
    keepElements.current[path] = null;
  }
  return (
    <KeepAliveContext.Provider
      value={{ keepalive, keepElements, dropByCacheKey }}
      {...other}
    />
  );
};

export default KeepAliveLayout;
