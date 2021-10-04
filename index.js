const express = require("express");
const app = express();
const mysql = require('mysql');
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
const disconnect_handler = require('./disconnection')// 資料庫斷線的處理器
const port = process.env.PORT || 3001

app.use(express.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Accept');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
})

/*app.use(cors({
  origin: 'http://localhost:3000',
  methods: ["GET", "POST"],
  credentials: true
}))*/

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('trust proxy', 1);
app.use(
  session({
    key: "userId",
    secret: "cat",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      secure: true,
      expires: 60 * 60 * 24// 24hours
    }
  })
)

// 原本的連線方式
const db = mysql.createConnection({
  host: '166.62.28.131',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'mtr04group1'
})


app.get('/', (req, res) => {
  res.send('Login system server side BY nodejs express')
})

app.post('/register', (req, res, next) => {
  //拿前端資料
  const username = req.body.username
  const password = req.body.password
  // SQL query
  db.query("INSERT INTO tanya33_users (username, password) VALUES (?, ?)", 
  [username, password], 
  (err, result) => {
    if (err) {
      console.log('hi');
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        // db error 重新連線
        disconnect_handler();
      } else {
          throw err;
      }      
      res.send({err: err})
    }
    if (result) {
      res.send(result)
    }
  })
})

app.get('/logout', (req, res, next) => {
    req.session.user = null
    res.send({ loggedIn: false})
})

app.get('/login', (req, res, next) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user})
  } else {
    res.send({ loggedIn: false})
  }
})

app.post('/login', (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  // SQL query
  db.query("SELECT *  FROM tanya33_users WHERE username =? AND password = ?", 
  [username, password], 
  (err, result) => {
    if (err) {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('hi');
        // db error 重新連線
        disconnect_handler();
      } else {
          throw err;
      }
      res.send({err: err})
    }
    if (result. length > 0) {
      req.session.user = result//存session
      res.send(result)
    } else {
      res.send({ message: "帳號或密碼錯誤"})
    }
  })
})

app.get('/users', (req, res, next) => {
  db.query("SELECT * FROM tanya33_users", (err, result) => {
    if (err) {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('hi');
        // db error 重新連線
        disconnect_handler();
      } else {
          throw err;
      }      
      res.send(err)
    }
    if (result) {
      console.log(result);
      res.send(result);
    }
  })
})

app.get('/posts', (req, res, next) => {
  db.query("SELECT * FROM tanya33_stock_posts", (err, result) => {
    if (err) {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        // db error 重新連線
        disconnect_handler();
      } else {
          throw err;
      }
      console.log(err);
      res.send(err)
    }
    if (result) {
      console.log(result);
      res.send(result);
    }
  })
})

app.post('/create-post', (req, res, next) => {
  // 前端送過來的資料
  const title = req.body.inputTitle
  const body = req.body.inputBody

  db.query("INSERT INTO tanya33_stock_posts (title, body) VALUES (?, ?)", 
  [title, body], 
  (err, result) => {
    if (err) {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        // db error 重新連線
        disconnect_handler();
      } else {
          throw err;
      }
      res.send({err: err})
    }
    if (result) {
      res.send(result)
    }
  })
})

// 個人頁面
// SELECT tanya33_stock_fav.stock_code FROM `tanya33_stock_fav` WHERE username = "tanya"
app.get('/my-fav', (req, res, next) => {
  console.log(req.session.user[0].username);
  const usernameFav = req.session.user[0].username
  db.query(" SELECT tanya33_stock_fav.stock_code FROM tanya33_stock_fav WHERE username = ? ", 
  usernameFav, 
  (err, result) => {
    if (err) {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        // db error 重新連線
        disconnect_handler();
      } else {
          throw err;
      }
      res.send({err: err})
    }
    if (result) {
      res.send(result)
    }
  })

})
app.listen(port, () => {
  console.log(`running on port${port}`);
})

// createPool的連線方式有成功
/*const db = mysql.createPool({
  host: '166.62.28.131',
  user: 'mtr04group1',
  password: 'Lidemymtr04group1',
  database: 'mtr04group1'
})

app.get("/", (req, res) => {
  const sqlInsert = "INSERT INTO tanya33_users (username) VALUES ('nodejs test');"
  db.query(sqlInsert, (err, result) => {
    console.log(result);
    console.log(err);
    res.send("hello world")
  })
})*/