import express from 'express' ;
import { Login, Register } from '../controller/AuthController.js';

const router = express.Router();

router.post('/register',Register);
router.post('/login',Login);


export default router ;