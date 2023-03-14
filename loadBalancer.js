const http = require('http');

// get the 4 server ports

// get command line args
const args = process.argv.slice(2);

// Check if a port was specified
if (args.length < 5) {
  console.error('Error: Please specify 5 port numbers');
  process.exit(1);
}

// Parse the port number
const loadBalPort = parseInt(args[0]);
const port1 = parseInt(args[1]);
const port2 = parseInt(args[2]);
const port3 = parseInt(args[3]);
const port4 = parseInt(args[4]);

const ports = [port1,port2,port3,port4];

// check to make sure each port is a number for error handling
if (isNaN(loadBalPort)) {
    console.error('Error: Invalid port number');
    process.exit(1);
}

for(let i = 0; i < 4; i++)
{
    if (isNaN(ports[i])) {
        console.error('Error: Invalid port number');
        process.exit(1);
    }
}

// an array which will store the healthy servers
const healthy = [];

// a counter which will be used when iterating with round robin
let counter = 0;

// a function to help loop through healthy
const getIndex = () => { 
    if(counter >= healthy.length)
    {
        counter = 1;
        return counter;
    }
    else
    {
        counter = counter + 1;
        return counter % healthy.length;
    }
 };

 const options = {
    hostname: 'localhost',
    port: port1,
    path: '/heartbeat',
    method: 'GET'
  };

// this function is called every 1 second and update the healthy array
const getHealthy = () => {
    for(let i = 0; i < 4; i++)
    {
        const port = ports[i];
        
        options.port = port;
        const req = http.request(options, res => {
            res.on('data', data => {
                // if the server is healthy add it to the healthy array, else remove it if it's there
                // console.log(`the status code for port ${port} is ${res.statusCode}`);
                if(res.statusCode === 200 && !healthy.includes(port))
                {
                    // add the healthy server's port to healthy
                    console.log(`${port} is now healthy`);
                    healthy.push(port);
                }
                else if(res.statusCode === 500 && healthy.includes(port))
                {
                    console.log(`${port} is now not healthy`);

                    // Check if the entry is in the array using Array.indexOf()
                    const index = healthy.indexOf(port);

                    // If the entry is in the array, remove it using Array.splice()
                    if (index !== -1) {
                        healthy.splice(index, 1);
                    }
                    console.log(healthy);
                }
            });
        });
    
        // Handle errors if the request fails
        req.on('error', error => {
            console.error(error);
        });
    
        req.end();
    }
}

// update healthy array every 1 sec
setInterval(getHealthy, 1000);

const loadBalProxy = http.createServer((req,res) => {
    
    // Set the new target port to the next in line in the healthy round-robin
    const targetPort = healthy[getIndex()];
    console.log(targetPort);

    // Set the target URL to the same path as the incoming request
    const path = '/index';

    // Redirect the request to the target server
    res.writeHead(302, { 'Location': `http://localhost:${targetPort}${path}` });
    res.end();

});

loadBalProxy.listen(loadBalPort, () => {
    console.log(`Load balancer proxy is listening on port ${loadBalPort}...`);
})