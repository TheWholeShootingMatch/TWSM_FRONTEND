const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target: "http://http://13.124.192.207/",
      changeOrigin: true,
    })
  );
};
