exports.ojparty = { 
    utill:{
   parseCookie:(data)=>{
     var result = {};
     data.split("; ").forEach(v=>{
       let keyValue = v.split("=");
         result[keyValue[0]] = (keyValue.hasOwnProperty(1))?keyValue[1]:'';
     });
     return result;
   },
   range:(min,max)=>{
    return Math.floor(Math.random() * (max - min +1) ) + min;
   },
   random:(type,length)=>{
     const num =[0,1,2,3,4,5,6,7,8,9];
     const choose = [0,1];
     const alpha = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
     const mix = ["num","letlower","letupper"];
     var result = "";
       switch(type){
         case "num":
     for(let i = 0; i < length; i++){
       result += num[exports.ojparty.utill.range(0,(num.length -1))]
     }
         break;
         case "let":
         case "letter": 
         for(let i = 0; i < length; i++){
         var c = choose[exports.ojparty.utill.range(0,1)];
         if(c)result+=alpha[exports.ojparty.utill.range(0,(alpha.length -1))].toLowerCase()
         else result+=alpha[exports.ojparty.utill.range(0,(alpha.length -1))]
           }
          break;
         case "mix":
           for(let i = 0; i < length; i++){
           var c = mix[exports.ojparty.utill.range(0,2)];
           if(c == "letlower")result+=alpha[exports.ojparty.utill.range(0,(alpha.length -1))].toLowerCase()
           else if(c == "letupper") result+=alpha[exports.ojparty.utill.range(0,(alpha.length -1))]
           else result += num[exports.ojparty.utill.range(0,(num.length -1))]
            }
         break;
         default:
           for(let i = 0; i < length; i++){
             var c = mix[exports.ojparty.utill.range(0,2)];
             if(c == "letlower")result+=alpha[exports.ojparty.utill.range(0,(alpha.length -1))].toLowerCase()
             else if(c == "letupper") result+=alpha[utill.range(0,(alpha.length -1))]
             else result += num[exports.ojparty.utill.range(0,(num.length -1))]
              }
       }
       return result;
   },
   writeFile:(path,data)=>{
     const fs = require('fs');
  const hasPath = (path.split("/").length > 0)?true:false;
  if(hasPath && !fs.existsSync(path.split("/").slice(0,-1).join("/"))){
  throw "path '"+path.split("/").slice(0,-1).join("/")+"' dose not exists."
  }else if(data === undefined){
    data = "undefined"
  }
  fs.writeFile(path, data, (err) => {
   if (err) {
    return  false;
   } else {
      return true;
   }
  });
   }
  },
  forms:(req,cb)=>{
  
  const qs = require("querystring")
  
  const actualUrl = (req.hasOwnProperty('url')  && req.url !== undefined)?req.url.toString().split("?")[0]:''
  const queryString = (req.hasOwnProperty('url') && req.url !== undefined)?req.url.toString().split("?")[1]:{}
  
  query = qs.parse(queryString)
  url = actualUrl
  if(req.method == "POST"){
  var err = false,totalFile = -1;
  let bufferData = Buffer.alloc(0);
  req.on("data",(ch)=>{
  bufferData =   Buffer.concat([bufferData,ch]);
  });
  req.on("end",async ()=>{
  var files = [];
  var body = {};
  var entries = {};
  const rct = req.headers['content-type'];
  if(rct.toString().match(/multipart\/form-data/i)){
   
     const boundry = "--"+req.headers['content-type'].split("=")[1];
    let start = bufferData.indexOf(Buffer.from(boundry))+Buffer.from(boundry).length;
    let end = bufferData.indexOf(Buffer.from(boundry),start);
    while(end !== -1){
    const bufferParts = bufferData.slice(start,end);
     let headerEnd = bufferParts.indexOf(Buffer.from("\r\n\r\n"));
     const header = bufferParts.slice(0,headerEnd);
     const body = bufferParts.slice(headerEnd + 4);
     fileName = header.toString().match(/filename="([^"]+)"/);
    if(fileName){
       files.push({
         size:body.length,
         file:body,
         fileName:fileName[1],
         contentType : header.toString().split("Content-Type: ")[1]
       })
     }else{
       entries[header.toString().match(/name="([^"]+)"/)[1]] = body.toString().trim();
     }
     start = end + Buffer.from(boundry).length;
     end = bufferData.indexOf(Buffer.from(boundry),start);
    }
    body = entries;
  }else if(rct.toString().match(/json/i)){
   body = JSON.parse(bufferData.toString());
  
  }else if(rct.toString().match(/text/i) || req.headers['content-type'].match(/x-www-form-urlencoded/i)){
   const q = require('querystring');
    let queries = q.parse(bufferData.toString());
    body = queries;
  
  }else{
   body = bufferData.toString();
   
  }
  cb({body,files,query,url})
  })
  
  }else{
  cb({query,url})
  }
  
  },
  app:()=>{
  const imp = {
  get:{},
  post:{},
  delete:{},
  options:{},
  put:{},
  session:{},
  use:""
  }
  
  
  function addImp(method,path,addImpCb){
  imp[method][path] = addImpCb
  }
  function setUse(code){
   imp['use'] = code;
  }
  function setSession(key,value,id){
   
   if(key in imp['session'][id]){
     imp['session'][id][key] = value;
   }else{
     imp['session'][id] = {...{[key]:value}}
   
   }
   
  }
  function unsetSession(key,id){
        if(key in imp['session'][id]){
         delete imp['session'][id][key];
        }
  }
  function sendFile(res,url){
    const fs = require("fs")
    fs.readFile(url, function(err, data) {
     if(!err){
       res.statusCode = 200
       res.write(data);
       res.end()
     }else{
       res.end()
     }
   })
     
  }
  
  function ojp(url,verb,res){
  function ojpEx(x){   
  if(x.slice(2,-1) in verb) return verb[x.slice(2,-1)];
  else throw "undefined ojp variable '"+x.slice(2,-1)+"' in "+url;    
  }
  try {
  const fs = require("fs");
  const data = fs.readFileSync(url);
  res.write(data.toString().replaceAll(/\$\[(.*?)\]/g,ojpEx));
  } catch (e) {
  throw e;
  }
  }
  
  
  const run = {
  get:(path,appCb)=>addImp('get',path,appCb),
  post:(path,appCb)=>addImp('post',path,appCb),
  options:(path,appCb)=>addImp('options',path,appCb),
  delete:(path,appCb)=>addImp('delete',path,appCb),
  use:(code)=>setUse(code),
  listen:(port,ip = '127.0.0.1',cb = ()=>0)=>{
   const http = require("http");
  server = http.createServer((req,res)=>{
   
   exports.ojparty.forms(req,function(b){
     const utill = exports.ojparty.utill;
     req.query = b.query
     req.files = b.files
     req.body = b.body
     req.url = b.url
   if(imp.use !== "") imp.use()
    
   res.sendFile = (path) => sendFile(res,path);
  
   if(!req.headers.hasOwnProperty('cookie') || req.headers.hasOwnProperty('cookie') && !utill.parseCookie(req.headers.cookie).hasOwnProperty('OJPSSID')){
     reqId = utill.random("mix",34);
      res.setHeader('Set-Cookie','OJPSSID='+reqId+';HttpOnly;SameSite=Lax');
   }else{
     reqId = utill.parseCookie(req.headers.cookie)['OJPSSID'];
   }
   
  
     if(!imp['session'].hasOwnProperty(reqId)){
       imp['session'][reqId] = {};
     }
   req.setSession = (key,value)=>setSession(key,value,reqId)
   req.unsetSession = (key)=>unsetSession(key,reqId)
   req.moveUploadedFile = (path,data) => utill.writeFile(path,data)
   res.ojp = (path, verb = {})=>ojp(path,verb,res);
  
  const {method,url} = req;
     calls = imp[method.toLocaleLowerCase()][url];
   
     req.session = imp['session'][reqId];
     if(calls){
      
         res.send = (data)=>{
          res.statusCode = 200;
          res.write(Buffer.from(data));
          res.end();
         }
         
         calls(req,res)
         
     }else{
         res.statusCode = 200;
         res.write(`Can not get ${url}`)
         res.end()
     }
  });
  });
  server.listen(port,ip,cb)
  }
  
  };
  return run;
     
  }
  
  
  }
  
  