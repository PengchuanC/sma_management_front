import { extend } from 'umi-request';

const api = extend({
  prefix: 'http://localhost:8000/management/api/v1',
  timeout: 1000,
  useCache: true,
});

export default api;
