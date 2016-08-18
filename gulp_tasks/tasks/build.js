import gulp from 'gulp'
import runSequence from 'run-sequence'

// Run the build
gulp.task('build:dev', (callback) => {
  runSequence(
    'delete:dev',
  'unicode_scraper',
    'jekyll-build:dev',
    [
      'styles:dev',
      'scripts:dev'
    ],
    callback
  )
})

gulp.task('build:prod', (callback) => {
  runSequence(
    'delete:prod',
    'unicode_scraper',
    'jekyll-build:prod',
    [
      'styles:prod',
      'scripts:prod'
    ],
    callback
  )
})
