const express = require('express');
const cors = require('cors');
const { randomUUID } = require('crypto');
const app = express();
const PORT = process.env.PORT || 5000;
const http = require("http").Server(app);

const tasks = {
    pending: {
        title: "pending",
        items: [
            {
                id: randomUUID(),
                title: "Send the Figma file to Dima",
                comments: [],
            },
        ],
    },
    ongoing: {
        title: "ongoing",
        items: [
            {
                id: randomUUID(),
                title: "Review GitHub issues",
                comments: [
                    {
                        name: "David",
                        text: "Ensure you review before merging",
                        id: randomUUID(),
                    },
                ],
            },
        ],
    },
    completed: {
        title: "completed",
        items: [
            {
                id: randomUUID(),
                title: "Create technical contents",
                comments: [
                    {
                        name: "Dima",
                        text: "Make sure you check the requirements",
                        id: randomUUID(),
                    },
                ],
            },
        ],
    },
};

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "*"
    }
});

socketIO.on("connection", (socket) => {
    console.log(`${socket.id} user just connected!`);

    socket.on("taskDragged", (data) => {
        const { source, destination } = data;
        const itemMoved = {
            ...tasks[source.droppableId].items[source.index],
        };
        console.log("DraggedItem ", itemMoved);
        tasks[source.droppableId].items.splice(source.index, 1);
        tasks[destination.droppableId].items.splice(destination.index, 0, itemMoved);
    
        //👇🏻 Sends the updated tasks object to the React app
        socket.emit("tasks", tasks);
    
        //Print the items at the Source and Destination
            console.log("Source >>>", tasks[source.droppableId].items);
            console.log("Destination >>>", tasks[destination.droppableId].items);
            
    });
    socket.on("createTask", (data) => {
        // 👇🏻 Constructs an object according to the data structure
        const newTask = { id: fetchID(), title: data.task, comments: [] };
        // 👇🏻 Adds the task to the pending category
        tasks["pending"].items.push(newTask);
        /* 
        👇🏻 Fires the tasks event for update
         */
        socket.emit("tasks", tasks);
    });

    socket.on("disconnect", () => {
        socket.disconnect();
        console.log("🔥: A user disconnected");
    });
});

app.get("/api", (req, res) => {
    res.json(tasks);
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
