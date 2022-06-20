const express = require("express");
const app = express();
const PORT = 8087; // default port 8080
const { render } = require("express/lib/response");
const morgan = require('morgan');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const { getUserByEmail } = require('./helpers');

//console.log(getUserByEmail);

app.set("view engine", "ejs");

//Middlewares
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cookieSession({
  name: 'session',
  keys: ['oh', 'Lord', 'Christ', 'Jesus'],

  // Cookie Options
  //maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))


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
    password: "purple-monkey-dinosaur"
  },

  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  },

  "userRandomID1": {
    id: "userRandomID1", 
    email: "user0@example.com", 
    password: "765"
  },

  "userRandomID2": {
    id: "userRandomID2", 
    email: "user3@example.com", 
    password: "098"
  },

  "userRandomID3": {
    id: "userRandomID3", 
    email: "shc6@example.com", 
    password: "789"
  },

  "userRandomID4": {
    id: "userRandomID4", 
    email: "shc7@example.com", 
    password: "456"
  },

  "userRandomID5": {
    id: "userRandomID5", 
    email: "shc8@example.com", 
    password: "123"
  }
}


//generate random short URL
function generateRandomString() {
  return Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1);
}


function urlsForUser(id) {
  let _url = '';
  let keysArr = Object.keys(urlDatabase);

  for (const k of keysArr) {
    if (id === urlDatabase[k].userID) {
      _url = urlDatabase[k].longURL;
    }
  }

  return _url;
};

//registers a handler on the root path, "/"
app.get("/", (req, res) => {
  res.send("Hello!");
});


//index page
app.get("/urls", (req, res) => {
  //const userId = req.cookies["user_id"]
  const userId = req.session.user_id;
  let _url = urlsForUser(userId);
  let shortURLArr = [];

  shortURLArr.push(_url);

  const templateVars = {
    user: users[userId],
    urls: urlDatabase,
    shortURL: shortURLArr
  };
    
  res.render("urls_index", templateVars);

});


//enter new url page.
app.get("/urls/new", (req, res) => {
  //const userId = req.cookies["user_id"]
  const userId = req.session.user_id;
  console.log("userId:", userId);

  if (!userId) {
    res.redirect("/login");
  } else {
    const templateVars = { 
      user: users[userId]
    };
    res.render("urls_new", templateVars);
  }
});


//show page
app.get("/urls/:shortURL", (req, res) => {
  //const userId = req.cookies["user_id"];
  const userId = req.session.user_id;
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;

  if (!userId) {
    res.render("urls_login");
  // } else if (userId !== shortURL) {
  //   res.send("This is not your URL.");
  } else {
    const templateVars = { 
      shortURL,
      longURL,
      user: users[userId]
    };
    res.render("urls_show", templateVars);
  }
});


//show long url with shortURL
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;

  if (!shortURL) {
    res.status.send("Error: the short URL does not exist.");
  } else {
    res.redirect(longURL);
  }
});


//registration form
app.get("/register", (req, res) => {
  res.render("urls_registration");
});

//login form
app.get("/login", (req, res) => {
  res.render("urls_login");
});

//Registration page
app.post("/register", (req, res) => {
  const newEmail = req.body.email;
  const newPassword = req.body.password;
  const user_id = generateRandomString();
  const currentUser = getUserByEmail(newEmail, users);

  if (newEmail === '' || newPassword === '') {
    res.status(400).send('400. Please enter email/password.');
  }

  if(currentUser) {
    res.status(400).send('400. A user with that email has already exist.');
  }

  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(newPassword, salt);
  
  console.log(`currentUser: ${currentUser}`);
  console.log(`hashedPassword: ${hashedPassword}`);

  let user = {
    id: user_id,
    email: newEmail,
    password: hashedPassword
  };
  users[user_id] = user;
  
  //res.cookie("user_id", user_id);
  req.session.user_id = user_id;
  res.redirect("/urls");
});


//user login page
app.post("/login", (req, res) => {
  // const userId = req.cookies["user_id"]
  // const user = users[userId];
  // const email = user.email;
  const password = req.body.password;
  const userEmail = req.body.email;
  const user1 = getUserByEmail(userEmail, users);

  if (!user1) {
    res.status(403).send("403. We cannot find the user.");
  }
  
  const result = bcrypt.compareSync(password, user1.password);

  if (!result) {
    console.log('NOT logged in!');
    return res.status(403).send("403. Password does not match.");      
  }
  
  //res.cookie("user_id", user1.id);

  req.session.user_id = user1.id
  res.redirect("/urls");

});


//build short url and long url database
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  //const userID = req.cookies["user_id"];
  const userID = req.session.user_id;

  if (!userID) {
    res.redirect("/login");      
  } else {
    urlDatabase[shortURL] = {
      longURL,
      userID
    };
    res.redirect(`/urls/${shortURL}`);
  }

});


//edit existing url.
app.post("/urls/:id", (req, res) => {
  //const userId = req.cookies["user_id"];
  const userId = req.session.user_id
  const shortURL = req.params.id;
  const longURL = req.body.longURL;

  if (!userId) {
    res.render("urls_login");
  // } else if (userId !== shortURL) {
  //   res.send("This is not the URL you created.");
  } else {
    urlDatabase[shortURL].longURL = longURL;
    res.redirect("/urls");
  }

});


//delete existing url.
app.post("/urls/:shortURL/delete", (req, res) => {
  //const userId = req.cookies["user_id"];
  const userId = req.session.user_id
  const shortU = req.params.shortURL;

  if (!userId) {
    res.redirect("/login");
  // } else if (userId !== shortU) {
  //   res.send("This is not the URL you created.");
  } else {
    delete urlDatabase[shortU];
    res.redirect("/urls");
  }
});


//user logout
app.get("/logout", (req, res) => {
  //res.clearCookie("user_id");
  req.session = null;
  res.redirect("/urls");
});


//server activation
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
