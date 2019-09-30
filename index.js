'use strict'

const defaults = {
  proxy: true
};

const register = function (server, pluginOptions) {
  const options = Object.assign({}, defaults, pluginOptions);
  server.ext('onRequest', (request, h) => {
    const redirect = options.proxy !== false
      ? request.headers['x-forwarded-proto'] === 'http'
      : server.info.protocol === 'http';
    const host = request.headers['x-forwarded-host'] || request.headers.host;

    if (redirect) {
      return h
        .redirect('https://' + host + request.url.pathname + request.url.search)
        .code(301)
        .takeover();
    }
    return h.continue;
  })
}


exports.plugin = {
  register,
  once: true,
  pkg: require('./package.json')
};
