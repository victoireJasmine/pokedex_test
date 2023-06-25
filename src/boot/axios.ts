import { boot } from 'quasar/wrappers';
import axios, {
  Axios,
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
} from 'axios';
import { Logger } from 'src/modules/Logger';
import { NetworkError } from 'src/modules/errors';

const parameters = {
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 6000,
};
const onReqError = () => (err: Error | AxiosError) => {
  Logger.warn('Axios interceptor: request failure', err);

  throw err;
};
const onRespError = () => (err: Error | AxiosError) => {
  Logger.warn('Axios interceptor: response failure', err);

  const message = err.response?.data ?? err.message;
  throw new NetworkError(err, message);
};
const onReqSuccess = () => (config: AxiosRequestConfig) => {
  Logger.info('Axios interceptor: request configuration', config);
  return config;
};
const onRespSuccess = () => (response: AxiosResponse) => {
  Logger.info('Axios interceptor: response successful', response);
  if (!response?.data) {
    return response;
  }

  return response;
};

const middleware = (instance: Axios): Axios => {
  instance.interceptors.request.use(onReqSuccess(), onReqError());
  instance.interceptors.response.use(onRespSuccess(), onRespError());
  return instance;
};

const apisFactory = () => ({
  poke: middleware(
    axios.create({
      baseURL: process.env.POKEMON_API,
      ...parameters,
      timeout: 60000,
    })
  ),
  empty: (url: string) =>
    middleware(
      axios.create({
        baseURL: url,
        ...parameters,
        timeout: 60000,
      })
    ),
});

let apis: ReturnType<typeof apisFactory>;
export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;

  apis = apisFactory();
  app.config.globalProperties.$apis = apis;
});

export { axios, apis };
