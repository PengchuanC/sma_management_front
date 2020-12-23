import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  dva: { hmr: true },
  publicPath: '/manage/',
  outputPath: 'manage',
  base: '/manage/',
  title: 'SMA投资管理平台',
  links: [{ rel: 'icon', href: '/manage/favicon.ico' }],
  chainWebpack(config, { env, webpack, createCSSRule }) {
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|webp|ico)(\?.*)?$/)
      .use('url-loader')
      .loader(require.resolve('url-loader'))
      .tap(options => {
        return {
          ...options,
          name: '/img/[name].[hash:8].[ext]',
          fallback: {
            ...options.fallback,
            options: {
              name: '/img/[name].[hash:8].[ext]',
              esModule: false,
            },
          },
        };
      });
  },
});
