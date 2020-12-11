import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  publicPath: '/public/',
  title: 'SMA投资管理平台',
  links: [{ rel: 'icon', href: '/public/favicon.ico' }],
});
