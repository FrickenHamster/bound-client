import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';

import webpackConfig from './webpackDev.config.js';
import webpackAlphaConfig from './webpackAlpha.config.js';

import devConfig from './config/dev.json' assert { type: 'json' };
import alphaConfig from './config/alpha.json' assert { type: 'json' };

let wConfig;
let gConfig;

switch (process.env.NODE_ENV) {
  case 'development':
    wConfig = webpackConfig;
    gConfig = devConfig;
    break;
  case 'alpha':
    wConfig = webpackAlphaConfig;
    gConfig = alphaConfig;
    break;
}

const compiler = webpack(wConfig);

import express from 'express';

const app = express();

import open from 'open';

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: '/',
    stats: { colors: true },
  }),
);

app.get('/', (req, res) => res.sendFile('src/index.html', { root: '.' }));

app.use(express.static('static'));

app.listen(gConfig.servingPort, () =>
  console.log(`Serving dev server on ${gConfig.servingPort}`),
);

open(`${gConfig.servingHost}:${gConfig.servingPort}`);
