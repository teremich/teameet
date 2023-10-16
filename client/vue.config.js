const { defineConfig } = require('@vue/cli-service')
const path = require("path");

module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: path.resolve(__dirname, "../public"),
  devServer: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3006"
      }
    },
    allowedHosts: "all"
  }
})
