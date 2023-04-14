# nodejs-serve
const express = require('express');
const app= express();

app.use(loggingMiddleware);


// 1. 利用 http 启动一个服务 

const http = require('http');
const hostname = 'localhost';
const port = 8085;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('Hello other World\n');
});
// 异步
server.listen(port, () => {
    console.log(`Server is running at http://${hostname}:${port}`);
});


// 2. 请求响应路由

// 对/news 页面进行get请求
app.get('/news', (req, res)=>{
    // 可以打印出url和请求的路由参数
    console.log(req.url, req.params, req.query)
    res.send('Hello news');
});
// 对/about 页面进行post请求
app.post('/about', (req, res)=>{
    res.send('Hello about');
});
// 对/list* 可匹配 /list+任意字符
app.get('/list*', (req, res)=>{
    res.send('Hello list pages');
})

// 异步
app.listen(8083, ()=>{
    console.log('Server1 is running at http://localhost:8083')
})
console.log('我也不知道执行不执行')


//  3. 中间键
//  中间键就是对客户端请求发起后可能执行的方法，可以全局注册，和对应的url注册

//  app.get('/middleware', someMiddleware, (req, res) => {}) 
//  app.use(someMiddleware); 放在app get 前
function loggingMiddleware(req, res, next) {
    const time = new Date();
    console.log(`time:[${time.toLocaleString()}], method: ${req.method},url: ${req.url}`);
    next();
}


app.get('/middle', loggingMiddleware, (req, res)=>{
    res.send('middle测试');
});


// 4. 用模板引擎渲染页面
// Express 对当今主流的模板引擎（例如 Pug、Handlebars、EJS 等等）提供了很好的支持，可以做到两行代码接入。

// 指定模板存放目录   app.set('views', path);
app.set('views', 'views');

// 指定模板引擎为 Handlebars
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('index');
});
  
app.get('/contact', (req, res) => {
    res.render('contact');
})


// 5. 添加静态文件服务
// 通常网站需要提供静态文件服务，例如图片、CSS 文件、JS 文件等等，
// 而 Express 已经自带了静态文件服务中间件 express.static，使用起来非常方便

// 添加静态文件中间件如下，并指定静态资源根目录为 public [path]

app.use(express.static('public'));
// 已下链接可以直接在浏览器中访问对应的静态资源
// http://localhost:8083/style/index.css
// http://localhost:8083/img/wall_paper.jpg


// 6.实现 JSON API
//  Express 为我们封装了一个 json 方法，直接就可以将一个 JavaScript 对象作为 JSON 数据返回 
app.get('/apis', (req, res) => {
    res.json({ name: '图雀社区', website: 'https://tuture.co' });
});

// 7.处理 404 和服务器错误

// 匹配空路由 返回404
app.use('*', (req, res) => {
    res.status(404).render('404', { url: req.originalUrl });
});


// 模拟服务器抛出错误
app.get('/broken', (req, res) => {
    throw new Error('Broken!');
});
// 返回 500 页面
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('500');
});


