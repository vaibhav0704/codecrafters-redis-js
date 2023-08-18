const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// parse incoming data and return the commands
const parseData = (data) => {
  const command = data.toString().split('\r\n');
  return command;
};

// key value storage for redis
const mapDb = new Map();

// handle the commands and give the appropriate response to the client
const commandController = (connection, commands) => {
  if (commands[2] === 'COMMAND') {
    connection.end()
  }
  else if (commands[2] === 'PING') {
    if (commands[3].startsWith('$')) {
      connection.write(`+${commands[4]}\r\n`)
    } else {
      connection.write('+PONG\r\n')
    }
  }
  else if (commands[2] === 'ECHO') {
    connection.write(`${commands[3]}\r\n${commands[4]}\r\n`);
  }
  else if (commands[2] === 'SET') {
    if (parseInt(commands[0].slice(1)) >= 3) {
      try {
        mapDb.set(commands[4], commands[6])        
        connection.write("+OK\r\n")
      } catch (err) {
        console.error(err);
        // write the error
        connection.write("-WRONGTYPE Operation against a key holding a wrong kind of value")
      }
    }
  }
  else if (commands[2] === 'GET') {
    const data = mapDb.get(commands[4]);
    if (data) {
      connection.write(`$${data.length}\r\n${data}\r\n`)
    } else {
      connection.write("$-1\r\n")
    }
  }
  
}

// Uncomment this block to pass the first stage
const server = net.createServer((connection) => {
  // Handle connection
  connection.addListener('data', (data) => {

    const commands = parseData(data);
    console.log(commands)

    commandController(connection, commands);    

    // response to an event where we receive data
    // connection.write('+PONG\r\n')    
  })
}).on('error', (err) => {
  console.error(err);
})
//
server.listen(6379, "127.0.0.1");
