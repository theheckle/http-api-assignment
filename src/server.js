const http = require('http');
const url = require('url');
const query = require('querystring');
const responseHandler = require('./htmlResponses.js');
const objectHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': responseHandler.getIndex,
  '/style.css': responseHandler.getStyle,
  '/success': objectHandler.success,
  '/badRequest': objectHandler.badrequest,
  '/unauthorized': objectHandler.unauthorized,
  '/forbidden': objectHandler.forbidden,
  '/internal': objectHandler.internal,
  '/notImplemented': objectHandler.notimplemented,
  notFound: objectHandler.notFound,
  index: responseHandler.getIndex,
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  const acceptedTypes = request.headers.accept.split(',');

  const params = query.parse(parsedUrl.query);

  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response, acceptedTypes, params);
  } else {
    urlStruct.notFound(request, response, acceptedTypes, params);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
