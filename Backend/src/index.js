const express = require('express')
// const io = require('socket.io')(3070, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"]
//     }
// })

const http = require("http");
const { instrument } = require("@socket.io/admin-ui");
const { Server, Socket } = require("socket.io");

const morgan = require('morgan')
const path = require('path')
var cors = require("cors");
var bodyParser = require('body-parser');

const app = express()
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

const db = require('./database')

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(morgan('dev'))
app.use(express.json())

app.use(cors({ origin: "*" }));

app.set("server-port", 3080)
app.set("frontend-port", 3090)

const port = app.get("server-port")

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log("user disconnected")
    })
    socket.on('join-document', (documentId, userId) => {
        socket.join(documentId)
        console.log("document connected")
        // socket.to(documentId).broadcast.emit('user-connected', userId)
        // socket.on('disconnect', () => {
        //     socket.to(documentId).broadcast.emit('user-disconnected', userId)
        // })
    })
    socket.on('edit-document', (documentId, data) => {
      console.log(documentId + ": " + data)
      socket.broadcast.to(documentId).emit('sync-data', data)
        // socket.to(documentId).broadcast.emit('update-data', data)
    })
})

// app.listen(process.env.PORT || port, () => {
//     console.log(`App listening at http://localhost:${port}`)
// })
let PORT = process.env.PORT || port;
server.listen(PORT, async () => {
  console.log(`Live on localhost:${PORT}`);
});

db.connectDB()

app.use(express.static(path.join(__dirname, 'frontendBuild'), { type: 'application/javascript' }));
app.use('/app/*', function(req, res) {
  res.sendFile(path.join(__dirname,'frontendBuild/index.html'));
});

app.use("/api/users", require("./routes/UserRoutes"))
app.use("/api/documents", require("./routes/DocumentRoutes"))
app.use("/api/token", require("./routes/TokenRoute"))
app.use("/api/images", require("./routes/ImageRoutes"))

instrument(io, { auth: false });

module.exports = app