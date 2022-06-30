const bcrypt = require('bcryptjs');

//mock database of URLs
const urlDatabase = {
  k5xTu9: {
    longURL: "http://www.lighthouselabs.ca",
    userID: "b2xVn2"
  },
  

  S152tx: {
    longURL: "https://www.tsn.ca",
    userID: "b2xVn2"
  },


  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },

  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
};

//mock database of users
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },

  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: bcrypt.hashSync("dishwasher-funk", 10)

  },

  "userRandomID1": {
    id: "userRandomID1", 
    email: "user0@example.com", 
    password: bcrypt.hashSync("123", 10)
  },

  "userRandomID2": {
    id: "userRandomID2", 
    email: "user3@example.com", 
    password: bcrypt.hashSync("456", 10)
  },

  "userRandomID3": {
    id: "userRandomID3", 
    email: "shc6@example.com", 
    password: bcrypt.hashSync("789", 10)
  },

  "userRandomID4": {
    id: "userRandomID4", 
    email: "shc7@example.com", 
    password: bcrypt.hashSync("098", 10)
  },

  "userRandomID5": {
    id: "userRandomID5", 
    email: "shc8@example.com", 
    password: bcrypt.hashSync("765", 10)

  }
};

function getUserByEmail(email, database) {
  for (const userId in database) {
    if (email === database[userId].email) {
      return database[userId];
    }
  }
  return undefined;
}

//generate random short URL
function generateRandomString() {
  return Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1);
}

//url for users
function urlsForUser(id) {
  let _url = '';
  let keysArr = Object.keys(urlDatabase);

  for (const k of keysArr) {
    if (id === urlDatabase[k].userID) {
      _url = urlDatabase[k].longURL;
    }
  }
  return _url;
}

module.exports = {
  getUserByEmail,
  generateRandomString,
  urlDatabase,
  users,
  urlsForUser
};