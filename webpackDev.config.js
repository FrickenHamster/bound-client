import webpack from 'webpack';

export default {
  devServer: {
    open: true,
    openPage: 'src/index.html',
    port: 2654,
    hot: false,
    inline: false,
    liveReload: false,
  },
  entry: ['babel-polyfill', './src/index.js'],

  plugins: [
    new webpack.DefinePlugin({
      ENV: `'development'`,
    }),
  ],

  module: {
    rules: [
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false, // disable the behaviour
        },
      },
      {
        loader: 'babel-loader',
        options: {
          plugins: ['@babel/syntax-dynamic-import'],
          presets: [
            [
              '@babel/preset-env',
              {
                modules: false,
              },
            ],
          ],
        },
        test: /\.js$/,
      },
      {
        test: /\.(scss|css)$/,

        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: {
          loader: 'html-loader',
          options: {
            sources: false,
          },
        },
      },
    ],
  },

  output: {
    filename: 'bundle.js',
  },

  mode: 'development',
  devtool: 'source-map',
};
