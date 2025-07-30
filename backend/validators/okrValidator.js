const { body } = require('express-validator');

// Validation rules for creating/updating an OKR (Objective)
const okrValidation = [
  body('title').isLength({ min: 1 }).withMessage('Objective title is required'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
];

module.exports = {
  okrValidation,
};
