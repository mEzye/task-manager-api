import express from "express"

import tasksRouter from "./tasks/tasks.routes.js"
import usersRouter from "./users/users.routes.js";
const app = express();
const PORT = process.env.PORT || 3000;

//global Middleware
app.use(express.json());

app.use('/api/tasks', tasksRouter);
app.use('/api/users', usersRouter);

app.listen(PORT, () => {
    console.log(`Server started successfully on port ${PORT}`);
});
