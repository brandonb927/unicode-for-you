import gulp from 'gulp'
import duration from 'gulp-duration'
import cssnano from 'gulp-cssnano'
import htmlmin from 'gulp-htmlmin'
import plumber from 'gulp-plumber'
import size from 'gulp-size'
import uglify from 'gulp-uglify'

import config from '../config/prod'
import sizeConfig from '../config/prod'
import errorHandler from '../utils/errorHandler'


// Minify CSS styles
gulp.task('optimize:styles', () => {
  return gulp.src(config.optimize.styles.src)
             .pipe(plumber({errorHandler:errorHandler}))
             .pipe(cssnano(config.optimize.styles.options))
             .pipe(duration('Optimizing and minifying CSS for production'))
             .pipe(gulp.dest(config.optimize.styles.dest))
             .pipe(size(sizeConfig.size))
})

// Optimize, minify and uglify JS
gulp.task('optimize:scripts', () => {
  return gulp.src(config.optimize.scripts.src)
             .pipe(plumber({errorHandler:errorHandler}))
             .pipe(uglify(config.optimize.scripts.options))
             .pipe(duration('Optimizing, minifying and minifying JS for production'))
             .pipe(gulp.dest(config.optimize.scripts.dest))
             .pipe(size(sizeConfig.size))
})

// Optimize and minify HTML
gulp.task('optimize:html', () => {
  return gulp.src(config.optimize.html.src)
             .pipe(plumber({errorHandler:errorHandler}))
             .pipe(htmlmin(config.optimize.html.options))
             .pipe(duration('Optimizing and minifying HTML for production'))
             .pipe(gulp.dest(config.optimize.html.dest))
             .pipe(size(sizeConfig.size))
})

gulp.task('optimize', [
  'optimize:styles',
  'optimize:scripts',
  'optimize:html'
])