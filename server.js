const express = require('express');
const path = require('path');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

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
