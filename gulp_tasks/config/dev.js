// Development config

const { existsSync } = require('fs');
const { extname, join, resolve } = require('path');
const { parse } = require('url');
const { merge } = require('lodash');

const baseConfig = require('./base');

// Paths
const src = baseConfig.src.base;
const srcAssets = baseConfig.src.assets;
const build = resolve(src, 'build_dev');
const buildAssets = resolve(build, 'assets');

const devBuildConfigFilename = resolve(src, '_config_dev.yml');
const buildConfigFilename = `${baseConfig.jekyll.baseConfig},${devBuildConfigFilename}`;

// Config
const baseDevConfig = {
  browsersync: {
    server: {
      baseDir: build,
      middleware: [
        (req, res, next) => {
          // middleware for clean, extensionless URLs
          let uri = parse(req.url);
          if (
            uri.pathname.length > 1 &&
            extname(uri.pathname) === '' &&
            existsSync(`${join(build, uri.pathname)}.html`)
          ) {
            req.url = `${uri.pathname}.html${uri.search || ''}`;
          }
          next();
        }
      ]
    },
    port: 8888,
    ui: {
      port: 9001
    },
    open: false
  },
  delete: {
    src: `${build}/**/*`
  },
  styles: {
    src: `${srcAssets}/styles/site.pcss`,
    dest: `${buildAssets}/styles`
  },
  scripts: {
    src: `${srcAssets}/scripts/app.js`,
    dest: `${buildAssets}/scripts`
  },
  jekyll: {
    src: src,
    dest: build,
    config: buildConfigFilename
  }
};

const devConfig = merge(baseDevConfig, baseConfig);
module.exports = devConfig;
