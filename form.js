const ojp = require("ojparty");
const http = require("http");

const form = ojp.ojparty.forms;


const serve = http.createServer((req,res)=>{
   if(req.method =="POST"){
   form(req,(data)=>{
   res.setHeader('Content-Type','text/plain');
   res.statusCode = 200;
   res.write(Buffer.from(JSON.stringify(data)));
   //sample respose 
   // {"body":{"fullname":"Samuel","username":"ojParty","email":"samuel@ojparty.com","password":"123456"},"files":{},"query":{},"url":"/"}
   res.end();
   });
   }
   if(req.method =="GET"){
 const fs = require('fs');
 try {
   const data = fs.readFileSync('form.html');
   res.setHeader('Content-Type','text/html');
   res.statusCode = 200;
   res.write(Buffer.from(data));
   res.end();
 }catch(e){
   res.setHeader('Content-Type','text/html');
   res.statusCode = 200;
   res.write(Buffer.from(e.toString()));
   res.end();
   throw e;
 }
   }
});

serve.listen(302)