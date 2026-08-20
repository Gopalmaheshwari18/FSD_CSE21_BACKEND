// Practical 3
import http from 'http';
const server = http.createServer((req,res)=>{
    res.writeHead(200,{'content-type':'text/html'});
    res.write('<h1>hello World..</h1>');
    res.writeHead(403,{'content-type':'text/html'});
    res.end("<h2>403 forbidden case </h2>");
})
server.listen()