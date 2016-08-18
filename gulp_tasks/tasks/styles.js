import { notify, reload } from 'browser-sync'
import autoprefixer from 'autoprefixer'
import atImport from 'postcss-partial-import'
import gulp from 'gulp'
import duration from 'gulp-duration'
import postcss from 'gulp-postcss'
import plumber from 'gulp-plumber'
import sourcemaps from 'gulp-sourcemaps'

import config from '../config/base'
import configDev from '../config/dev'
import configProd from '../config/prod'
import errorHandler from '../utils/errorHandler'

// Compile CSS and add autoprefix things
gulp.task('styles:dev', () => {
  notify('Compiling styles for development')

  return gulp.src(configDev.styles.src)
             .pipe(plumber({errorHandler:errorHandler}))
             .pipe(sourcemaps.init())
             .pipe(postcss([
               atImport(),
               autoprefixer(configDev.styles.autoprefixer)
             ]))
             .pipe(duration('Compiling styles for development'))
             .pipe(sourcemaps.write())
             .pipe(gulp.dest(configDev.styles.dest))
             .pipe(reload({stream:true}))
})

gulp.task('styles:prod', () => {
  notify('Compiling styles for production')

  return gulp.src(configProd.styles.src)
             .pipe(plumber({errorHandler:errorHandler}))
             .pipe(sourcemaps.init())
             .pipe(postcss([
               atImport(),
               autoprefixer(configDev.styles.autoprefixer)
             ]))
             .pipe(duration('Compiling styles for production'))
             .pipe(sourcemaps.write())
             .pipe(gulp.dest(configProd.styles.dest))
})
