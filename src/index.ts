import express from "express"

import tasksRouter from "./tasks/tasks.router.js"

const app = express();
const PORT = process.env.PORT || 3000;

//global Middleware
app.use(express.json());

app.use('/api/tasks', tasksRouter);

app.listen(PORT, () => {
    console.log(`Server started successfully on port ${PORT}`);
});
