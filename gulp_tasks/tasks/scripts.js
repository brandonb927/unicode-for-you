import runSequence from 'run-sequence'
import { reload } from 'browser-sync'
import gulp from 'gulp'
import babel from 'gulp-babel'
import duration from 'gulp-duration'
import plumber from 'gulp-plumber'
import sourcemaps from 'gulp-sourcemaps'

import configDev from '../config/dev'
import configProd from '../config/prod'
import errorHandler from '../utils/errorHandler'

gulp.task('scripts:dev', () => {
  return gulp.src(configDev.scripts.src)
             .pipe(plumber({errorHandler: errorHandler}))
             .pipe(sourcemaps.init())
             .pipe(babel())
             .pipe(sourcemaps.write())
             .pipe(duration('Compiling scripts for development'))
             .pipe(gulp.dest(configDev.scripts.dest))
             .pipe(reload({stream: true}))
})

// Compile babel js files
gulp.task('scripts:prod', () => {
  return gulp.src(configProd.scripts.src)
             .pipe(plumber({errorHandler: errorHandler}))
             .pipe(sourcemaps.init())
             .pipe(babel())
             .pipe(sourcemaps.write())
             .pipe(duration('Compiling scripts for production'))
             .pipe(gulp.dest(configProd.scripts.dest))
})
