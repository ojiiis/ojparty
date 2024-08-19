# OJParty

OJParty is a lightweight, yet powerful Node.js framework that extends the capabilities of the default HTTP module. It offers features similar to Express.js while adding native support for session management, file upload handling, and utility functions. This framework is designed to provide a more integrated and developer-friendly experience out of the box.

### The Dynamic, Versatile, and Developer-Friendly Web Framework for Node.js

**OJParty** is a powerful, flexible, and unopinionated Node.js framework, designed to give developers the freedom to build applications their way.

## 📚 Documentation and Release Updates

Stay updated with OJParty's ever-evolving [API documentation](#) and keep an eye on our [release history](#) for the latest features and improvements.

## 🌐 Web Applications

OJParty is engineered for developers who need more than just the basics. Whether you're working on web or mobile applications, OJParty provides a comprehensive set of tools to streamline your development process, including session management, dynamic templating, and more.

## 🔌 APIs

Building APIs is straightforward with OJParty. Utilize our extensive HTTP utility functions and customizable middleware to create powerful, scalable APIs with ease.

## 🚀 Performance

OJParty is designed to be lightweight, delivering essential web application features while preserving the raw power and flexibility of Node.js. The framework ensures that you can leverage the full capabilities of Node.js without any unnecessary overhead.

## 🔧 Middleware

OJParty offers a flexible routing system with minimal core features, allowing you to easily extend its functionality. With support for file uploads, session management, and MySQL database integration, OJParty is adaptable to your specific needs without imposing rigid constraints.

---

Explore the full potential of OJParty by [getting started](#) with your next Node.js project today!


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

## API Reference

### `ojparty.utill`

The `utill` object provides various utility functions:

- **`parseCookie(data)`**: Parses a cookie string into an object.
- **`random(type, length)`**: Generates a random string. Type can be `"let"` for letters, `"num"` for numbers, or `"mix"` for alphanumeric characters. Length specifies the string length.
- **`range(min, max)`**: Generates a random number between `min` and `max`.

### `ojparty.forms(req, callback)`

Parses the incoming request to extract files, query parameters, and form data. The extracted data is provided to the callback function.

### `ojparty.app()`

Creates a server application with various HTTP methods:

- **`get(path, callback)`**
- **`post(path, callback)`**
- **`options(path, callback)`**
- **`delete(path, callback)`**

### Request Object Methods

- **`req.setSession(key, value)`**: Sets a session variable.
- **`req.session`**: Accesses all active sessions.
- **`req.unsetSession(key)`**: Removes a session variable.
- **`req.files`**: Accesses all uploaded files.
- **`req.body`**: Accesses form data from a POST request.
- **`req.query`**: Accesses URL parameters.
- **`req.url`**: Returns the URL without query parameters.

### Response Object Methods

- **`res.ojp(filePath, data)`**: Writes a response based on an OJP template.
- **`res.sendFile(filePath)`**: Serves a static file.
- **`res.send(data)`**: Sends a response with the specified data.

### Middleware

- **`use(callback)`**: Adds middleware to be executed before the app initializes.
- **`listen(port, callback)`**: Starts the server on the specified port.

## Contributing

If you would like to contribute to OJParty, please fork the repository and submit a pull request.

## License

OJParty is licensed under the MIT License.
