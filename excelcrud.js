var mysql = require('mysql2');
const body = require('body-parser');
var express = require('express');
var app = express();
app.set('view engine', 'ejs');
app.use(body.urlencoded({ extended: false }))




const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'student_data'
});
con.connect(function (err) {
    if (err) throw err;
    console.log('connected!')
})

app.get("/view",async (req, res) => {
    sql1 = `SELECT * FROM student_data.excel_table;`;
    let result1 = await getdata(sql1);
    res.render("excelcrud", { result1 });
})


app.post("/editexcl", (req, res) => {
    // let fname = req.body.fname;
    // let lanme = req.body.lanme;
    // let email = req.body.email;
    // let mobile = req.body.mobile;
    // let city = req.body.city;
    // let aadhar = req.body.aadhar;

    // console.log(req.body)
    // res.send("this is working also");
})

app.get('/save', async (req, res) => {
    console.log("save api is working")
    let fname = req.query.fname;
    let lname = req.query.lname;
    let city = req.query.city;
    let aadhar = req.query.aadhar;
    let mobile = req.query.mobile;
    let email = req.query.email;

    // console.log(fname);
    // console.log(lname);
    // console.log(city);
    // console.log(aadhar);
    // console.log(mobile);
    // console.log(email);

    sql1 = `INSERT INTO student_data.excel_table (fname, lname, email, city, mobile, aadhar) VALUES ('${fname}', '${lname}', '${email}', '${city}', '${mobile}', '${aadhar}');`;
    let data1 = await getdata(sql1);
    // console.log(data1);

})

app.get('/update', async (req, res) => {
    // console.log("update api is working")
    let id = req.query.id;
    let fname = req.query.fname;
    let lname = req.query.lname;
    let city = req.query.city;
    let aadhar = req.query.aadhar;
    let mobile = req.query.mobile;
    let email = req.query.email;
    // console.log(id);
    // console.log(fname);
    // console.log(lname);
    // console.log(city);
    // console.log(aadhar);
    // console.log(mobile);
    // console.log(email);

    sql1 = `UPDATE student_data.excel_table SET fname = '${fname}', lname = '${lname}', email = '${email}', city = '${city}', mobile = '${mobile}', aadhar = '${aadhar}' WHERE (id = '${id}');`;
    let data1 = await getdata(sql1);
})

app.post('/saveall', async (req, res) => {
    // console.log(req.body);
    let id = req.body.id;
    let fname = req.body.fname;
    let lname = req.body.lname;
    let city = req.body.city;
    let aadhar = req.body.aadhar;
    let mobile = req.body.mobile;
    let email = req.body.email;

    // console.log(fname)

    // for (let i = 0; i < fname.length; i++) {
    //     console.log(fname[i])
    //     console.log(lname[i])
    //     console.log(email[i])
    //     console.log(city[i])
    //     console.log(aadhar[i])
    //     console.log(mobile[i]);
    //     console.log(id[i])

    // }

    for(let i=0 ;i<fname.length ;i++){
        if(id[i]== undefined){
            sql1 =  `INSERT INTO student_data.excel_table (fname, lname, email, city, mobile, aadhar) VALUES ('${fname[i]}', '${lname[i]}', '${email[i]}', '${city[i]}', '${mobile[i]}', '${aadhar[i]}');`;
            let data1 = await getdata(sql1);
            console.log(data1);
        }else{

            sql1=  `UPDATE student_data.excel_table SET fname = '${fname[i]}', lname = '${lname[i]}', email = '${email[i]}', city = '${city[i]}', mobile = '${mobile[i]}', aadhar = '${aadhar[i]}' WHERE (id = '${id[i]}');`;
            let data1 = await getdata(sql1);
            console.log(data1);
        }
    }

})
app.get('/deleted',async (req,res)=>{
    console.log("delete is invoke")
         let id = req.query.id;
        sql1 = `DELETE FROM student_data.excel_table WHERE (id = '${id}');`;
        let data1 = await getdata(sql1);
})

async function getdata(sql) {
    return await new Promise((res, rej) => {
        con.query(sql, (err, data) => {
            if (err) throw err;
            res(data);
        })
    })
}
module.exports = app;