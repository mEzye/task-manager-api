import express, {type Request,type Response} from 'express'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

interface Task{
    id: number;
    title: string;
    isCompleted: boolean;
    createdAT?: Date;
}


let tasks: Task[] = [
    {id: 1, title: "Вивчити Node.js", isCompleted: false},
    {id: 2, title: "Встановити Postman", isCompleted: true}
];

let nextId: number = 3;

app.get('/api/tasks', (req: Request, res: Response) => {
    res.json(tasks);
})

app.post('/api/tasks', (req: Request, res: Response) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({message: "Title is required"});
    }

    const newTask: Task = {
        id: nextId++,
        title: title,
        isCompleted: false,
        createdAT: new Date()
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req: Request, res: Response) =>{
    const { id } = req.params;
    const { title, isCompleted } = req.body;
    
    const task = tasks.find(t => t.id === parseInt(id))

    if(!task){
        return res.status(404).json({message: "Task not found"});
    }

    if (title !== undefined) {
        task.title = title; 
    }
    if (isCompleted !== undefined) {
        task.isCompleted = isCompleted;
    }

    res.json(task);
});

app.delete('/api/tasks/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const taskIndex = tasks.findIndex(t => t.id === parseInt(id));

    if (taskIndex === -1){
        return res.status(404).json({message: "Task not found"});
    }

    tasks.splice(taskIndex, 1);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Сервер успішно запущено на порті ${PORT}`);
});