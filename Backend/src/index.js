const express = require("express");
// const io = require('socket.io')(3070, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"]
//     }
// })

const http = require("http");
const { instrument } = require("@socket.io/admin-ui");
const { Server, Socket } = require("socket.io");
const documentController = require('./controllers/DocumentController');

const morgan = require("morgan");
const path = require("path");
var cors = require("cors");
var bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const db = require("./database");

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(morgan("dev"));
app.use(express.json());

app.use(cors({ origin: "*" }));

app.set("server-port", 3080);
app.set("frontend-port", 3090);

const port = app.get("server-port");

let onlineUsersInDocuments = new Map();
let onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
    if (onlineUsers.has(socket.id)) {
      let { documentId, email } = onlineUsers.get(socket.id);
      let users = onlineUsersInDocuments.get(documentId);
      users = users.filter((user) => user.email !== email);
      onlineUsersInDocuments.set(documentId, users);
      socket
        .to(documentId)
        .emit("update-online-users", onlineUsersInDocuments.get(documentId));
    }
  });

  socket.on("join-document", (documentId, { email, name, image }) => {
    socket.join(documentId);
    console.log("document connected");
    if (onlineUsersInDocuments.has(documentId)) {
      let users = onlineUsersInDocuments.get(documentId);
      users.push({ email, name, image });
      onlineUsersInDocuments.set(documentId, users);
    } else {
      onlineUsersInDocuments.set(documentId, [{ email, name, image }]);
    }
    // print sockets in room
    console.log(io.sockets.adapter.rooms.get(documentId));
    console.log(
      `ROOM ${documentId} USERS:`,
      onlineUsersInDocuments.get(documentId)
    );
    io.sockets
      .in(documentId)
      .emit("update-online-users", onlineUsersInDocuments.get(documentId));

    onlineUsers.set(socket.id, { documentId, email });
    // socket.to(documentId).broadcast.emit('user-connected', userId)
    // socket.on('disconnect', () => {
    //     socket.to(documentId).broadcast.emit('user-disconnected', userId)
    // })
  });

  socket.on("leave-document", (documentId, email) => {
    console.log("document disconnected");
    if (onlineUsersInDocuments.has(documentId)) {
      let users = onlineUsersInDocuments.get(documentId);
      users = users.filter((user) => user.email !== email);
      onlineUsersInDocuments.set(documentId, users);
    }
    console.log(
      `ROOM ${documentId} USERS:`,
      onlineUsersInDocuments.get(documentId)
    );
    socket
      .to(documentId)
      .emit("update-online-users", onlineUsersInDocuments.get(documentId));
    socket.leave(documentId);

    onlineUsers.delete(socket.id);
  });

  socket.on("edit-document", async ({ documentId, secId, subSecId, content, sectionTitle, subSectionTitle, part }) => {
    socket.broadcast
      .to(documentId)
      .emit("sync-data", { secId, subSecId, content, part });
    console.log('edit-document', { documentId, secId, subSecId, content, part })
    console.log(await documentController.updateOnlySubSectionByTitlesBasic(documentId, sectionTitle, subSectionTitle, content));
    // socket.to(documentId).broadcast.emit('update-data', data)
  });

  socket.on('edit-document-front-page', async ({ documentId, content }) => {
    socket.broadcast
      .to(documentId)
      .emit("sync-data-front-page", { content });
      console.log(await documentController.updateOnlyCoverBasic(documentId, content));
  });

  socket.on("edit-User", ({ documentId, content, user, part }) => {
    console.log("\nuser-Editing:", user);
    socket.broadcast
      .to(documentId)
      .emit("user-Editing", { content, user, part });
  });
});

// app.listen(process.env.PORT || port, () => {
//     console.log(`App listening at http://localhost:${port}`)
// })
let PORT = process.env.PORT || port;
server.listen(PORT, async () => {
  console.log(`Live on localhost:${PORT}`);
});

db.connectDB();

app.use(
  express.static(path.join(__dirname, "frontendBuild"), {
    type: "application/javascript",
  })
);
app.use("/app/*", function (req, res) {
  res.sendFile(path.join(__dirname, "frontendBuild/index.html"));
});

app.use("/api/users", require("./routes/UserRoutes"));
app.use("/api/documents", require("./routes/DocumentRoutes"));
app.use("/api/token", require("./routes/TokenRoute"));
app.use("/api/images", require("./routes/ImageRoutes"));

app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

instrument(io, { auth: false });

module.exports = app;
