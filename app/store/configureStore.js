const configureStoreDev = require('./configureStore.development');
const configureStoreProd = require('./configureStore.production');

if (process.env.NODE_ENV === 'production') {
  module.exports = configureStoreProd;
} else {
  module.exports = configureStoreDev;
}
