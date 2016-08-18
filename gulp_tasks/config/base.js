import { normalize, resolve } from 'path'

const base = normalize(`${__dirname}/../..`)

const getHomeFolder = () => {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

// Export the base config
const baseConfig = {
  homeFolder: getHomeFolder(),
  src: {
    base: base,
    assets: resolve(base, "_assets")
  },
  deploy: {
    domain: 'unicodeforyou.surge.sh'
  },
  jekyll: {
    baseConfig: resolve(base, "_config.yml")
  },
  styles: {
    autoprefixer: {
      cascade: true,
      browsers: [
        "last 2 versions",
        "android 4"
      ]
    }
  },
  size:{
    showFiles: true
  }
}

baseConfig.watch = {
  jekyll: [
    `${baseConfig.src.base}/*.yml`,
    `${baseConfig.src.base}/_data/*.{json,yml}`,
    `${baseConfig.src.base}/index.html`,
    `${baseConfig.src.base}/{_layouts,_includes}/*.html`,
  ],
  styles: `${baseConfig.src.assets}/styles/**/*.css`,
  scripts: `${baseConfig.src.assets}/scripts/*.js`
}

baseConfig.scripts = {
  options: {
    debug: true
  },
  vendor: {
    src: []
  }
}

export default baseConfig