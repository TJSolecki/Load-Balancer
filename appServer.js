const http = require('http');

// get command line args
const args = process.argv.slice(2);

// Check if a port was specified
if (args.length < 1) {
  console.error('Error: Please specify a port number');
  process.exit(1);
}

// Parse the port number
const port = parseInt(args[0]);

// Check if the port number is valid
if (isNaN(port)) {
  console.error('Error: Invalid port number');
  process.exit(1);
}

let overloaded = false;

const changeOverload = () => {
    if(overloaded)
    {
        console.log('I am no longer overloaded');
    }
    overloaded = false;
   
    const val = Math.random();
    if(val <= 0.1)
    {
        overloaded = true;
        console.log('I am overloaded');
    }
    
}

// Call the function every 10 seconds
setInterval(changeOverload, 10000);

const endpoints = {
    '/heartbeat': (req,res) => {
        if(overloaded)
        {
            res.writeHeader(500);
            return res.end('error');
        }
        res.statuscode = 200;
        return res.end('success');
    },
    '/index': (req,res) => {
        if(overloaded)
        {
            res.writeHeader(500);
            return res.end('error');
        }
        const currentDate = new Date();

        // Set the Date header to the current date and time 
        res.setHeader('Date', currentDate.toUTCString());

        // Send the response to the client
        res.write(currentDate.toUTCString());
        console.log(currentDate.toDateString());
        res.end();
    }
}

const server = http.createServer((req, res) => {
    for(const p of Object.entries(endpoints))
    {
        if(req.url.startsWith(p[0]))
        {
            return p[1](req,res);
        }
    }
    res.writeHeader(404);
    return res.end();
});

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
