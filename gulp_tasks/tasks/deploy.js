import cp from 'child_process'
import gulp from 'gulp'
import inlinesource from 'gulp-inline-source'
import duration from 'gulp-duration'
import runSequence from 'run-sequence'

import deployConfig from '../config/prod'

const deployHtmlPath = `${deployConfig.deploy.src}/*.html`

// Upload a published build to the interwebs
gulp.task('surge-deploy', (callback) => {
  return cp.spawn(
    'surge',
    [
      deployConfig.deploy.src,
      `--domain=https://${deployConfig.deploy.domain}`
    ],
    { stdio: 'inherit' }
  ).on('close', callback)
})

gulp.task('inlinesource', () => {
  let options = {
    compress: false
  }

  return gulp.src(deployHtmlPath)
             .pipe(inlinesource(options))
             .pipe(duration('Inlining styles and scripts'))
             .pipe(gulp.dest(deployConfig.deploy.dest))
})

gulp.task('deploy', (callback) => {
  runSequence(
    'build:prod',
    [
      'optimize:scripts',
      'optimize:styles'
    ],
    'inlinesource',
    'optimize:html',
    'surge-deploy',
    callback
  )
})
