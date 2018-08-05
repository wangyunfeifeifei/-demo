const express = require('express');
const app = express();
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users')
const path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', indexRouter);

// 访问如 localhost:3000/users/wang 时返回 ‘hello,wang’
app.use('/users',usersRouter);

app.listen(3000, () => {
    console.log('app is start at port 3000')
})
