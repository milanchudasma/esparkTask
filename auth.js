const jwt = require('jsonwebtoken');
const path = require('path');

require('dotenv').config()


var mysql = require('mysql2');
const body = require('body-parser');
var express = require('express');
var app = express();
app.set('view engine', 'ejs');
app.use(body.urlencoded({ extended: false }));
let cookieParser = require('cookie-parser');

const excelcrud = require('./excelcrud.js');
app.use('/',excelcrud)

const ajax = require('./ajax_pagination.js');
app.use('/',ajax)

app.use(cookieParser());
app.use(express.static(path.join(__dirname,"/public")));
    
const bcrypt = require("bcryptjs");

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'authentication'
});


con.connect(function (err) {
    if (err) throw err;
    console.log('connected!')
})


app.get("/", async (req, res) => {

    let jwttoken = req.cookies.token;
    // let tokendata = jwt.verify(jwttoken, "milan");

    if (!jwttoken) {
        res.render("register");
    } else {
        res.redirect("/home");

    }

})  
app.get("/kukucube",(req,res)=>{
    res.render("kukucube");
})
app.get("/tictactoe",(req,res)=>{
   
    res.render("tic_tac_toe");
})
app.get("/form1",(req,res)=>{
   
    res.render("form1");
})
app.get("/form2",(req,res)=>{
   
    res.render("form2");
})
app.get("/oldPassChecker",async(req,res)=>{
    console.log("oldPasschecker is called")
    let email = req.query.email ;
    let psw = req.query.psw ;
    console.log(email)
    console.log(psw)

    sql1 = `SELECT hash_psw FROM authentication.register_table where email = '${email}';`
    let data1 = await getdata(sql1);

    console.log(data1[0].hash_psw);

    async function compare(psw, data1) {
        return await new Promise((res, rej) => {
            bcrypt.compare(psw, data1, function (err, data) {
                res(data); 
            });
        })
    }

    let temp = await compare(psw, data1[0].hash_psw);
    console.log("passwordchecking", temp);

    if(temp){
        res.json({exits :true});
    }else{
        res.json({exits : false});
    }


})

app.get("/email", async (req, res) => {
    let email = req.query.email;


    console.log(email);

    sql1 = `SELECT email FROM authentication.register_table where email = '${email}';`
    let data1 = await getdata(sql1);

    let verifyemail = 1;

    if (data1 == "") {
        console.log("email not exists");
        verifyemail = 0;

        res.json({ email: false })


    } else {
        console.log("email exits")
        verifyemail = 1;

        res.json({ email: true });
        console.log("data1", data1)

    }

    console.log("verifyemail", verifyemail);


})
app.get("/user", async (req, res) => {

    let user = req.query.user;
    console.log(user);
    sql2 = `SELECT user FROM authentication.register_table where user = '${user}';`
    let data2 = await getdata(sql2);

    let verifyuser = 1;
    if (data2 == "") {
        console.log("user not exists");

        verifyuser = 0;
        res.json({ user: false })


    } else {
        console.log("email exits so you first login now")
        verifyuser = 1;
        res.json({ user: true });
        console.log("data2", data2)
    }
    console.log("verifyuser", verifyuser);

})
app.get("/password", async (req, res) => {

    let password = req.query.psw;
    let email = req.query.email



    console.log(password);
    console.log(email);

    sql2 = `SELECT hash_psw FROM authentication.register_table where email = '${email}';`
    let data2 = await getdata(sql2);
    console.log(data2[0].hash_psw);

    async function compare(psw, data1) {
        return await new Promise((res, rej) => {
            bcrypt.compare(psw, data1, function (err, data) {
                res(data); 
            });
        })
    }

    let temp = await compare(password, data2[0].hash_psw);
    console.log("passwordchecking", temp);


    let verifyuser = 0;
    if (temp) {
        console.log("password matched");
        verifyuser = 1;
        res.json({ password: true })


    } else {
        console.log("passowrd exits so you first login now")
        verifyuser = 0;
        res.json({ password: false });
        console.log("data2", data2)


    }
    console.log("verifyuser", verifyuser);

})
app.post("/register", async (req, res) => {


    console.log("req.body", req.body);

    let name = req.body.name;
    let email = req.body.email
    let phone = req.body.phone;
    let user = req.body.user;
    let psw = req.body.psw
    let cpass = req.body.cpass

    sql1 = `SELECT email FROM authentication.register_table where email = '${email}';`
    let data1 = await getdata(sql1);

    sql2 = `SELECT user FROM authentication.register_table where user = '${user}';`
    let data2 = await getdata(sql2);

    let verifyemail = 1;
    let verifyuser = 1;
    if (data1 == "" && data2 == "") {
        console.log("email and user not exists");
        verifyemail = 0;
        verifyuser = 0;


    } else {
        console.log("email exits so you first login now")
        verifyemail = 1;
        verifyuser = 1;
        res.redirect("/login")
        // res.send({email : data1 , user : data2}) ;
    }
    console.log(verifyemail);
    console.log(verifyuser);

    async function hashdata(psw) {
        return await new Promise((res, rej) => {
            bcrypt.hash(psw, 10, function (err, hash) {
                res(hash);
            });
        })
    }

    let hash1 = await hashdata(psw);
    console.log(hash1);

    let str = "abcdefghijklmnopqrstuvwxyz";
    let ran_str = "";


    for (let i = 1; i <= 5; i++) {
        let random = Math.floor(Math.random() * (26 - 1) + 1);
        console.log(random);
        ran_str += str.charAt(random)
    }

    if (verifyemail == 0 || verifyuser == 0) {
        sql2 = `INSERT INTO authentication.register_table (name, email,user,hash_psw, password,phone_no,isActive,ranstr) VALUES ('${name}', '${email}', '${user}','${hash1}','${psw}',${phone},'0','${ran_str}');`;
        let data2 = await getdata(sql2);
        console.log(data2);

        res.send(`<a href="/active?str=${ran_str}">active your link</a>`);


    }
})

app.get("/active?", async (req, res) => {
    // let email = req.params.email;
    let str = req.query.str;
    console.log(str);

    sql1 = `update authentication.register_table set isActive = '1' where ranStr = "${str}" ;`;
    let data1 = await getdata(sql1);
    console.log(data1)

    sql2 = `SELECT isActive FROM authentication.register_table where ranStr = '${str}';`;
    let data2 = await getdata(sql2);
    console.log(data2)
    if (data2[0].isActive == 1) {
        res.redirect("/login");
    }
    else {
        res.send("your account is not activate");
    }




    // res.render("isActive", { ran_str, email })
})


app.get("/login", async (req, res) => {

    let jwttoken = req.cookies.token;
    let tokendata = jwt.verify(jwttoken, "milan");

    if (!jwttoken) {
        res.render("login");
    } else {
        res.redirect("/home");

    }
    // res.render("login");
})

app.post("/login", async (req, res) => {

    let email = req.body.email;
    let psw = req.body.psw;

    sql1 = `SELECT hash_psw FROM authentication.register_table where email = '${email}';`;
    let data1 = await getdata(sql1);

    sql2 = `SELECT id,name,phone_no FROM authentication.register_table where email = '${email}';`;
    let data2 = await getdata(sql2);
    let name = data2[0].name;
    let id = data2[0].id;
    let phone = data2[0].phone_no;
    console.log("name", name)
    console.log("phone", phone)


    console.log(data1[0].hash_psw)
    // console.log("this is data 1")


    async function compare(psw, data1) {
        return await new Promise((res, rej) => {
            bcrypt.compare(psw, data1, function (err, data) {
                res(data);
            });
        })
    }
    let payload = {
        id: id,
        name: name,
        email: email,
        password: psw,
        phone: phone
    }

    let temp = await compare(psw, data1[0].hash_psw);
    console.log("passwordchecking", temp);
    if (temp) {

        console.log({ payload });

        let token = jwt.sign(payload, "milan");
        console.log("token", token);

        res.cookie("token", token);
        res.redirect("/home");

    } else {
        res.send(`you password is wrong so try agian <a href="/login">login</a>`)
        // res.redirect("/login");
    }


})

app.get("/home", (req, res) => {

    let jwttoken = req.cookies.token;
    console.log("jwttoken", jwttoken);


    let tokendata = jwt.verify(jwttoken, "milan");
    console.log("tokendata", tokendata);


    if (!jwttoken) {
        console.log("token is not here")
        res.redirect("/");
    } else {
        console.log("token is here")
        res.render("home", { tokendata });
    }


})
app.get("/logout", (req, res) => {
    res.clearCookie("token");

    res.redirect("/");
})

app.get("/edit", (req, res) => {

    let jwttoken = req.cookies.token;
    let tokendata = jwt.verify(jwttoken, "milan");

    if (!jwttoken) {
        res.send(`please first login <a href="/login>login</a> or register <a href="/register>register</a>"`)

    } else {
        res.render("profile", { tokendata });

    }

})
app.get("/forgetPass", (req, res) => {

    let jwttoken = req.cookies.token;
    let tokendata = jwt.verify(jwttoken, "milan");

    if (!jwttoken) {
        res.send(`please first login <a href="/login>login</a> or register <a href="/register>register</a>"`)

    } else {
        res.render("password", { tokendata });

    }

})

app.post("/edit", async (req, res) => {
    let jwttoken = req.cookies.token;

    if (!jwttoken) {
        res.send("please first login")
    } else {

        let tokendata = jwt.verify(jwttoken, "milan");
        console.log(tokendata.id);
        id = tokendata.id;
        console.log(req.body)
        let name = req.body.name
        let email = req.body.email
        let phone = req.body.phone
        let psw = req.body.psw
        let cpass = req.body.cpass ;
        let newpsw = req.body.newpsw ;

        async function hashdata(psw) {
            return await new Promise((res, rej) => {
                bcrypt.hash(psw, 10, function (err, hash) {
                    res(hash);
                });
            })
        }
        let hash1 = await hashdata(cpass);

        sql1 = `update authentication.register_table set name='${name}',email='${email}',phone_no='${phone}' where id= '${id}'`;
        let data1 = await getdata(sql1);

        res.send(`profile update successfully`);
        

        
        


    }
})

app.post("/forgetPass",async(req,res)=>{
    let jwttoken = req.cookies.token;

    if (!jwttoken) {
        res.send("please first login")
    } else {
        console.log("this is running")
        let email = req.body.email;
            let psw = req.body.psw;
        let newpsw = req.body.newpsw;

        async function hashdata(psw) {
            return await new Promise((res, rej) => {
                bcrypt.hash(psw, 10, function (err, hash) {
                    res(hash);
                });
            })
        }
    
        let hash1 = await hashdata(newpsw);
        console.log(hash1);

        sql1 = `update authentication.register_table set hash_psw = '${hash1}',password = '${newpsw}' where email = '${email}';`
        let data1 = await getdata(sql1);

        res.send(`password updated successfully`)

    }
})


async function getdata(sql) {
    return await new Promise((res, rej) => {
        con.query(sql, (err, data) => {
            if (err) throw err;
            res(data);
        })
    })
}
let port = process.env.PORT ;
app.listen(port, () => {
    console.log(`port is active ${port}`);
})
