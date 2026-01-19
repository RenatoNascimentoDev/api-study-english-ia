import { Router } from 'express';
import userController from '../controllers/UserController.js';
import { validate } from '../middlewares/validate.js';
import { createLocalSchema, createGoogleSchema, loginSchema } from '../schema/userSchemas.js';
import { auth } from '../middlewares/auth.js'
import { changePasswordSchema } from '../schema/userSchemas.js';
 
const router = Router();

router.post('/users/local', validate(createLocalSchema), userController.createLocal);
router.post('/users/google', validate(createGoogleSchema), userController.createGoogle);
router.get('/users', auth, userController.list);
router.post('/auth/login', validate(loginSchema), userController.login);
router.patch('/users/:id/password', auth, validate(changePasswordSchema), userController.changePassword);

export default router;
