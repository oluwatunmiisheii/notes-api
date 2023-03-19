const mongoose = require('mongoose')
require('dotenv').config();

const {
  MONGODB_DB_URL_TEST,
  MONGODB_DB_URL
} = process.env

const connectionUrl = process.env.NODE_ENV === 'test' ? MONGODB_DB_URL_TEST : MONGODB_DB_URL

mongoose.connect(connectionUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => {
  console.log('Connected to database', process.env.NODE_ENV)
}).catch((error) => {
  console.log('Error connecting to database', error)
});
