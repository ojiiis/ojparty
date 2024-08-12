const ojp = require("ojparty");
const http = require("http");

const form = ojp.ojparty.forms;
const utill = ojp.ojparty.utill;

const serve = http.createServer((req,res)=>{
   if(req.method =="POST"){
   form(req,(data)=>{
   res.setHeader('Content-Type','text/plain');
   res.statusCode = 200;
   for(let i = 0; i < data.files.length; i++){
    utill.writeFile(`uploads/${data.files[i].fileName}`,data.files[i].file.data);
    res.write(`${data.files[i].fileName} has been written to /uploads/${data.files[i].fileName}. `);
   }
   res.end();
   //sample respose 
   // {"body":{"fullname":"Samuel"},"files":[{"size":28,"file":{"type":"Buffer","data":[79,106,112,97,114,116,121,32,102,105,108,101,32,117,112,108,111,97,100,32,115,97,109,112,108,101,13,10]},"fileName":"sample two.txt","contentType":"text/plain"},{"size":28,"file":{"type":"Buffer","data":[79,106,112,97,114,116,121,32,102,105,108,101,32,117,112,108,111,97,100,32,115,97,109,112,108,101,13,10]},"fileName":"sample.txt","contentType":"text/plain"}],"query":{},"url":"/"}
  
   });
   }
   if(req.method =="GET"){
 const fs = require('fs');
 try {
   const data = fs.readFileSync('uploadform.html');
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

serve.listen(303)