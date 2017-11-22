'use strict'
const register = async (server, options) => {

  // server.ext('onRequest', async function (request, h) {
  //   var redirect = options.proxy !== false ? request.headers['x-forwarded-proto'] === 'http' : request.connection.info.protocol === 'http';
  //
  //   if (redirect) {
  //     return h
  //       .redirect('https://' + request.headers.host + request.url.path)
  //       .code(301);
  //   }
  //   return h.continue;
  // });
  // return Promise.resolve();
};

exports.plugin = {
  register,
  once: true,
  pkg: require('./package.json')
};
