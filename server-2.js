const express = require('express')

const app = express();

const NAME = 'server-2'
app.get('/', (req, res) => {
  res.send(`Hello from ${NAME}`)
})

app.get('/health', (req, res) => {
  res.send(`${NAME} is healthy`)
})

app.listen(9002, () => {
  console.log(`${NAME} running on port 9002`)
})
