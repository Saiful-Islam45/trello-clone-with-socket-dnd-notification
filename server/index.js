const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const http = require("http").Server(app);

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

socketIO.on('connection', (socket) => {
    console.log(`${socket.id} user just connected!`);
    socket.on('disconnect', () => {
            socket.disconnect()
      console.log(' A user disconnected');
    });
});

app.get("/api", (req, res) => {
    res.json({
        message: "Hello world",
    });
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
