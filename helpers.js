function getUserByEmail(email, database) {
  for (const userId in database) {
    if (email === database[userId].email) {
      return database[userId];
    }
  }
  return undefined;
}

module.exports = {
  getUserByEmail
};