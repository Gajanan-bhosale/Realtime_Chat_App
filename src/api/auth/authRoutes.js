import * as authController from './auth.controllers.js';
import express from 'express';

const router = express.Router();

router.post('/register', authController.registerUserController);

router.post('/login', authController.loginUserController);

router.post('/logout/:id', authController.logoutUserController);

router.post('/password/:id', authController.changeCurrentPasswordController);

router.post('/refreshToken', authController.refreshAccessTokenController);

router.get('/userData', authController.getUserDateController);

export default router;
