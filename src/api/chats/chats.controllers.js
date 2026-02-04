import * as chatService from './chats.services.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const createChatController = asyncHandler(async (req, res) => {
  const {
    name,
    isGroupChat,
    participants,
    admins,
    groupCreatedBy,
    groupDescription,
  } = req.body;

  const createChat = await chatService.createChat({
    name,
    isGroupChat,
    participants,
    admins,
    groupCreatedBy,
    groupDescription,
  });

  
  return res.status(201).json({
    status: 'Success',
    message: 'Group created successfully',
    data: createChat,
  });
});
