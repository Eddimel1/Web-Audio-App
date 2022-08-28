const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
module.exports = {
    mode: 'development',
    devtool:'eval-source-map',
    plugins: [
       new ReactRefreshWebpackPlugin(),
      ].filter(Boolean),
}