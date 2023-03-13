var express = require('express');
var mysql = require('mysql2');
var app = express();

app.set("view engine", 'ejs');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'student_data'
});
con.connect(function (err) {
    if (err) throw err;
    console.log('data-base connected!')
});

app.get('/ajaxpage', (req, res) => {
   
    var data = [];
    let count;
    let page = req.query.num || 2 ; // for getting value of offset
    let curpage = parseInt(req.query.num);
    console.log(curpage + "this is curpage req.query.num")
    // for query 
    let limit = 25;
    let offset = (curpage - 1) * limit;
    let ajax = req.query.ajax || 'false';
    console.log(ajax + "ajax is false");


    if (isNaN(offset)) {
        offset = 0;
    }

    let sql1 = `SELECT count(*) as numrows FROM student_data.insertdata`;
    con.query(sql1, (err, result) => {
        if (err) return console.log(err.message);
        // console.log(data);
        data[0] = result[0].numrows; // array of object
        count = Math.ceil(data[0] / limit); //1500/25 >>>> 60 total page count = 60 ;

    })
    let sql2 = `select * from student_data.insertdata limit ${offset},${limit};`
    con.query(sql2, (err, result) => {
        if (err) return console.log(err.message);
        data[1] = result;
        if (ajax == 'false') {
            res.render('ajaxpagination', { data, count, curpage })
            console.log("only if condition executed")
        } 
        else {
            console.log(data + "else condition");
            res.json(data);
        }
        console.log("record showed successfully");


    })
})

app.listen(9000, () => {
    console.log("localhost:9000/ajaxpagination port is connected");
});

module.exports = app;
