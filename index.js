
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./models');

const app = express();
app.use(cors());

const rowdyResults = require('rowdy-logger').begin(app);

app.use(express.urlencoded({
  extended: false
}))

app.use(morgan('dev'));
app.use(express.json({
  limit: '30mb'
}))

app.get('/', (req, res) => {
  res.send('hello');
})

app.use('/auth', require('./controllers/auth'))

app.get('*', (req, res) => {
  res.status(404).send({
    message: 'doh!'
  })
})

app.listen(process.env.PORT || 3000, () => {
  rowdyResults.print();
});