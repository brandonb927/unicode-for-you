import { readdirSync } from 'fs'
import { notify, reload } from 'browser-sync'
import autoprefixer from 'autoprefixer'
import atImport from 'postcss-import'
import gulp from 'gulp'
import duration from 'gulp-duration'
import postcss from 'gulp-postcss'
import plumber from 'gulp-plumber'
import extReplace from 'gulp-ext-replace'
import sourcemaps from 'gulp-sourcemaps'

import configDev from '../config/dev'
import configProd from '../config/prod'
import errorHandler from '../utils/errorHandler'

const nodeModulesPath = './node_modules'
const tachyonsPaths = () => {
  let paths = []
  let modulePaths = readdirSync(nodeModulesPath)
  for (let path of modulePaths) {
    if (path.startsWith('tachyons')) {
      paths.push(`${nodeModulesPath}/${path}/css`)
    }
  }
  return paths
}

let paths = tachyonsPaths()

// Concat any extra paths like so
// paths = paths.concat(`${nodeModulesPath}/normalize.css`)

let atImportConfig = {
  path: paths
}

// Compile CSS and add autoprefix things
gulp.task('styles:dev', () => {
  notify('Compiling styles for development')

  let processors = [
    atImport(atImportConfig),
    autoprefixer(configDev.styles.autoprefixer)
  ]

  return gulp.src(configDev.styles.src)
             .pipe(plumber({errorHandler: errorHandler}))
             .pipe(sourcemaps.init())
             .pipe(postcss(processors))
             .pipe(duration('Compiling styles for development'))
             .pipe(sourcemaps.write())
             .pipe(extReplace('.css'))
             .pipe(gulp.dest(configDev.styles.dest))
             .pipe(reload({stream: true}))
})

gulp.task('styles:prod', () => {
  notify('Compiling styles for production')

  return gulp.src(configProd.styles.src)
             .pipe(plumber({errorHandler: errorHandler}))
             .pipe(sourcemaps.init())
             .pipe(postcss([
               atImport(atImportConfig),
               autoprefixer(configDev.styles.autoprefixer)
             ]))
             .pipe(duration('Compiling styles for production'))
             .pipe(sourcemaps.write())
             .pipe(extReplace('.css'))
             .pipe(gulp.dest(configProd.styles.dest))
})
