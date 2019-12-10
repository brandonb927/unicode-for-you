import gulp from 'gulp';
import config from '../config/dev';

// Run the jekyll build, browsersync server, and watch files for changes
gulp.task('watch', callback => {
  gulp.watch(config.watch.jekyll, ['jekyll-rebuild']);
  gulp.watch(config.watch.styles, ['styles:dev']);
  gulp.watch(config.watch.scripts, ['scripts:dev']);
});
