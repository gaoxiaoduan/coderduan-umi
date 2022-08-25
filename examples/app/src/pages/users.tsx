import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { KeepAliveContext } from "@coderduan-umi/keepalive";

const Users = () => {
  const [count, setCount] = useState(0);
  const { pathname } = useLocation();
  const { dropByCacheKey } = useContext(KeepAliveContext);
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

export default Users;
