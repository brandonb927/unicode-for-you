import gulp from 'gulp'
import { argv } from 'yargs'
import runSequence from 'run-sequence'

// Run the build
gulp.task('build:dev', (callback) => {
  if (argv.updateUnicode) {
    runSequence(
      // 'delete:dev',
      'jekyll-build:dev',
      [
        'styles:dev',
        'scripts:dev'
      ],
      'unicode_scraper:dev',
      callback
    )
  } else {
    runSequence(
      // 'delete:dev',
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
      // 'delete:prod',
      'jekyll-build:prod',
      [
        'styles:prod',
        'scripts:prod'
      ],
      'unicode_scraper:prod',
      callback
    )
  } else {
    runSequence(
      // 'delete:prod',
      'jekyll-build:prod',
      [
        'styles:prod',
        'scripts:prod'
      ],
      callback
    )
  }
})
