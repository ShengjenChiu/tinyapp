const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const { render } = require("express/lib/response");

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

//mock database
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "S152tx": "https://www.tsn.ca"
};


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
  const templateVars = {
    username: req.cookies["username"],
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
  const templateVars = { 
    username: req.cookies["username"]
  };
  res.render("urls_new", templateVars);
});



//show page
app.get("/urls/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  const templateVars = { 
    shortURL: req.params.shortURL,
    longURL: longURL,
    username: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

//registration form
app.get("/register", (req, res) => {
  res.render("urls_registration");
});


// //registration page
// app.post("/register", (req, res) => {
//   const templateVars = { 
//     username: req.cookies["username"]
//   };
//   res.redirect("urls_registration", templateVars);
// });


//user login element
app.post("/login", (req, res) => {
  const username = req.body.username;
  res.cookie('username', username);

  res.redirect("/urls");
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
  res.clearCookie("username");
  res.redirect("/urls");
});

//server activation
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});