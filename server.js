const express = require('express');
const app= express();

// 请求响应路由
// 对/news 页面进行get请求
app.get('/', (req, res)=>{
    res.send('Hello world');
});
// 对/news 页面进行get请求
app.get('/news', (req, res)=>{
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
app.listen(8083, ()=>{
    console.log('Server is running at http://localhost:8083')
})

