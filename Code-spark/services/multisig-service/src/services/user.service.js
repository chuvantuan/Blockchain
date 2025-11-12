const identityServiceClient = require('../clients/identityServiceClient');

const getIdentityUserById = async (userId, authHeader) => {
  return identityServiceClient.getUserById(userId, authHeader);
};

const getCurrentIdentityUser = async (authHeader) => {
  return identityServiceClient.getCurrentUser(authHeader);
};

module.exports = {
  getIdentityUserById,
  getCurrentIdentityUser,
};


