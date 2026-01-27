import Joi from 'joi';
import mongoose from 'mongoose';

const objectId = Joi.string()
  .custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error('any.objectId');
    }

    return value;
  }, 'ObjectId validation')
  .messages({
    'any.objectId': 'Invalid author id',
  });

export const createChat = Joi.object({
  isGroupChat: Joi.boolean().default(false),
  name: Joi.string().trim().min(3).max(50).when('isGroupChat', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  participants: Joi.array().items(objectId).min(2).required().messages({
    'array.min': 'Participants must contain at least 2 user',
    'any.required': 'Participants are required',
  }),
  admins: Joi.array()
    .items(objectId)
    .when('isGroupChat', {
      is: true,
      then: Joi.array().min(1).required(),
      otherwise: Joi.forbidden(),
    }),
  groupCreatedBy: objectId.when('isGroupChat', {
    is: true,
    then: objectId.required(),
    otherwise: Joi.forbidden(),
  }),
  groupDescription: Joi.string().trim().min(5).max(200).when('isGroupChat', {
    is: true,
    then: Joi.optional(),
    otherwise: Joi.forbidden(),
  }),
});
