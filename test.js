'use strict'

var test = require('tape')
var hapi = require('@hapi/hapi')
var http = require('http')
var plugin = require('./index.js')

test('proxied requests', async (t) => {
  t.plan(2)

  const server = await Server();
  const response = await server.inject({
    url: '/',
    headers: {
      host: 'host',
      'x-forwarded-proto': 'http'
    }
  });
  t.equal(response.statusCode, 301, 'sets 301 code')
  t.equal(response.headers.location, 'https://host/', 'sets Location header')
});

test('un-proxied requests: options = {proxy: false}', async (t) => {
  t.plan(2)
  const server = await Server({ proxy: false });
  const response = await server.inject({
    url: '/',
    headers: {
      host: 'host'
    }
  });
  t.equal(response.statusCode, 301, 'sets 301 code')
  t.equal(response.headers.location, 'https://host/', 'sets Location header')
});

test('query string', async (t) => {
  t.plan(2)
  const server = await Server();

  const response = await server.inject({
    url: '/?test=test&test2=test2',
    headers: {
      host: 'host',
      'x-forwarded-proto': 'http'
    }
  });
  t.equal(response.statusCode, 301, 'sets 301 code')
  t.equal(
    response.headers.location,
    'https://host/?test=test&test2=test2',
    'sets Location header with query string'
  )
});

test('ignores unmatched', async (t) => {
  t.plan(2)
  const server = await Server();

  const response = await server.inject({
    url: '/',
    headers: {
      host: 'host',
      'x-forwarded-proto': 'https'
    }
  });
  t.equal(response.statusCode, 200, 'receives 200');
  t.equal(response.result, 'Hello!', 'receives body');
});

test('x-forward-host support', async (t) => {
  t.plan(2)
  const server = await Server();

  const response = await server.inject({
    url: '/',
    headers: {
      host: 'host',
      'x-forwarded-proto': 'http',
      'x-forwarded-host': 'host2'
    }
  });
  t.equal(response.statusCode, 301, 'sets 301 code')
  t.equal(response.headers.location, 'https://host2/', 'sets Location header')
});

const Server = async (options) => {
  const server = new hapi.Server();
  await server.register({ plugin, options });
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, h) {
      return 'Hello!';
    }
  })
  return server;
}
