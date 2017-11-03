var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var http = require('http');
var httpHelper = require('./http-helpers.js');
var urlParser = require('url');
// require more modules/folders here!

exports.send404Response = function(response) {
  response.writeHead(404, {'contentType': 'text/plain'});
  response.write('Error');
  response.end();
};

exports.handleRequest = function (req, res) {
   
  if (req.method === 'GET') {

    var parts = urlParser.parse(req.url);
    var urlPath = parts.pathname === '/' ? '/index.html' : parts.pathname;
    httpHelper.serveAssets (res, urlPath, (data) => {
      res.end (archive.paths.list);
    });
  } else if (req.method === 'POST') {
    var body = '';
    req.on ('data', (chunk) => {
      body += chunk;
    });
    req.on ('end', () => {
      var tempURL = body.slice (4, body.length);
      archive.isUrlInList(tempURL, (found) => {
        if (found) {
          archive.isUrlArchived (tempURL, (exists) => {
            if (exists) {
              exports.sendRedirect (res, '/' + tempURL);
            } else {
              exports.sendRedirect (res, '/loading.html');
            }
          });
        } else {
          archive.addUrlToList(tempURL, function () {
            exports.sendRedirect (res, '/loading.html');
          });
        }
      });
    });
  } else {
    this.send404Response(res);
  }
};

exports.sendRedirect = (res, location, status = 302) => {
  res.writeHead (status, {Location: location});
  res.end ();
};





















