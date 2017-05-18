import devConfig from './config.development';
import prodConfig from './config.production';
import testConfig from './config.testing';

let config = prodConfig; // eslint-disable-line

if (process.env.NODE_ENV === 'production') {
  config = prodConfig;
} else if (process.env.NODE_ENV === 'test') {
  config = testConfig;
} else if (process.env.NODE_ENV === 'development') {
  config = devConfig;
}
export default config;
