const { body } = require('express-validator');

// Validation rules for creating/updating a key result
const keyResultValidation = [
  body('text').isLength({ min: 1 }).withMessage('Key result text is required'),
  body('detail').optional().isString().withMessage('Detail must be a string'),
];

module.exports = {
  keyResultValidation,
};
