const express = require('express');
const path = require('path');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
const mysql = require('mysql'); 
const mysql_conf = require('./conf/db.config')

const hostname = 'localhost';
const port = 8001;

const app = express();



// 静态资源路径
app.use(express.static('public'));
// 指定模板存放目录
app.set('views', 'views');
// 指定模板引擎为 Handlebars
app.set('view engine', 'hbs');

app.use('/', indexRouter);
app.use('/api', apiRouter);

app.use('*', (req, res) => {
  res.status(404).render('404', { url: req.originalUrl });
});


// 返回 500 页面
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('500');
});

app.listen(port, () => {
    // console.log(path)
    console.log(`Server is running at http://${hostname}:${port}`);
});


// 建立数据库链接
const connection = mysql.createConnection(mysql_conf);
connection.connect();

// INSERT INTO 添加到数据库
//增
// const  addSql = 'INSERT INTO websites(Id,name,url,alexa,country) VALUES(0,?,?,?,?)';
// const  addSqlParams = ['菜鸟工具', 'https://c.runoob.com','23453', 'CN'];
// connection.query(addSql,addSqlParams,function (err, result) {
//         if(err){
//          console.log('[INSERT ERROR] - ',err.message);
//          return;
//         }        
 
//        console.log('--------------------------INSERT----------------------------');
//        //console.log('INSERT ID:',result.insertId);        
//        console.log('INSERT ID:',result);        
//        console.log('-----------------------------------------------------------------\n\n');  
// });

//查
const  sql = 'SELECT * FROM websites';
connection.query(sql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
          return;
        }
 
       console.log('--------------------------SELECT----------------------------');
       console.log(result);
       console.log('------------------------------------------------------------\n\n');  
});


//改
// const modSql = 'UPDATE websites SET name = ?,url = ? WHERE Id = ?';
// const modSqlParams = ['菜鸟移动站', 'https://m.runoob.com',6];
// connection.query(modSql,modSqlParams,function (err, result) {
//    if(err){
//          console.log('[UPDATE ERROR] - ',err.message);
//          return;
//    }        
//   console.log('--------------------------UPDATE----------------------------');
//   console.log('UPDATE affectedRows',result.affectedRows);
//   console.log('-----------------------------------------------------------------\n\n');
// });

// //删
// const delSql = 'DELETE FROM websites where id=6';
// connection.query(delSql,function (err, result) {
//         if(err){
//           console.log('[DELETE ERROR] - ',err.message);
//           return;
//         }        
 
//        console.log('--------------------------DELETE----------------------------');
//        console.log('DELETE affectedRows',result.affectedRows);
//        console.log('-----------------------------------------------------------------\n\n');  
// });
 
connection.end();
