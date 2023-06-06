const express = require("express");







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


  socket.on("disconnect", () => {

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

    if (onlineUsersInDocuments.has(documentId)) {
      let users = onlineUsersInDocuments.get(documentId);
      users.push({ email, name, image });
      onlineUsersInDocuments.set(documentId, users);
    } else {
      onlineUsersInDocuments.set(documentId, [{ email, name, image }]);
    }


    io.sockets
      .in(documentId)
      .emit("update-online-users", onlineUsersInDocuments.get(documentId));

    onlineUsers.set(socket.id, { documentId, email });




  });

  socket.on("leave-document", (documentId, email) => {

    if (onlineUsersInDocuments.has(documentId)) {
      let users = onlineUsersInDocuments.get(documentId);
      users = users.filter((user) => user.email !== email);
      onlineUsersInDocuments.set(documentId, users);
    }

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


  });

  socket.on('edit-document-front-page', async ({ documentId, content }) => {
    socket.broadcast
      .to(documentId)
      .emit("sync-data-front-page", { content });

  });

  socket.on("edit-User", ({ documentId, content, user, part }) => {

    socket.broadcast
      .to(documentId)
      .emit("user-Editing", { content, user, part });
  });
});




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


app.use("/uploads", express.static(path.join(__dirname, "/uploads")));




app.use("/api/test", express.static("src"));

instrument(io, { auth: false });

module.exports = app;
