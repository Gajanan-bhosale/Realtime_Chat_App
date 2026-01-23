import * as userController from './user.controllers.js';

import express from 'express';
const router = express.Router();

router.get('/listUser', userController.listUserController);

router.get('/user', userController.getUserController);

router.post('/blockUser', userController.blockUserController);

router.post('/unBlock', userController.unblockUserController);

router.post('/forceLoggedOut', userController.blockUserController);

export default router;
