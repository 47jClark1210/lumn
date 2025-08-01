module.exports = (req, res, next) => {
  // TODO: Replace this with real Azure AD authentication when available
  // For now, simulate a logged-in user (customize as needed)
  req.user = {
    id: 1,
    role: 'super_admin', // Change this to test different roles
    email: 'admin@example.com',
  };
  next();
};
