const express = require("express");
const app = express();
const PORT = 8087; // default port 8080
const { render } = require("express/lib/response");
const morgan = require('morgan');
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const { getUserByEmail,
        generateRandomString,
        urlDatabase,
        users,
        urlsForUser
      } = require('./helpers');

//view engine
app.set("view engine", "ejs");

//Middlewares
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cookieSession({
  name: 'session',
  keys: ['oh', 'Lord', 'Christ', 'Jesus'],
}));


//registers a handler on the root path, "/"
app.get("/", (req, res) => {
  res.redirect('/urls');
});


//index page
app.get("/urls", (req, res) => {
  const userId = req.session.user_id;
  let _url = urlsForUser(userId);
  let shortURLArr = [];

  shortURLArr.push(_url);
  const userUrls = {}

  for (const url in urlDatabase) {
    const urldetails = urlDatabase[url]
    if (urldetails["userID"] === userId) {
      userUrls[url] = urldetails;
    }
  }

  const templateVars = {
    user: users[userId],
    urls: userUrls,
    shortURL: shortURLArr
  };
   
  res.render("urls_index", templateVars);

});


//enter new url page.
app.get("/urls/new", (req, res) => {
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
  const userId = req.session.user_id;
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL]?.longURL;

  if (!longURL) {
    return res.send('invalid url');
  }

  if (!userId) {
    res.render("urls_login");
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
  const longURL = urlDatabase[shortURL]?.longURL;

  if (!longURL) {
    return res.send('invalid url');
  }

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

  let user = {
    id: user_id,
    email: newEmail,
    password: hashedPassword
  };
  users[user_id] = user;
  
  req.session.user_id = user_id;
  res.redirect("/urls");
});


//user login page
app.post("/login", (req, res) => {
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
  
  req.session.user_id = user1.id
  res.redirect("/urls");

});


//build short url and long url database
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
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
  const userId = req.session.user_id
  const shortURL = req.params.id;
  const longURL = req.body.longURL;

  if (!userId) {
    res.render("urls_login");
  } else {
    urlDatabase[shortURL].longURL = longURL;
    res.redirect("/urls");
  }

});


//delete existing url.
app.post("/urls/:shortURL/delete", (req, res) => {
  const userId = req.session.user_id
  const shortU = req.params.shortURL;

  if (!userId) {
    res.redirect("/login");
  } else {
    delete urlDatabase[shortU];
    res.redirect("/urls");
  }
});


//user logout
app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});


//server activation
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
