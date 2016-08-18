import gulp from 'gulp'
import { argv } from 'yargs'
import runSequence from 'run-sequence'

// Run the build
gulp.task('build:dev', (callback) => {
  if (argv.updateUnicode) {
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
  } else {
    runSequence(
      'delete:dev',
      'jekyll-build:dev',
      [
        'styles:dev',
        'scripts:dev'
      ],
      callback
    )
  }
})

gulp.task('build:prod', (callback) => {
  if (argv.updateUnicode) {
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
  } else {
    runSequence(
      'delete:prod',
      'jekyll-build:prod',
      [
        'styles:prod',
        'scripts:prod'
      ],
      callback
    )
  }
})
