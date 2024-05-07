const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Add the CopyPlugin configuration to the webpackConfig plugins array
      webpackConfig.plugins.push(
        new CopyPlugin({
          patterns: [{ from: 'node_modules/node-unrar-js/esm/js/*.wasm', to: 'assets/[name][ext]' }],
        })
      );
      
      return webpackConfig;
    }
  }
};