import browserSync from 'browser-sync';
import gulp from 'gulp';
import duration from 'gulp-duration';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import rollup from 'rollup-stream';
import babel from 'rollup-plugin-babel';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';

import configDev from '../config/dev';
import configProd from '../config/prod';
import errorHandler from '../utils/errorHandler';

const reload = browserSync.reload;

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

gulp.task('scripts:dev', () => {
  let fileName = configDev.scripts.src.split('/');
  return rollup(rollupConfig)
    .pipe(plumber({ errorHandler: errorHandler }))
    .pipe(source(configDev.scripts.src))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(rename(fileName[fileName.length - 1]))
    .pipe(sourcemaps.write('.'))
    .pipe(duration('Compiling scripts for development'))
    .pipe(gulp.dest(configDev.scripts.dest))
    .pipe(reload({ stream: true }));
});

gulp.task('scripts:prod', () => {
  let fileName = configProd.scripts.src.split('/');
  return rollup(rollupConfig)
    .pipe(plumber({ errorHandler: errorHandler }))
    .pipe(source(configProd.scripts.src))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(rename(fileName[fileName.length - 1]))
    .pipe(sourcemaps.write('.'))
    .pipe(duration('Compiling scripts for production'))
    .pipe(gulp.dest(configProd.scripts.dest));
});
