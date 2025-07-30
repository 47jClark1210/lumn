const { body } = require('express-validator');

// Validation rules for creating/updating an update
const updateValidation = [
  body('content')
    .isLength({ min: 1 })
    .withMessage('Update content is required'),
  body('authorId').isInt().withMessage('Author ID must be an integer'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO8601 string'),
];

module.exports = {
  updateValidation,
};
