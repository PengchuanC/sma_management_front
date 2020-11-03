import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  title: 'SMA投资管理平台',
  routes: [
    {
      path: '/', component: '@/pages/index',
      routes: [
        {exact: true, path: '/portfolio', component: '@/pages/portfolio/list'},
        {path: '/allocate', component: '@/pages/allocate/allocate'}
      ]
    },
  ],
});
