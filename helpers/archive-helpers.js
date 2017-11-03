var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var https = require('https');


/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../web/archives/sites'),
  list: path.join(__dirname, '../web/archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = (callback) => {
  fs.readFile(this.paths.list, 'utf8', (err, data) => {
    if (err) {
      throw Error;
    } else {
      callback(data);
    }
  });
};

exports.isUrlInList = function(url, callback) {
  this.readListOfUrls(function(data) {
    var urls = data.split('url=');
    var contains;
    var contains = urls.indexOf(url) === -1 ? false : true;
    callback (contains);
  });
};

exports.addUrlToList = function(url, callback) {
  this.isUrlInList(url, (boolean) => {
    if (!boolean) {
      fs.appendFile(this.paths.list, url, 'utf8', callback);
    }
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.access (`${this.paths.archivedSites}/${url}`, (err, stat) => {
    if (err) {
      callback(false);
    } else {
      callback(true);
    }
  });
};

exports.downloadUrls = function(urls) {
  var file = fs.openSync(`${this.paths.archivedSites}/${urls}`, 'w');
  fs.closeSync(file);
  request ('http://' + urls).pipe(fs.createWriteStream(this.paths.archivedSites + '/' + url));
};