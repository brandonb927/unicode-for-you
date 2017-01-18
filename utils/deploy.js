
// STEPS
// Jekyll build
// Webpack build
// Optimize?
// Push up to Surge

import cp from 'child_process'

const deployHtmlPath = `${deployConfig.deploy.src}/*.html`

// Upload a published build to the interwebs
cp.spawn(
  'surge',
  [
    'dist',
    `--domain=https://unicodeforyou.surge.sh`
  ],
  { stdio: 'inherit' }
)
