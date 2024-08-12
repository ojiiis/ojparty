const ojp = require("./index.js")
const app = ojp.ojparty.app()


app.get("/",(req,res)=>{
    //record a session
  req.setSession('name',req.query.name);
  
  //serve a file
 res.sendFile('index.html'); 
});
app.get("/home",(req,res)=>{
     res.send(`Welcome back ${req.session.name}`); 
 });

app.post("/test",(req,res)=>{
  //remove a session
  req.unsetSession('name');
  res.setHeader('Access-Control-Allow-Origin','*')
  res.send(`
    ${JSON.stringify(req.body.fullname)}
    ===================
    ${JSON.stringify(req.files)}

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
    `);
   res.end()
});
app.listen(200)
