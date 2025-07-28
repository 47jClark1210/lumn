const { body } = require('express-validator');

// Validation rules for creating/updating a team
const teamValidation = [
  body('name')
    .isLength({ min: 1 })
    .withMessage('Team name is required'),
  body('summary')
    .optional()
    .isString()
    .withMessage('Summary must be a string')
];

module.exports = {
  teamValidation
};