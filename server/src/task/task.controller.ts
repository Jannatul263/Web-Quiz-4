import { Router } from 'express';
import { TaskService } from './task.service';
import { UserService } from '../user/user.service';

const router = Router();

router.post('/', UserService.checkUser, async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = res.locals?.user?._id;
        const task = await TaskService.create({title, description, userId});
        res.status(201).json({task: task.toJSON()});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/', UserService.checkUser, async (req, res) => {
    try {
        const userId = res.locals?.user?._id;
        const tasks = await TaskService.getByUserId(userId);
        res.status(200).json(tasks);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:id', UserService.checkUser, async (req, res) => {
    try {
        const { id } = req.params;
        const task = await TaskService.getById(id);
        
        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        if (task.userId !== res.locals?.user?._id) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }

        res.status(200).json({task: task.toJSON()});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.patch('/:id', UserService.checkUser, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, completed } = req.body;
        const task = await TaskService.getById(id);
        
        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        if (task.userId !== res.locals?.user?._id) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.completed = completed !== undefined ? completed : task.completed;
        await task.save();
        res.status(200).json({task: task.toJSON()});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:id', UserService.checkUser, async (req, res) => {
    try {
        const { id } = req.params;
        const task = await TaskService.getById(id);
        
        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        if (task.userId !== res.locals?.user?._id) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }

        await TaskService.delete(id);
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;