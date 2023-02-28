const express = require('express')
const morgan = require('morgan')
const path = require('path')

const app = express()
const db = require('./database')

app.use(morgan('dev'))
app.use(express.json())

app.set("server-port", 3080)
app.set("frontend-port", 3090)

const port = app.get("server-port")

app.listen(process.env.PORT || port, () => {
    console.log(`App listening at http://localhost:${port}`)
})

db.connectDB()

// app.use(express.static("frontend"));
// app.use('/*', function(req, res) {
//   res.sendFile(path.join(__dirname,'frontend/index.html'));
// });

app.use("/api/users", require("./routes/UserRoutes"))

module.exports = app