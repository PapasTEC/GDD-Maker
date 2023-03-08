const express = require('express')
const morgan = require('morgan')
const path = require('path')
var cors = require("cors");
const { generatePasswordCode, sendEmail } = require('./functions/utils')

const app = express()
const db = require('./database')

app.use(morgan('dev'))
app.use(express.json())

app.use(cors({ origin: "*" }));

app.set("server-port", 3080)
app.set("frontend-port", 3090)

const port = app.get("server-port")

app.listen(process.env.PORT || port, () => {
    console.log(`App listening at http://localhost:${port}`)
})

db.connectDB()

app.use(express.static(path.join(__dirname, 'frontend'), { type: 'application/javascript' }));
app.use('/app/*', function(req, res) {
  res.sendFile(path.join(__dirname,'frontend/index.html'));
});

app.use("/api/users", require("./routes/UserRoutes"))
app.use("/api/documents", require("./routes/DocumentRoutes"))

module.exports = app