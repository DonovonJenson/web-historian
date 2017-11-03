var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var http = require('http');
var httpHelper = require('./http-helpers.js');
// require more modules/folders here!

var send404Response = function(response) {
  response.writeHead(404, {'contentType': 'text/plain'});
  response.write('Error');
  response.end();
};

exports.handleRequest = function (req, res) {
   
  if (req.method === 'GET' && req.url === '/') {
    httpHelper.serveAssets (res, path.join(__dirname, './public/index.html'), (data) => {
      res.writeHead(200);
      res.end (data);
    });
  } else if (req.method === 'POST') {
    var body = '';
    req.on ('data', (chunk) => {
      body += chunk;
    });
    req.on ('end', () => {
      var tempURL = body.slice (4, body.length);
      archive.isUrlArchived (tempURL, (input) => {
        console.log (input);
      });
      archive.isUrlInList(tempURL, (boolean) => {
        if (!boolean) {
          archive.addUrlToList (body);
          archive.downloadUrls (tempURL);
        }
      });
    });
  } else {
    send404Response(res);
  }
};
