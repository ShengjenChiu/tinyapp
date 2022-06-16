const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const { render } = require("express/lib/response");

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

//mock database of URLs
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "S152tx": "https://www.tsn.ca"
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
  }
}


//generate random short URL
function generateRandomString() {
  return Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1);
}


//registers a handler on the root path, "/"
app.get("/", (req, res) => {
  res.send("Hello!");
});


//index page
app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"]
 
  const templateVars = {
    //username: req.cookies["username"],
    user: users[userId],
    urls: urlDatabase
  };

  res.render("urls_index", templateVars);

  //res.json(urlDatabase);
});


//show long url
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


//enter new url page.
app.get("/urls/new", (req, res) => {
  const userId = req.cookies["user_id"]

  const templateVars = { 
    //username: req.cookies["username"]
    user: users[userId]
  };
  res.render("urls_new", templateVars);
});


//show page
app.get("/urls/:shortURL", (req, res) => {
  const userId = req.cookies["user_id"]
  const longURL = urlDatabase[req.params.shortURL];
  const templateVars = { 
    shortURL: req.params.shortURL,
    longURL: longURL,
    //username: req.cookies["username"]
    user: users[userId]
  };
  res.render("urls_show", templateVars);
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
  let user = users[user_id];
  
  user = {
    id: user_id,
    email: newEmail,
    password: newPassword
  };

  const templateVars = user;

  res.cookie("user_id", user_id);

console.log(`user: ${user}; user_id: ${user_id}`);

  res.redirect("urls", templateVars);
});


//user login element
app.post("/login", (req, res) => {
  // const userId = req.cookies["user_id"]
  // const user = users[userId];
  // const email = user.email;
  const userEmail = req.params.email;
  const password = req.params.password;

  const templateVars = { 
    email: userEmail,
    password: password
  };

  res.redirect("/urls", templateVars);
});


//build short url and long url database
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;

  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});


//redrect back to index page
app.post("/urls/:id", (req, res) => {
  res.redirect("/urls");
});


//delete existing url.
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortU = req.params.shortURL;

  //urlDatabase.splice(shortU, 1);
  delete urlDatabase[shortU];
  res.redirect("/urls");
});


//user logout
app.get("/logout", (req, res) => {
  //res.clearCookie("username");
  res.clearCookie("user_id");
  res.redirect("/urls");
});


//server activation
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


// const regErrHandler = function (email, password) {
//   let returnStr = '';
//   const 

//   if (email === '' || password ==='' ) {
//     return returnStr = 'status_code=400';
//   }

//   users.forEach(element => {
    
//   });
// }; 

