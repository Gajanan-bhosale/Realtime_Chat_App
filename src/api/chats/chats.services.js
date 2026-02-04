import Chat from './chat.models.js';

export const createChat = async ({
  name,
  isGroupChat,
  participants,
  admins,
  groupCreatedBy,
  groupDescription,
}) => {
  if (!name || !name.trim()) {
    throw Object.assign(new Error('Group name is required'), {
      statusCode: 400,
    });
  }

  if (!isGroupChat) {
    throw Object.assign(new Error('isGroupChat must be true'), {
      statusCode: 400,
    });
  }

  const nameExist = await Chat.findOne({ name });
  if (nameExist) {
    throw Object.assign(new Error('Group name already exists'), {
      statusCode: 409,
    });
  }

  if (!participants || participants.length < 2) {
    throw Object.assign(new Error('At least 2 members are required'), {
      statusCode: 400,
    });
  }

  if (!admins || admins.length === 0) {
    throw Object.assign(new Error('At least one admin is required'), {
      statusCode: 400,
    });
  }

  const participantSet = new set(participants.map(string));

  if (!participantSet.has(groupCreatedBy)) {
    throwError('Group creator must be a participants', 400);
  }

  const invalidAdmins = admins.filter((id) => !participantSet.has(string(id)));

  if (invalidAdmins.length) {
    throw Object.assign(new Error('Admins must be participants of the group'), {
      statusCode: 400,
    });
  }

  try {
    const group = await Chat.create({
      name: name.trim(),
      isGroupChat,
      participants,
      admins,
      groupCreatedBy,
      groupDescription,
    });

    return group;
  } catch (error) {
    if (error.code === 11000) {
      throw Object.assign(new Error('Internal server error'), {
        statusCode: 500,
      });
    }
  }
};

export const getChat = async ({ page = 1, limit = 10 }, userId) => {
  try {
    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.min(Number(limit), 50);

    const skip = (pageNum - 1) * limitNum;
    const filter = { isArchived: false, participants: userId };

    const [chats, totalChats] = await Promise.all([
      await Chat.find(filter)
        .populate('groupCreatedBy', 'name email')
        .populate('participants', 'name email')
        .populate('admin', 'name email')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),

      Chat.countDocuments(filter),
    ]);

    if (!chats) {
      throw Object.assign(new Error('No chats founds'), {
        statusCode: 400,
      });
    }

    return {
      chats,
      pagination: {
        total: totalChats,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalChats / limitNum),
      },
    };
  } catch (error) {
    if (error.statusCode) throw error;
    console.error(error);
    throw Object.assign(new Error('Internal server error'), {
      statusCode: 500,
    });
  }
};

export const getChatById = async (chatId, userId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      throwError('Invalid chat id', 400);
    }

    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId,
    })
      .populate('groupCreatedBy', 'name email')
      .populate('participants', 'name email')
      .populate('admins', 'name email')
      .lean();

    if (!chat) {
      throw Object.assign(new Error('Chat not found'), {
        statusCode: 404,
      });
    }

    return chat;
  } catch (error) {
    if (error.statusCode) throw error;
    console.error(error);
    throw Object.assign(new Error('Internal server error'), {
      statusCode: 500,
    });
  }
};

export const addParticipants = async (chatId, userIds, currentUserId) => {
  const chat = await Chat.findOne(chatId);

  if (!chat) {
    const error = new Error('Chat not found');
    error.statusCode = 404;
    throw error;
  }

  if (!chat.admins.includes(currentUserId)) {
    const error = new Error('Only admin can add participants');
    error.statusCode = 400;
    throw error;
  }

  const newUser = userIds.filter((id) => !chat.participants.includes(id));

  if (!newUser.length) {
    const error = new Error('User already in group');
    error.statusCode = 400;
    throw error;
  }

  chat.participants.push(...newUser);

  await chat.save();

  return chat;
};

export const removeParticipants = async (
  chatId,
  userIdToRemove,
  currentUserId,
) => {
  const chat = await Chat.findOne(chatId);

  if (!chat) {
    const error = new Error('Chat group not found');
    error.statusCode = 404;
    throw error;
  }

  if (!chat.admins.includes(currentUserId)) {
    const error = new Error('Only admin can remove the participants');
    error.statusCode = 401;
    throw error;
  }

  if (!chat.participants.includes(userIdToRemove)) {
    const error = new Error('User are not in group');
    error.statusCode = 400;
    throw error;
  }
  chat.participants = chat.participants.filter(
    (id) => id.string() !== userIdToRemove,
  );

  chat.admins = chat.admins.filter((id) => id.string() !== userIdToRemove);

  await chat.save();
  return chat;
};
