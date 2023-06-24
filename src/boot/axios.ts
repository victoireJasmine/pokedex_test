import { boot } from 'quasar/wrappers';
import axios, { Axios } from 'axios';

const parameters = {
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 6000,
};

const middleware = (instance: Axios): Axios => {
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
});

let apis: ReturnType<typeof apisFactory>;
export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;

  apis = apisFactory();
  app.config.globalProperties.$apis = apis;
});

export { axios, apis };
