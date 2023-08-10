const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server = net.createServer((connection) => {
  // Handle connection
  connection.addListener('data', (data) => {
    console.log(data.toString());

    // response to an event where we receive some data
    connection.write('+PONG\r\n')
    
  })
}).on('error', (err) => {
  console.error(err);
})
//
server.listen(6379, "127.0.0.1");
