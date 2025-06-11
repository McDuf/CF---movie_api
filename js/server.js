const http = require('http'),
  fs = require('fs'),
  url = require('url');

//Server Creation  
http.createServer((request, response) => {
let addr = request.url,
  q = new URL(addr, 'http://localhost:8080' + request.headers.host),
  filePath = '';

fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
  if (err) {
    console.log(err);
   } else {
    console.log('Added to log.');
  }
});

if (q.pathname.includes('documentation')) {
    filePath = ('C:\Users\"Hannah Irey"\Desktop\CareerFoundry\FullStackImmersion\Achievement_2-ServerSideProgramming_NodeJS\movie_api' + '/documentation.html');
  } else {
    filePath = '../index.html';
  }

fs.readFile(filePath, (err, data) => {
  if (err) {
    throw err;
  }

response.writeHead(200, { 'Content-Type': 'text/html' });
response.write(data);
response.end();
});

}).listen(8080);
console.log('Holy nuts, it is actually working.');