const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const { render } = require("express/lib/response");
// const bcrypt = require('bcryptjs');
// const password = "purple-monkey-dinosaur"; // found in the req.params object
// const hashedPassword = bcrypt.hashSync(password, 10);
// const helper = require("helpers");
// const 

app.set("view engine", "ejs");

//Middlewares
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

//mock database of URLs
const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "b2xVn2"
  },
  
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "9sm5xK"
  },
  

  "S152tx": {
    longURL: "https://www.tsn.ca",
    userID: "S152tx"
  },

  "b6UTxQ": {
    longURL: "https://www.tsn.ca",
    userID: "b6UTxQ"
  },

  "i3BoGr": {
    longURL: "https://www.google.ca",
    userID: "i3BoGr"
  }
};


//mock database of users
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "123" //"purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "456" //"dishwasher-funk"
  }
}


//generate random short URL
function generateRandomString() {
  return Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1);
}


function getUserByEmail(email) {
  for (const userId in users) {
    if (email === users[userId].email) {
      return users[userId];
    }
  }
  return null;
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
});


//show long url
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});


//enter new url page.
app.get("/urls/new", (req, res) => {
  const userId = req.cookies["user_id"]
  console.log("userId:", userId);
  if (!userId) {
    res.redirect("/login");
  } else {
    const templateVars = { 
      //username: req.cookies["username"]
      user: users[userId]
    };
    res.render("urls_new", templateVars);
  }
});


//show page
app.get("/urls/:shortURL", (req, res) => {
  const userId = req.cookies["user_id"];
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = { 
    shortURL,
    longURL,
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
  
  if (newEmail === '' || newPassword === '') {
    res.status(400).send('400. Please enter email/password.');
  }

  if(getUserByEmail(newEmail)) {
    res.status(400).send('400. Your email has already exist.');
  }

  let user = {
    id: user_id,
    email: newEmail,
    password: newPassword
  };
  users[user_id] = user;
  
  //const templateVars = { user };
  
  res.cookie("user_id", user_id);
  
  //res.redirect("urls_registration", templateVars);
  res.redirect("/urls");
});


//user login page
app.post("/login", (req, res) => {
  // const userId = req.cookies["user_id"]
  // const user = users[userId];
  // const email = user.email;
  const password = req.body.password;
  const userEmail = req.body.email;
  const user1 = getUserByEmail(userEmail);

  if (!user1) {
    res.status(403).send("403. We cannot find the user.");
  }
  
  if (!(password === user1.password)) {
    res.status(403).send("403. Password does not exist.");      
  } else {
    res.cookie("user_id", user1.id);
    res.redirect("/urls");
  }
});


//build short url and long url database
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;

  const userID = res.cookie("user_id");

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


//redrect back to index page
app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = req.body.longURL;
  urlDatabase[shortURL].longURL = longURL;
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

// const urlsForUser = function (id) {
//   let _url = '';

//   if (id === id of currently logged in user)

//   return _url;
// };


// bcrypt.compareSync("purple-monkey-dinosaur", hashedPassword); // returns true
// bcrypt.compareSync("pink-donkey-minotaur", hashedPassword); // returns false