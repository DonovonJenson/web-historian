var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var requestHandler = require('./request-handler.js');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.sendResponse = (res, obj, status = 200) => {
  res.writeHead (status, exports.headers);
  res.end (obj);
};

exports.serveAssets = function(res, asset, callback) {
  //Check public folder
  fs.readFile(archive.paths.siteAssets + asset, 'utf-8', (err, data) => {
    if (err) {
      fs.readFile(archive.paths.archivedSites + asset, 'utf-8', (err, data) => {
        if (err) {
          callback ? callback() : requestHandler.send404Response(res);
        } else {
          exports.sendResponse(res, data);
        }     
      });
    } else {
      exports.sendResponse(res, data);
    }
  });
  //File not in public, check archive folder
  //File not in either location
  //file exists, serve it
  //file exists, serve it

  res.writeHead(200);
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
};



// As you progress, keep thinking about what helper functions you can put here!
