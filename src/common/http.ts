import { extend } from 'umi-request';

// export const basicUrl = 'http://localhost:8000/management/api/v1';
export const basicUrl = 'http://10.170.129.129/management/api/v1';
// export const basicSocket = 'ws://localhost:8000/ws';
export const basicSocket = 'ws://10.170.129.129/ws';

const api = extend({
  prefix: basicUrl,
  timeout: 5000,
  useCache: true,
  errorHandler: error => {
    console.log(error);
  },
});

export default api;
