const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: './',
  devServer: {
    // can be overwritten by process.env.HOST
    host: '0.0.0.0',
    port: 8080,
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('src', resolve('src'))
      .set('common', resolve('src/common'))
      .set('components', resolve('src/components'));
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        win: {
          icon: './public/app.ico',
        },
        mac: {
          icon: './public/app.png',
        },
        linux: {
          icon: './public/app.png',
        },
      },
    },
  },
  // configureWebpack: {
  //   build: {
  //     electronDownload: {
  //       quiet: false,
  //       verifyChecksum: false,
  //       cache: '~/.cache/electron/',
  //     },
  //   },
  // },
};
