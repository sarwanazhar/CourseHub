import express from 'express';
import { getUser, getUserById, register, updateUserDetails, updateUserDetailsWithoutFile } from '../controllers/user.Controller';
import multer from 'multer';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/register', (req, res) => {
  register(req, res)
});

router.get('/', (req, res) => {
  getUser(req, res);
});

router.get('/:id', (req, res) => {
  getUserById(req, res);
});

router.post('/update', upload.single('file'), (req, res) => {
  updateUserDetails(req, res)
})

router.post('/update/withoutfile', (req, res) => {
  updateUserDetailsWithoutFile(req, res)
})

export default router; 