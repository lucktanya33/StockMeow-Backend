const express = require("express");
const app = express();
const mysql = require('mysql');
const cors = require("cors");
const db = require('./conn')//資料庫連線

app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
  db.connect()
  res.send('Login system server side BY nodejs express')
})

app.post('/register', (req, res) => {
  // 前端送過來的資料
  const username = req.body.username
  const password = req.body.password

  db.query("INSERT INTO tanya33_users (username, password) VALUES (?, ?)", 
  [username, password], 
  (err, result) => {
    if (err) {
      res.send({err: err})
    }
    if (result) {
      res.send(result)
    }
  })
})

app.post('/login', (req, res) => {
  const username = req.body.username
  const password = req.body.password

  db.query("SELECT *  FROM tanya33_users WHERE username =? AND password = ?", 
  [username, password], 
  (err, result) => {
    if (err) {
      res.send({err: err})
    }
    if (result. length > 0) {
      res.send(result)
    } else {
      res.send({ message: "帳號或密碼錯誤"})
    }
  })
})

app.listen(3001, () => {
  console.log("running on port 3001");
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