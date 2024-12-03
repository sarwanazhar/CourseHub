import express from 'express';
import { getUser, getUserById, register } from '../controllers/user.Controller';

const router = express.Router();

router.post('/register', (req,res) => {
  register(req,res)
});

router.get('/', (req, res) => {
  getUser(req, res);
});

router.get('/:id', (req, res) => {
  getUserById(req, res);
});

export default router; 