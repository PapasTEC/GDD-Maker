const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(morgan('dev'))

app.set("server-port", 3080)

const port = app.get("server-port")

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})

app.get('/', (req, res) => {
  res.send("test")
})