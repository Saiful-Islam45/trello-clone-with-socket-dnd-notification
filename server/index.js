const express=require('express');
const cors=require('cors');

const app=express();
const PORT=process.env.PORT || 3000;
const http = require("http").Server(app);

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.get("/api", (req, res) => {
    res.json({
        message: "Hello world",
    });
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
