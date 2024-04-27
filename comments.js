// Create web server
// 1. Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
// Load the fs module to read the file system
var path = require('path');
var comments = require('./comments');
var querystring = require('querystring');
var url = require('url');
// 2. Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
    var filePath = '.' + request.url;
    if (filePath == './') {
        filePath = './index.html';
    }
    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }
    fs.readFile(filePath, function (error, content) {
        if (error) {
            if (error.code == 'ENOENT') {
                fs.readFile('./404.html', function (error, content) {
                    response.writeHead(404, { 'Content-Type': 'text/html' });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                response.end();
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
    if (request.method === 'POST') {
        var body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            var POST = querystring.parse(body);
            comments.push(POST.comment);
            response.end();
        });
    }
    if (request.method === 'GET') {
        var url_parts = url.parse(request.url, true);
        var query = url_parts.query;
        if (query.comment) {
            comments.push(query.comment);
        }
    }
    response.end();
});
// 3. Listen on port 8000, IP defaults to