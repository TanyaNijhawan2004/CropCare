const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');

app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const mongoURI = 'mongodb://127.0.0.1:27017/yantra';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB Connected');
});

const UserModel = require('./models/user');

const store = new MongoDBStore({
  uri: mongoURI,
  collection: 'mysessions',
});

app.use(session({
  secret: 'Key assigned',
  resave: false,
  saveUninitialized: false,
  store: store,
}));

const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect('/login');
  }
};

app.get('/login', function(req, res) {
  if (req.session.isAuth) {
    res.redirect('/main');
  } else {
    res.sendFile(path.join(__dirname, 'public/login.html'));
  }
});

app.post('/login', async function(req, res) {
  const mobileNumber = req.body.mn;
  const password = req.body.pass;

  try {
    let user = await UserModel.findOne({ MobileNumber: mobileNumber });

    if (!user) {
      return res.redirect('/login');
    }

    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.redirect('.');
    }

    req.session.name = user.Name;
    req.session.isAuth = true;
    res.redirect('/scan');
  } catch (error) {
    console.error('Error during login:', error);
    res.redirect('/login');
  }
});

app.get('/register', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/register.html'));
});

app.post('/register', async function(req, res) {
  const name = req.body.name;
  const mobileNumber = req.body.mn;
  const password = req.body.pass;

  try {
    let user = await UserModel.findOne({ MobileNumber: mobileNumber });

    if (user) {
      return res.redirect('/login');
    }

    const hashedPsw = await bcrypt.hash(password, 14);

    user = new UserModel({
      Name: name,
      MobileNumber: mobileNumber,
      Password: hashedPsw,
    });

    console.log('Saved!');

    await user.save();
    res.redirect('/login');
  } catch (error) {
    console.error('Error during registration:', error);
    res.redirect('/login');
  }
});

app.get('/disease-prediction', function(req, res) {
  res.render('disease-prediction');
});

app.get('/crop-prediction', function(req, res) {
  res.render('crop-prediction');
});

app.get('/home', function(req, res) {
  res.render('home');
});

// app.get('/scan', isAuth, async function(req, res) {
//   let prod = await ProdModel.find({});
//   res.render('scan',{name:req.session.name, data:prod});
// });

// app.get('/logout', (req, res) => {
//   req.session.destroy((err) => {
//     if (err) throw err;
//     res.redirect('/');
//   });
// });

app.listen(5000, () => {
  console.log('Listening to the server on http://localhost:5000');
});














// const express = require('express');
// const path = require('path');
// const session = require('express-session');
// const bcrypt = require('bcryptjs');
// const MongoDBStore = require('connect-mongodb-session')(session);
// const app = express();
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');

// app.set('views', path.join(__dirname, '/public'));

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('public'));
// app.set("view engine", 'ejs');
// app.use(express.static('public'));

// const mongoURI = 'mongodb://127.0.0.1:27017/prostech';
// mongoose.connect(mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log("MongoDB Connected");
// });

// const UserModel = require('./models/user');

// const store = new MongoDBStore({
//   uri: mongoURI,
//   collection: "mysessions",
// });



// app.use(session({
//   secret: "Key assigned",
//   resave: false,
//   saveUninitialized: false,
//   store: store,
// }));



// const isAuth = (req, res, next) => {
//   if (req.session.isAuth) {
//     next();
//   } else {
//     res.redirect('/login');
//   }
// };





// app.get("/login", function(req, res) {
//   if (req.session.isAuth) {
//     res.redirect('/main');
//   } else {
//     res.render('login');
//   }

// });




// app.post("/login", async function(req, res) {

//   const mobileNumber = req.body.mn;
//   const password  = req.body.pass;

//   let user = await UserModel.findOne({ MobileNumber: mobileNumber });

//   if (!user) {
//     return res.redirect('/login');
//   }

//   const isMatch = await bcrypt.compare(password, user.Password);
//   if (!isMatch) {
//     return res.redirect('.');
//   }
//   req.session.name = user.Name;
//   req.session.isAuth = true;
//   res.redirect('/scan');
// });




// app.get("/register", function(req, res) {
//   res.sendFile(path.join(__dirname, 'public/register.html'));
// });


// app.get("/login", function(req, res) {
//   res.sendFile(path.join(__dirname, 'public/login.html'));
// });

// app.get("/disease-prediction", function(req, res) {
//   res.render('disease-prediction');
// });

// app.get("/crop-prediction", function(req, res) {
//   res.render('crop-prediction');
// });
// app.get("/home", function(req, res) {
//   res.render('home');
// });



// app.post("/register", async function(req, res) {
//   const name = req.body.name;
//   const mobileNumber = req.body.mn;
//   const password = req.body.pass;

//   let user = await UserModel.findOne({ MobileNumber: mobileNumber });

//   if (user) {
//     return res.redirect('/login');
//   }

//   const hashedPsw = await bcrypt.hash(password, 14);

//   user = new UserModel({
//     Name: name,
//     MobileNumber:mobileNumber,
//     Password: hashedPsw,
//   });

//   console.log("Saved!");

//   await user.save();
//   res.redirect('/login');
// });





// // app.get("/scan", isAuth, async function(req, res) {
// //   let prod = await ProdModel.find({});
// //   res.render('scan',{name:req.session.name, data:prod});
// // });




// // app.get('/logout', (req, res) => {
// //   req.session.destroy((err) => {
// //     if (err) throw err;
// //     res.redirect("/");
// //   });
// // });


 


// app.listen(5000, () => {
//   console.log("Listening to the server on http://localhost:5000");
// });



