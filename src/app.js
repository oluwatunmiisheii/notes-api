require('dotenv').config();
const express = require('express')
require('./db/mongoose')
const userRouter = require('./routes/user.route')
const noteRouter = require('./routes/note.route')
const authRouter = require('./routes/auth.route')
const cors = require('cors')

const app = express()

// app.use((req, res, next) => {
//   console.log(req.body)
//   res.status(503).send('The server is currently under maintenance')
// })

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(
  cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
)

app.get('/', (req, res) => {
  res.send('Welcome to notes api!')
})
app.use("/api/users", userRouter)
app.use("/api/notes", noteRouter)
app.use("/api/", authRouter)

module.exports = app