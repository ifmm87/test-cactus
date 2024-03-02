const express = require('express');
const axios = require('axios');

const app = express();

const CLUSTER = [
  'http://localhost:9001',
  'http://localhost:9002',
  'http://localhost:9003',
];

const AVAILABLE_SERVERS = []

let currentIndex = 0;

function getNextServer() {
  currentIndex++;
  if (currentIndex >= AVAILABLE_SERVERS.length) {
    currentIndex = 0;
  }
  return AVAILABLE_SERVERS[currentIndex];
}

async function healthCheck() {
  setInterval(async () => {
        const healthChecks = CLUSTER.map(async (server) => {
            try {
                const result = await axios.get(server + '/health');
                if (result.status === 200) {
                    if (!AVAILABLE_SERVERS.includes(server)) {
                        console.log(`${server} added`);
                        AVAILABLE_SERVERS.push(server);
                    }
                }
            } catch (err) {
                const index = AVAILABLE_SERVERS.indexOf(server);
                if (index !== -1) {
                    console.log(`${server} unavailable`);
                    AVAILABLE_SERVERS.splice(index, 1);
                }
            }
            if(!AVAILABLE_SERVERS.length) console.log('No server available')
        });

        try {
            await Promise.all(healthChecks);
        } catch (error) {
            console.error('Error during health checks:', error);
        }

        // console.log('Current available servers:', AVAILABLE_SERVERS);

    }, 500);

}

healthCheck()

app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
    if (!AVAILABLE_SERVERS.length) {
        res.send('No available server')
        res.end()
    } else {
        next();
    }
});

app.get('*', async (req, res) => {

  const server = getNextServer();
  try {
    const result = await axios.get(server + req.url);
    res.status(result.status).send(result.data);
  } catch (err) {
      console.log(err)
    res.status(500).send('Failed to connect to backend');
  }
});

app.listen(80, () => {
  console.log('Load balancer running on port 80');
});
