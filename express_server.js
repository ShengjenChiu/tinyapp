const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "S152tx": "https://www.tsn.ca"
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));  //same as req.body.longURL???

//generate random short URL
function generateRandomString() {
  return Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1);
}

//registers a handler on the root path, "/"
app.get("/", (req, res) => {
  res.send("Hello!");
});

//
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
  //res.json(urlDatabase);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


app.get("/urls/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  const templateVars = { 
    shortURL: req.params.shortURL,
    longURL: longURL
  };
  res.render("urls_show", templateVars);
});


app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;

  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});



app.post("/urls/:id", (req, res) => {
  console.log(req.id);  // Log the POST request body to the console
  res.redirect("/urls");
});


app.post("/urls/:shortURL/delete", (req, res) => {
  const shortU = req.params.shortURL;

  //urlDatabase.splice(shortU, 1);
  delete urlDatabase[shortU];
  res.redirect("/urls");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});