
const webpack = require('webpack')
const path = require('path')
const HTMLWEBPACKPLUGIN = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const PostcssPresetEnv = require('postcss-preset-env');





module.exports = {
    entry: '/src/index.tsx',
    devtool:"source-map",
    output: {
        path: path.join(__dirname,'/dist'),
        filename: "bundle.js",
        assetModuleFilename : 'images/[hash][ext][query]'
    },
    plugins : [
        new CleanWebpackPlugin(),
        new HTMLWEBPACKPLUGIN({
            template : 'index.html'
        }), new MiniCssExtractPlugin(),
        new webpack.ProvidePlugin({
            // Make a global `process` variable that points to the `process` package,
            // because the `util` package expects there to be a global variable named `process`.
                 // Thanks to https://stackoverflow.com/a/65018686/14239942
            process: 'process/browser'})
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js' ,'.jsx' ,'css' ,'module.css'],
        fallback: {process:require.resolve('process')}
      },
    module:{
       
 rules:[{
    test: /.(js|jsx|ts|tsx)$/,
    exclude: /node_modules/,
    use:[
        {loader:'babel-loader',
        options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        
    },]

},
 {
    test: /.css$/,
    exclude: /node_modules/,
    use:[MiniCssExtractPlugin.loader, {
        loader:'css-loader',
        options:{

            importLoaders: 1,
            modules: true,
        }
    }, 
    "postcss-loader",
            
]
},{
    test: /\.(png|jpe?g|gif|svg)$/i,
    type: 'asset/resource'
},{
    test: /\.(woff(2)?|eot|ttf|otf|svg)$/i,
    type: 'asset/inline'
}   
],

    },
    devServer:{
        port: 9000,
        hot:true,
        open:true,
        static: {
            directory: path.join(__dirname, 'public'),
          },
          client: {
            overlay: {
              errors: true,
              warnings: false,
            }
          },
    },
    stats: 'errors-only',


    
}