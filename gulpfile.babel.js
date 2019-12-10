import { spawn } from 'child_process';
import { readdirSync } from 'fs';

import autoprefixer from 'autoprefixer';
import browserSync from 'browser-sync';
import gulp from 'gulp';
import cssnano from 'gulp-cssnano';
import extReplace from 'gulp-ext-replace';
import htmlmin from 'gulp-htmlmin';
import inlinesource from 'gulp-inline-source';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import rename from 'gulp-rename';
import size from 'gulp-size';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import atImport from 'postcss-import';
// import rimraf from 'rimraf';
import babel from 'rollup-plugin-babel';
import rollup from 'rollup-stream';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';

import configDev from './gulp_tasks/config/dev';
import configProd from './gulp_tasks/config/prod';

/**
 * Browsersync
 */

const server = browserSync.create();

function reload() {
  server.reload();
}

function serve(done) {
  server.init(configDev.browsersync);
  done();
}

/**
 * Clean
 */

// function deleteDev(done) {
//   return rimraf(configDev.delete.src, done);
// }

// function deleteProd(done) {
//   return rimraf(configProd.delete.src, done);
// }

/**
 * Jekyll
 */

function jekyllBuildDev(done) {
  spawn(
    'bundle',
    [
      'exec',
      'jekyll',
      'build',
      `--source=${configDev.jekyll.src}`,
      `--destination=${configDev.jekyll.dest}`,
      `--config=${configDev.jekyll.config}`
    ],
    { stdio: 'inherit' }
  ).on('exit', done);
}

function jekyllBuildProd(done) {
  spawn(
    'bundle',
    [
      'exec',
      'jekyll',
      'build',
      `--source=${configProd.jekyll.src}`,
      `--destination=${configProd.jekyll.dest}`,
      `--config=${configProd.jekyll.config}`
    ],
    { stdio: 'inherit' }
  ).on('exit', done);
}

/**
 * CSS
 */

const nodeModulesPath = './node_modules';
const tachyonsPaths = () => {
  let paths = [];
  let modulePaths = readdirSync(nodeModulesPath);
  for (let path of modulePaths) {
    if (path.startsWith('tachyons')) {
      paths.push(`${nodeModulesPath}/${path}/css`);
    }
  }
  return paths;
};

let paths = tachyonsPaths();

// Concat any extra paths like so
// paths = paths.concat(`${nodeModulesPath}/path/to/file`)

let atImportConfig = {
  path: paths
};

// Compile CSS and add autoprefix things
async function stylesDev() {
  let processors = [
    atImport(atImportConfig),
    autoprefixer(configDev.styles.autoprefixer)
  ];

  await gulp
    .src(configDev.styles.src)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(postcss(processors))
    .pipe(sourcemaps.write())
    .pipe(extReplace('.css'))
    .pipe(gulp.dest(configDev.styles.dest));
}

async function stylesProd() {
  await gulp
    .src(configProd.styles.src)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      postcss([
        atImport(atImportConfig),
        autoprefixer(configDev.styles.autoprefixer)
      ])
    )
    .pipe(sourcemaps.write())
    .pipe(extReplace('.css'))
    .pipe(gulp.dest(configProd.styles.dest));
}

/**
 * JS
 */

const rollupConfig = {
  input:
    process.env.NODE_ENV !== 'development'
      ? configProd.scripts.src
      : configDev.scripts.src,
  format: 'cjs',
  sourcemap: true,
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
};

async function scriptsDev() {
  let fileName = configDev.scripts.src.split('/');
  await rollup(rollupConfig)
    .pipe(plumber())
    .pipe(source(configDev.scripts.src))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(rename(fileName[fileName.length - 1]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(configDev.scripts.dest));
}

async function scriptsProd() {
  let fileName = configProd.scripts.src.split('/');
  await rollup(rollupConfig)
    .pipe(plumber())
    .pipe(source(configProd.scripts.src))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(rename(fileName[fileName.length - 1]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(configProd.scripts.dest));
}

/**
 * Optimizations
 */

// Minify CSS styles
async function optimizeStyles() {
  await gulp
    .src(configProd.optimize.styles.src)
    .pipe(plumber())
    .pipe(cssnano(configProd.optimize.styles.options))
    .pipe(gulp.dest(configProd.optimize.styles.dest))
    .pipe(size(configProd.size));
}

// Optimize, minify and uglify JS
async function optimizeScripts() {
  await gulp
    .src(configProd.optimize.scripts.src)
    .pipe(plumber())
    .pipe(uglify(configProd.optimize.scripts.options))
    .pipe(gulp.dest(configProd.optimize.scripts.dest))
    .pipe(size(configProd.size));
}

// Optimize and minify HTML
async function optimizeHtml() {
  await gulp
    .src(configProd.optimize.html.src)
    .pipe(plumber())
    .pipe(htmlmin(configProd.optimize.html.options))
    .pipe(gulp.dest(configProd.optimize.html.dest))
    .pipe(size(configProd.size));
}

/**
 * Deployment
 */

// Upload a published build to the interwebs
async function surgeDeploy() {
  await spawn(
    'surge',
    [configProd.deploy.src, `--domain=https://${configProd.deploy.domain}`],
    { stdio: 'inherit' }
  );
}

async function inlineStylesScripts() {
  let options = {
    compress: false
  };

  await gulp
    .src(`${configProd.deploy.src}/*.html`)
    .pipe(inlinesource(options))
    .pipe(gulp.dest(configProd.deploy.dest));
}

function watch(done) {
  gulp.watch(configDev.watch.jekyll, gulp.series(jekyllBuildDev, reload));
  gulp.watch(configDev.watch.styles, gulp.series(stylesDev, reload));
  gulp.watch(configDev.watch.scripts, gulp.series(scriptsDev, reload));
  done();
}

exports.default = gulp.series(
  jekyllBuildDev,
  stylesDev,
  scriptsDev,
  serve,
  watch
);

exports.deploy = gulp.series(
  jekyllBuildProd,
  stylesProd,
  scriptsProd,
  optimizeScripts,
  optimizeStyles,
  inlineStylesScripts,
  optimizeHtml,
  surgeDeploy
);
