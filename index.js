const ojp = require("ojparty");

const app = ojp.ojparty.app();

app.get("/",(req,res)=>{
  //record a session 
  //while there url looks like this localhost?name=value
  //all get params can be accessed through the req.query which is an object
  req.setSession('username',req.query.name);
  res.sendFile('index.html');
  //here we set the a session with a key name username and the value from a get param with key name
});
app.get("/profile",(req,res)=>{
    //all set session can be accessed through req.session which is an object
    res.send(`Welcome to your profile page ${req.session.username}`); 
});

app.post("/uploadfile",(req,res)=>{
    //all uploaded files can be accessed through req.files object
    res.send(`
        ${JSON.stringify(req.files)}
      `)
    /*
  uploaded file sample response 

  {
  "0":{"size":5,
       "file":{"type":"Buffer",
               "data":[116,101,116,13,10]
               },
       "fileName":"exe.txt",
       "contentType":"text/plain"
       },
  "1":{"size":2,
       "file":{"type":"Buffer",
               "data":[13,10]},
        "fileName":"sample.txt",
        "contentType":"text/plain"
        }
  }
  */
});
app.post("/unset-session",(req,res)=>{
//remove a session
//pass the session key to remove a session
req.unsetSession('name');
res.setHeader('Access-Control-Allow-Origin','*')
res.send('Your session has been unset')

});

app.listen(210);