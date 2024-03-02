const axios = require('axios');

const options = {
  method: 'GET',
  url: 'http://localhost',
  headers: {
  }
};

function fetchData() {
  axios(options)
    .then(function (response) {
      console.log('Data fetched at:', new Date().toLocaleTimeString());
      console.log('Response data:', response.data);
    })
    .catch(function (error) {
        if (error.code == 'ECONNREFUSED') {
            console.log('cluster unavailable')
        }
    });
}

const interval = 1500;

setInterval(fetchData, interval);
