require('@babel/register');

// Recursively require all tasks in ./gulp/tasks
require('require-dir')('./gulp_tasks/tasks', {
  recurse: true,
  noCache: true
});
