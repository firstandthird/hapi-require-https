'use strict'

const register = function (server, options) {
  server.ext('onRequest', function (request, h) {
    var redirect = options.proxy !== false
      ? request.headers['x-forwarded-proto'] === 'http'
      : request.connection.info.protocol === 'http'
    var host = request.headers['x-forwarded-host'] || request.headers.host

    if (redirect) {
      return response()
        .redirect('https://' + host + request.url.path)
        .code(301)
    }
    return h.continue;
  })
}


exports.plugin = {
  register,
  once: true,
  pkg: require('./package.json')
};
