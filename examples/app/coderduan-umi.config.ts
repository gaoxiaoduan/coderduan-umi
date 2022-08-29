export default {
  title: "Hello coderduan-umi",
  keepalive: [/./, "/users"],
  proxy: {
    "/api": {
      target: "http://jsonplaceholder.typicode.com/",
      changeOrigin: true,
      pathRewrite: { "^/api": "" },
    },
  },
};
