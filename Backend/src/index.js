const express = require('express')
const morgan = require('morgan')
const path = require('path')
var cors = require("cors");
var bodyParser = require('body-parser');

const app = express()
const db = require('./database')

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

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

app.use(express.static(path.join(__dirname, 'frontendBuild'), { type: 'application/javascript' }));
app.use('/app/*', function(req, res) {
  res.sendFile(path.join(__dirname,'frontendBuild/index.html'));
});

app.use("/api/users", require("./routes/UserRoutes"))
app.use("/api/documents", require("./routes/DocumentRoutes"))
app.use("/api/token", require("./routes/TokenRoute"))

module.exports = app