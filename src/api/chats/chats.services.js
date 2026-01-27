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

  if (!participants.includes(groupCreatedBy)) {
    throw Object.assign(new Error('Group creator must be a participant'), {
      statusCode: 400,
    });
  }

  const invalidAdmins = admins.filter(
    (adminId) => !participants.includes(adminId),
  );

  if (invalidAdmins.length > 0) {
    throw Object.assign(new Error('Admins must be participants of the group'), {
      statusCode: 400,
    });
  }

  const group = await Chat.create({
    name: name.trim(),
    isGroupChat,
    participants,
    admins,
    groupCreatedBy,
    groupDescription,
  });

  return group;
};
