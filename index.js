const express = require('express');
const cors = require('cors');
const db = require('./models');

const app = express();
app.use(cors());

app.use(express.urlencoded({
  extended: false
}))

app.use(express.json({
  limit: '30mb'
}))

app.get('*', (req, res) => {
  res.status(404).send({
    message: 'doh!'
  })
})

app.listen(process.env.PORT || 3000);