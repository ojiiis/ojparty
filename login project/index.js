const ojp = require("ojparty");
const mysql = require("mysql");
const app = ojp.ojparty.app();
const utill = ojp.ojparty.utill;
const con = mysql.createConnection({
    host:"localhost",
    user:'root',
    password:'',
    database:'ojp'
});
con.connect(e=>{
    if(e) throw e;
});
app.get("/",(req,res)=>{
    if(req.session.hasOwnProperty('userId')){
       
        con.query('SELECT * FROM users WHERE userId = "'+req.session.userId+'" ',(err,data)=>{
            if(err) throw err;
            var username = data[0].username;
            res.ojp('home.html',{username});
            res.end();
        })
       
    }else{
        res.setHeader('location','/login');
        res.statusCode = 302; 
        res.end();
    } 
 });
app.get("/login",(req,res)=>{
    res.ojp('login.html');
    res.end();
 });

app.get("/register",(req,res)=>{
    res.ojp('register.html');
    res.end();
});
app.get("/logout",(req,res)=>{
req.unsetSession('userId');
res.setHeader('location','/');
res.statusCode = 302; 
res.end();
});

app.post("/login",(req,res)=>{
    const {username,password}  = req.body;
    con.query('SELECT * FROM users WHERE username="'+username+'" && password="'+password+'" || email="'+username+'" && password="'+password+'"',(err,data)=>{
if(data.length == 0){
    res.setHeader('Content-Type','text/json');
    res.statusCode = 200;
    res.write(`{"status":0}`)
}
else {
    res.setHeader('Content-Type','text/json');
    req.setSession('userId',data[0].userId);
    res.statusCode = 200;
    res.write(`{"status":1}`)
}
res.end();
    })
});

app.post("/register",(req,res)=>{
    const {fullname,username,email,password}  = req.body;
    const userId = utill.random('mix',24);
    con.query("INSERT INTO `users`(`userId`,`fullname`, `username`, `email`, `password`) values(?,?,?,?,?)",[userId,fullname,username,email,password],(err)=>{
if(err) throw err;
req.setSession('userId',userId);
res.write('user registered successfully!');
res.end();
    });

    
});



app.listen(304);