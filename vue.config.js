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
      .set('root', resolve('./'))
      .set('common', resolve('src/common'))
      .set('components', resolve('src/components'));
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        productName: 'CelmenEditor',
        appId: 'top.penguinuniverse.celmeneditor',
        publish: [
          {
            provider: 'github',
            owner: 'Peviroy',
            repo: 'CelmenEditor',
            releaseType: 'draft',
          },
        ],
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
};
