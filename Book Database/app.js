const express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
const session = require('express-session');
var flush = require('connect-flash');
const { json, response } = require('express');
const { UnprocessableEntity } = require('http-errors');
const { request } = require('http');
const { Console, log } = require('console');
const { stringify } = require('querystring');
const app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
  secret: 'secret',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false
}));
app.use(flush());

const booksList = ["Lord of the Flies", "The Grapes of Wrath", "Leaves of Grass", "The Sun and Her Flowers", "Dune", "To Kill a Mockingbird"];
var filteredBooks;
var wantToRead;



app.get('/', function (req, res) {
  res.render('login', { message: req.flash('message') });
});
app.post('/', function (req, res) {
  var user = req.body.username;
  var pass = req.body.password;
  var login = false;
  var data = fs.readFileSync("users.json");
  if (data.length == 0) {
    req.flash('message', 'username or password is not correct');
    res.redirect('/');
  }
  else {
    var accounts = JSON.parse(data);
    for (i = 0; i < accounts.length; i++) {
      if (accounts[i].user == user && accounts[i].pass == pass) {
        login = true;
        req.session.acc = accounts[i];
      }
    }
    if (login == true)
      res.redirect('/home');
    if (login == false) {
      req.flash('message', 'username or password is not correct');
      res.redirect('/');
    }

  }
});

app.get('/registration', function (req, res) {
  res.render('registration', { message: req.flash('message') });
});


function writeInUsersJson(account) {
  var data = fs.readFileSync("users.json");
  var accounts
  if (data.length == 0) {
    accounts = [account];
    fs.writeFileSync("users.json", JSON.stringify(accounts));
  }
  else {
    accounts = JSON.parse(data);
    accounts.push(account);
    fs.writeFileSync("users.json", JSON.stringify(accounts));
  }
}

app.post('/register', function (req, res) {
  var user = req.body.username;
  var pass = req.body.password;
  var register = true;
  var account = { user: user, pass: pass, wantToRead: [] };
  var data = fs.readFileSync("users.json");
  if (user == "" || pass == "") {
    req.flash('message', 'this account is already taken');
    res.redirect('/registration');
  }
  else {
    if (data.length == 0) {
      writeInUsersJson(account);
      req.flash('message', 'registeration done successfully');
      res.redirect('/');
    }
    else {
      var accounts = JSON.parse(data);
      for (i = 0; i < accounts.length; i++) {
        if (accounts[i].user == user && accounts[i].pass == pass) 
          register = false;
      }
      if (register == true && data.length != 0) {
        writeInUsersJson(account);
        req.flash('message', 'registeration done successfully');
        res.redirect('/');
      }
      if(register == false ){
        req.flash('message', 'this account is already taken');
          res.redirect('/registration');
      }
    }
  }
});

app.get('/searchresults', function (req, res) {
  if (req.session.acc == null) {
    req.flash('message', 'login please');
    res.redirect('/');
  }
  else
    res.render('searchresults', { filteredBooks, message: req.flash('message') })
});

app.post('/search', function (req, res) {
  var searchString = req.body.Search.toLowerCase();
  filteredBooks = booksList.filter((booksList) => { return booksList.toLowerCase().includes(searchString); });
  if (filteredBooks.length == 0) {
    req.flash('message', 'Book Not Found');
    res.redirect('/searchresults');
  }
  else {
    res.redirect('/searchresults');
  }
});

app.get('/readlist', function (req, res) {
  if (req.session.acc == null) {
    req.flash('message', 'login please');
    res.redirect('/');
  }
  else {
    var data = fs.readFileSync("users.json");
    var accounts = JSON.parse(data);
    var wantToRead ;
    for (i = 0; i < accounts.length; i++) {
      if (accounts[i].user == req.session.acc.user && accounts[i].pass == req.session.acc.pass) {
          wantToRead = accounts[i].wantToRead ;
        }
      }
      res.render('readlist', { wantToRead })
    }
  });


app.get('/dune', function (req, res) {
  if (req.session.acc == null) {
    req.flash('message', 'login please');
    res.redirect('/');
  }
  else
    res.render('dune', { message: req.flash('message') })
});
app.post('/dune', function (req, res) {
  var data = fs.readFileSync("users.json");
  var accounts = JSON.parse(data);
  for (i = 0; i < accounts.length; i++) {
    if (accounts[i].user == req.session.acc.user && accounts[i].pass == req.session.acc.pass) {
      wantToRead = accounts[i].wantToRead;
      if (wantToRead.includes("dune")) {
        req.flash('message', 'book already in Want To Read List');
        res.redirect('/dune');
      }
      else {
        wantToRead.push("dune");
        req.session.acc = { user: req.session.acc.user, pass: req.session.acc.pass, wantToRead: wantToRead };
        accounts[i] = { user: req.session.acc.user, pass: req.session.acc.pass, wantToRead: wantToRead };
        fs.writeFileSync("users.json", JSON.stringify(accounts));
        req.flash('message', 'book added to want to read list');
        res.redirect('/dune');
      }
    }
  }

});

app.get('/flies', function (req, res) {
  if (req.session.acc == null) {
    req.flash('message', 'login please');
    res.redirect('/');
  }
  else
    res.render('flies', { message: req.flash('message') })
});
app.post('/flies', function (req, res) {
  var data = fs.readFileSync("users.json");
  var accounts = JSON.parse(data);
  for (i = 0; i < accounts.length; i++) {
    if (accounts[i].user == req.session.acc.user && accounts[i].pass == req.session.acc.pass) {
      wantToRead = accounts[i].wantToRead;
      if (wantToRead.includes("flies")) {
        req.flash('message', 'book already in Want To Read List');
        res.redirect('/flies');
      }
      else {
        wantToRead.push("flies");
        req.session.acc = { user: req.session.acc.user, pass: req.session.acc.pass, wantToRead: wantToRead };
        accounts[i] = { user: req.session.acc.user, pass: req.session.acc.pass, wantToRead: wantToRead };
        fs.writeFileSync("users.json", JSON.stringify(accounts));
        req.flash('message', 'book added to want to read list');
        res.redirect('/flies');
      }
    }
  }
});

app.get('/grapes', function (req, res) {
  if (req.session.acc == null) {
    req.flash('message', 'login please');
    res.redirect('/');
  }
  else
    res.render('grapes', { message: req.flash('message') })
});
app.post('/grapes', function (req, res) {
  var data = fs.readFileSync("users.json");
  var accounts = JSON.parse(data);
  for (i = 0; i < accounts.length; i++) {
    if (accounts[i].user == req.session.acc.user && accounts[i].pass == req.session.acc.pass) {
      wantToRead = accounts[i].wantToRead;
      if (wantToRead.includes("grapes")) {
        req.flash('message', 'book already in Want To Read List');
        res.redirect('/grapes');
      }
      else {
        wantToRead.push("grapes");
        req.session.acc = { user: req.session.acc.user, pass: req.session.acc.pass, wantToRead: wantToRead };
        accounts[i] = { user: req.session.acc.user, pass: req.session.acc.pass, wantToRead: wantToRead };
        fs.writeFileSync("users.json", JSON.stringify(accounts));
        req.flash('message', 'book added to want to read list');
        res.redirect('/grapes');
      }
    }
  }
});

app.get('/leaves', function (req, res) {
  if (req.session.acc == null) {
    req.flash('message', 'login please');
    res.redirect('/');
  }
  else
    res.render('leaves', { message: req.flash('message') })
});
app.post('/leaves', function (req, res) {
  var data = fs.readFileSync("users.json");
  var accounts = JSON.parse(data);
  for (i = 0; i < accounts.length; i++) {
    if (accounts[i].user == req.session.acc.user && accounts[i].pass == req.session.acc.pass) {
      wantToRead = accounts[i].wantToRead;
      if (wantToRead.includes("leaves")) {
        req.flash('message', 'book already in Want To Read List');
        res.redirect('/leaves');
      }
      else {
        wantToRead.push("leaves");
        req.session.acc = { user: req.session.acc.user, pass: req.session.acc.pass, wantToRead: wantToRead };
        accounts[i] = { user: req.session.acc.user, pass: req.session.acc.pass, wantToRead: wantToRead };
        fs.writeFileSync("users.json", JSON.stringify(accounts));
        req.flash('message', 'book added to want to read list');
        res.redirect('/leaves');
      }
    }
  }
});

app.get('/mockingbird', function (req, res) {
  if (req.session.acc == null) {
    req.flash('message', 'login please');
    res.redirect('/');
  }
  else
    res.render('mockingbird', { message: req.flash('message') })
});
app.post('/mockingbird', function (req, res) {
  var data = fs.readFileSync("users.json");
  var accounts = JSON.parse(data);
  for (i = 0; i < accounts.length; i++) {
    if (accounts[i].user == req.session.acc.user && accounts[i].pass == req.session.acc.pass) {
      wantToRead = accounts[i].wantToRead;
      if (wantToRead.includes("mockingbird")) {
        req.flash('message', 'book already in Want To Read List');
        res.redirect('/mockingbird');
      }
      else {
        wantToRead.push("mockingbird");
        req.session.acc = { user: req.session.acc.user, pass: req.session.acc.pass, wantToRead: wantToRead };
        accounts[i] = { user: req.session.acc.user, pass: req.session.acc.pass, wantToRead: wantToRead };
        fs.writeFileSync("users.json", JSON.stringify(accounts));
        req.flash('message', 'book added to want to read list');
        res.redirect('/mockingbird');
      }
    }
  }
});

app.get('/sun', function (req, res) {
  if (req.session.acc == null) {
    req.flash('message', 'login please');
    res.redirect('/');
  }
  else
    res.render('sun', { message: req.flash('message') })
});
app.post('/sun', function (req, res) {
  var data = fs.readFileSync("users.json");
  var accounts = JSON.parse(data);
  for (i = 0; i < accounts.length; i++) {
    if (accounts[i].user == req.session.acc.user && accounts[i].pass == req.session.acc.pass) {
      wantToRead = accounts[i].wantToRead;
      if (wantToRead.includes("sun")) {
        req.flash('message', 'book already in Want To Read List');
        res.redirect('/sun');
      }
      else {
        wantToRead.push("sun");
        req.session.acc = { user: req.session.acc.user, pass: req.session.acc.pass, wantToRead: wantToRead };
        accounts[i] = { user: req.session.acc.user, pass: req.session.acc.pass, wantToRead: wantToRead };
        fs.writeFileSync("users.json", JSON.stringify(accounts));
        req.flash('message', 'book added to want to read list');
        res.redirect('/sun');
      }
    }
  }
});

app.get('/home', function (req, res) {
  if (req.session.acc == null) {
    req.flash('message', 'login please');
    res.redirect('/');
  }
  else
    res.render('home');
});

app.get('/fiction', function (req, res) {
  if (req.session.acc == null) {
    req.flash('message', 'login please');
    res.redirect('/');
  }
  else
    res.render('fiction')
});

app.get('/novel', function (req, res) {
  if (req.session.acc == null) {
    req.flash('message', 'login please');
    res.redirect('/');
  }
  else
    res.render('novel')
});

app.get('/poetry', function (req, res) {
  if (req.session.acc == null) {
    req.flash('message', 'login please');
    res.redirect('/');
  }
  else
    res.render('poetry')
});


if (process.env.PORT) {
  app.listen(process.env.PORT, function () { console.log('Server started') })
}
else {
  app.listen(3000, function () { console.log('Server started on port 3000') })
}




