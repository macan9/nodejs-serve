# nodejs-mysql

## 1.安装 node mysql 框架

`npm install mysql --save`

当前目录新建配置文件 conf/db.config.js 
```javascript
module.exports = {
    host: 'localhost', // 服务器地址
    user: 'root', // mysql用户名称
    password: '', // mysql用户密码
    port: '3306', // 端口
    database: 'test', // 数据库名称
}
```

## 2. serve.js中建立链接 
``` js 
const mysql = require('mysql'); 
const mysql_conf = require('./conf/db.config')
const connection = mysql.createConnection(mysql_conf);
connection.connect();
/* 此处写各种数据库的操作 */
connection.end();
```

## 3.启动 mysql 

下载 Laragon 启动服务，即可让数据库运行在3306端口

![image-20230415124131052](https://gitee.com/mc150324/PicGo/raw/master/img/image-20230415124131052.png)

下载 Navicat 创建并链接 test 数据库

![屏幕截图_20230415_124259](https://gitee.com/mc150324/PicGo/raw/master/img/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE_20230415_124259.png)

## 4.导入 websites.sql 

点击数据库链接，运行 SQL 文件, 即可新建表和添加数据
```sql
/*
 Navicat MySQL Data Transfer
 Source Server         : 127.0.0.1
 Source Server Version : 50621
 Source Host           : localhost
 Source Database       : RUNOOB

 Target Server Version : 50621
 File Encoding         : utf-8

 Date: 05/18/2016 11:44:07 AM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `websites`
-- ----------------------------
DROP TABLE IF EXISTS `websites`;
CREATE TABLE `websites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(20) NOT NULL DEFAULT '' COMMENT '站点名称',
  `url` varchar(255) NOT NULL DEFAULT '',
  `alexa` int(11) NOT NULL DEFAULT '0' COMMENT 'Alexa 排名',
  `country` char(10) NOT NULL DEFAULT '' COMMENT '国家',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `websites`
-- ----------------------------
BEGIN;
INSERT INTO `websites` VALUES ('1', 'Google', 'https://www.google.cm/', '1', 'USA'), ('2', '淘宝', 'https://www.taobao.com/', '13', 'CN'), ('3', '菜鸟教程', 'http://www.runoob.com/', '4689', 'CN'), ('4', '微博', 'http://weibo.com/', '20', 'CN'), ('5', 'Facebook', 'https://www.facebook.com/', '3', 'USA');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
```
## 数据库操作，即sql 增删改查语句
`SELECT * FROM [sheet]` 查
```js
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
```
即可获取数据到数据库数据

![image-20230415125701741](https://gitee.com/mc150324/PicGo/raw/master/img/image-20230415125701741.png)

`INSERT INTO [sheet[attr]] ` 增

```js
const  addSql = 'INSERT INTO websites(Id,name,url,alexa,country) VALUES(0,?,?,?,?)';
const  addSqlParams = ['菜鸟工具', 'https://c.runoob.com','23453', 'CN'];
connection.query(addSql,addSqlParams,function (err, result) {
        if(err){
         console.log('[INSERT ERROR] - ',err.message);
         return;
        }        
 
       console.log('--------------------------INSERT----------------------------');
       //console.log('INSERT ID:',result.insertId);        
       console.log('INSERT ID:',result);        
       console.log('-----------------------------------------------------------------\n\n');  
});
```
`UPDATE [sheet] SET [attr]` 改

```js
const modSql = 'UPDATE websites SET name = ?,url = ? WHERE Id = ?';
const modSqlParams = ['菜鸟移动站', 'https://m.runoob.com',6];
connection.query(modSql,modSqlParams,function (err, result) {
   if(err){
         console.log('[UPDATE ERROR] - ',err.message);
         return;
   }        
  console.log('--------------------------UPDATE----------------------------');
  console.log('UPDATE affectedRows',result.affectedRows);
  console.log('-----------------------------------------------------------------\n\n');
});
```
`DELETE FROM [sheet]` 删 
```js
const delSql = 'DELETE FROM websites where id=6';
connection.query(delSql,function (err, result) {
        if(err){
          console.log('[DELETE ERROR] - ',err.message);
          return;
        }        
 
       console.log('--------------------------DELETE----------------------------');
       console.log('DELETE affectedRows',result.affectedRows);
       console.log('-----------------------------------------------------------------\n\n');  
});
```




