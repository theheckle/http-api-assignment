const respond = (request, response, status, object, type) => {
  response.writeHead(status, {
    'Content-Type': type,
  });

  response.write(object);
  response.end();
};

const createXML = (responseObj) => {
  let responseXML = '<response>';
  if (responseObj.id != null) {
    responseXML = `${responseXML} <id> ${responseObj.id} </id>`;
  }
  responseXML = `${responseXML} <message> ${responseObj.message} </message>`;
  responseXML = `${responseXML} </response>`;
  return responseXML;
};

const checkXMLOrJson = (request, response, responseObj, status, acceptedTypes) => {
  if (acceptedTypes[0] === 'text/xml') {
    const responseXML = createXML(responseObj);
    return respond(request, response, status, responseXML, 'text/xml');
  }

  const res = JSON.stringify(responseObj);
  return respond(request, response, status, res, 'application/json');
};

const success = (request, response, acceptedTypes) => {
  // message to send
  const responseObj = {
    message: 'This is a successful response',
  };
  return checkXMLOrJson(request, response, responseObj, 200, acceptedTypes);
};

const badrequest = (request, response, acceptedTypes, params) => {
  if (params.valid === 'true') {
    const responseObj = {
      message: 'This request has the required parameters value',
    };
    return checkXMLOrJson(request, response, responseObj, 200, acceptedTypes);
  }

  // message to send
  const responseObj = {
    id: 'badRequest',
    message: 'Missing valid query parameter set to true',
  };

  return checkXMLOrJson(request, response, responseObj, 400, acceptedTypes);
};

const unauthorized = (request, response, acceptedTypes, params) => {
  if (params.loggedIn === 'yes') {
    const responseObj = {
      message: 'You have successfully viewed the content',
    };
    return checkXMLOrJson(request, response, responseObj, 200, acceptedTypes);
  }

  const responseObj = {
    id: 'unauthorized',
    message: 'Missing loggedIn query parameter set to yes',
  };

  return checkXMLOrJson(request, response, responseObj, 401, acceptedTypes);
};

const forbidden = (request, response, acceptedTypes) => {
  const responseObj = {
    id: 'forbidden',
    message: 'You do not have access to this content',
  };

  return checkXMLOrJson(request, response, responseObj, 403, acceptedTypes);
};

const internal = (request, response, acceptedTypes) => {
  const responseObj = {
    id: 'internalError',
    message: 'Internal Server Error. Something went wrong',
  };

  return checkXMLOrJson(request, response, responseObj, 500, acceptedTypes);
};

const notimplemented = (request, response, acceptedTypes) => {
  const responseObj = {
    id: 'notImplemented',
    message: 'A get request has not been implemented yet. Check again later for updated content',
  };

  return checkXMLOrJson(request, response, responseObj, 501, acceptedTypes);
};

const notFound = (request, response, acceptedTypes) => {
  const responseObj = {
    id: 'notImplemented',
    message: 'The page you are looking for is not found',
  };

  return checkXMLOrJson(request, response, responseObj, 404, acceptedTypes);
};

module.exports = {
  success,
  badrequest,
  unauthorized,
  forbidden,
  internal,
  notimplemented,
  notFound,
};
