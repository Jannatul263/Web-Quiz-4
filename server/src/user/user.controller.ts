import { Router, Request, Response } from 'express';
import {UserService} from './user.service'

const router = Router();

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await UserService.createUser({ name, email, password });
        res.status(201).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: (error as Error).message });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserService.validateUser(email, password);
        const token = await UserService.login(user);
        res.status(200).json(token);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: (error as Error).message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserService.findById(id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


export default router;