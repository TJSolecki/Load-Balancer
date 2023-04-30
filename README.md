# Load-Balancer
A small project I made in node.js where implemented my own version of a load balance proxy server. I used a round-robin style implementation here which redirects requests to 4 different servers. The servers here have a 10% chance of setting a variable overloaded equal to true every ten seconds. When a server is in the overload state, the load balancer proxy will not redirect clients there.

# How to run
To run fist launch 4 instances of appServer.js, each on different ports with the command
```
node appServer.js [portNumber]
```
Next, open the load balance proxy server making sure to include the port number it should be hosted to along with the 4 port number of the servers with the command
```
node loadBalancer.js [proxyPortNumber] [serverPort1] [serverPort2] [serverPort3] [serverPort4]
```
Finally, run client.js to test the proxy. This program sends one request per second to the proxy. Run the program with the following command
```
node client.js [proxyPortNum]
```
