const http = require('http');

// get command line args
const args = process.argv.slice(2);

// Check if a port was specified
if (args.length < 1) {
  console.error('Error: Please specify a port number');
  process.exit(1);
}

// Parse the port number
const portNum = parseInt(args[0]);

// Check if the port number is valid
if (isNaN(portNum)) {
  console.error('Error: Invalid port number');
  process.exit(1);
}

// set the header for the http request
const options = {
  hostname: 'localhost',
  port: portNum,
  path: '/index',
  method: 'GET'
};


const sendRequest = () => {
    options.port = portNum;
    
    const req = http.request(options, res => {
        if (res.statusCode === 302) {
            
            const location = res.headers.location;
            let newPort = location.split(':')[2];
            newPort = newPort.split('/')[0];
            options.port = newPort;
            
            const newReq = http.request(options, (newRes) => {
                console.log(newRes.headers.date);
            });
            newReq.on('error', (err) => {
                console.log(err);
            });
            newReq.end();
          } 
    });

    // Handle errors if the request fails
    req.on('error', error => {
        console.error(error);
    });

    req.end();
};

setInterval(sendRequest, 1000); // sends a http request every second
