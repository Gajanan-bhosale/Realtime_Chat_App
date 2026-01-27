import * as chatController from './chats.controllers.js';

import express from 'express';

const router = express.Router();

router.post('/createGroup', chatController.createChatController);

export default router;
