# OJParty

OJParty is a lightweight, yet powerful Node.js framework that extends the capabilities of the default HTTP module. It offers features similar to Express.js while adding native support for session management, file upload handling, and utility functions. This framework is designed to provide a more integrated and developer-friendly experience out of the box.

## Features

- **Session Management**: Seamlessly manage user sessions across your application.
- **File Upload Handling**: Simplified file uploads with built-in parsing and access to uploaded files.
- **Express-Like API**: Familiar syntax and functionality for those who have used Express.js.
- **Utility Functions**: Built-in utility methods for common tasks like cookie parsing and random value generation.

## Installation

To install OJParty, use npm:

```bash
npm install ojparty
```

## Basic Usage
Here’s how to create a simple server with OJParty, featuring session management, file upload capabilities, and more.

### Example 1: Handling Sessions and File Uploads

```javascript
const ojp = require("ojparty");
const app = ojp.ojparty.app();

app.get("/", (req, res) => {
  req.setSession('username', req.query.name);
  res.sendFile('index.html');
});

app.get("/profile", (req, res) => {
  res.send(`Welcome to your profile page, ${req.session.username}`);
});

app.post("/uploadfile", (req, res) => {
  res.send(JSON.stringify(req.files));
});

app.post("/unset-session", (req, res) => {
  req.unsetSession('username');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send('Your session has been unset');
});

app.listen(210, () => {
  console.log('Server is running on port 210');
});
```

### Example 2: Parsing Forms and Handling File Uploads

```javascript
const ojp = require("ojparty");
const http = require("http");
const form = ojp.ojparty.forms;

const serve = http.createServer((req, res) => {
  if (req.method == "POST") {
    form(req, (data) => {
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 200;
      res.write(Buffer.from(JSON.stringify(data)));
      res.end();
    });
  }
  if (req.method == "GET") {
    const fs = require('fs');
    try {
      const data = fs.readFileSync('form.html');
      res.setHeader('Content-Type', 'text/html');
      res.statusCode = 200;
      res.write(Buffer.from(data));
      res.end();
    } catch (e) {
      res.setHeader('Content-Type', 'text/html');
      res.statusCode = 500;
      res.write(Buffer.from(e.toString()));
      res.end();
    }
  }
});

serve.listen(302, () => {
  console.log('Server is running on port 302');
});

```

### Example 3: File Upload with Utilities

```javascript
const ojp = require("ojparty");
const http = require("http");
const form = ojp.ojparty.forms;
const util = ojp.ojparty.util;

const serve = http.createServer((req, res) => {
  if (req.method == "POST") {
    form(req, (data) => {
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 200;
      for (let i = 0; i < data.files.length; i++) {
        util.writeFile(`uploads/${data.files[i].fileName}`, data.files[i].file.data);
        res.write(`${data.files[i].fileName} has been written to /uploads/${data.files[i].fileName}. `);
      }
      res.end();
    });
  }
  if (req.method == "GET") {
    const fs = require('fs');
    try {
      const data = fs.readFileSync('uploadform.html');
      res.setHeader('Content-Type', 'text/html');
      res.statusCode = 200;
      res.write(Buffer.from(data));
      res.end();
    } catch (e) {
      res.setHeader('Content-Type', 'text/html');
      res.statusCode = 500;
      res.write(Buffer.from(e.toString()));
      res.end();
    }
  }
});

serve.listen(303, () => {
  console.log('Server is running on port 303');
});

```

### Example 4: Integrating with MySQL
```javascript
const ojp = require("ojparty");
const mysql = require("mysql");
const app = ojp.ojparty.app();
const util = ojp.ojparty.util;
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ojp"
});

con.connect(err => {
    if (err) throw err;
});

app.get("/", (req, res) => {
    if (req.session.hasOwnProperty('userId')) {
        con.query('SELECT * FROM users WHERE userId = ?', [req.session.userId], (err, data) => {
            if (err) throw err;
            var username = data[0].username;
            res.ojp('home.html', { username });
            res.end();
        });
    } else {
        res.setHeader('Location', '/login');
        res.statusCode = 302;
        res.end();
    }
});

app.get("/login", (req, res) => {
    res.ojp('login.html');
    res.end();
});

app.get("/register", (req, res) => {
    res.ojp('register.html');
    res.end();
});

app.get("/logout", (req, res) => {
    req.unsetSession('userId');
    res.setHeader('Location', '/');
    res.statusCode = 302;
    res.end();
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    con.query('SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?', [username, username, password], (err, data) => {
        if (err) throw err;
        if (data.length === 0) {
            res.status(200).json({ status: 0 });
        } else {
            req.setSession('userId', data[0].userId);
            res.status(200).json({ status: 1 });
        }
    });
});

app.post("/register", (req, res) => {
    const { fullname, username, email, password } = req.body;
    const userId = util.random('mix', 24);
    con.query("INSERT INTO users (userId, fullname, username, email, password) VALUES (?, ?, ?, ?, ?)", [userId, fullname, username, email, password], (err) => {
        if (err) throw err;
        req.setSession('userId', userId);
        res.send('User registered successfully!');
        res.end();
    });
});

app.listen(304, () => {
  console.log('Server is running on port 304');
});

```

