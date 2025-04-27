import express, { Request, Response } from 'express';
import { connect } from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './user/user.controller';
import taskRouter from './task/task.controller';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors({
  origin: "*",
  credentials: true,
}));
app.use(express.json());

connect(process.env.DATABASE_URL as string)
.then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello');
});

app.use('/api/user', userRouter);
app.use('/api/task', taskRouter);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);

  });