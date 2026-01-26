import express from 'express';
import tasksRouter from './tasks/tasks.routes.js';
import usersRouter from './users/users.routes.js';
import authRouter from './auth/auth.routes.js'
const app = express();

app.use(express.json());

app.use('/api/tasks', tasksRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

export default app;