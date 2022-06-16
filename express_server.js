const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const { render } = require("express/lib/response");

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));  //same as req.body.longURL???

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


app.get("/urls", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase
  };

  res.render("urls_index", templateVars);

  //res.json(urlDatabase);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


app.get("/urls/new", (req, res) => {
  const templateVars = { 
    username: req.cookies["username"]
  };
  res.render("urls_new", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  const templateVars = { 
    shortURL: req.params.shortURL,
    longURL: longURL,
    username: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  res.cookie('username', username);

  res.redirect("/urls");
});


app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;

  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});


app.post("/urls/:id", (req, res) => {
  res.redirect("/urls");
});


app.post("/urls/:shortURL/delete", (req, res) => {
  const shortU = req.params.shortURL;

  //urlDatabase.splice(shortU, 1);
  delete urlDatabase[shortU];
  res.redirect("/urls");
});


app.get("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});