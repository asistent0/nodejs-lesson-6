/**
 * Created by asistent on 13.05.2016.
 */

var bodyParser = require('body-parser'),
    path = require('path'),
    template = require('consolidate').jade,
    express = require('express'),
    config = require('./config'),
    todoController = require('./todo-controller'),
    userController = require('./user-controller'),
    cookieParser = require('cookie-parser'),
    session = require('cookie-session'),
    passport = require('passport'),
    localStratagy = require('passport-local');

var app = express();

app.use(express.static(path.join(__dirname, '/views/vendor')));

app.set('views', path.join(__dirname, '/views'));
app.engine('jade', template);
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser());
app.use(session({keys: ['key']}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStratagy(function (username, pass, done) {
    if (username !== 'admin' || pass !== 'admin')
        return done(null, false);

    done(null, {username: username});
}));

passport.serializeUser(function (user, done) {
    done(null, user.username);
});

passport.deserializeUser(function (username, done) {
    done(null, {username: username});
});

app.get('/login', userController.getLogin);
app.post('/login', passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/login'
}));

app.get('/logout', userController.logout);
app.get('/user', userController.mustBeAuth, userController.getUser);
app.post('/user', userController.postUser);
app.get('/', userController.mustBeAuth, todoController.index);
app.post('/', todoController.getting);
app.post('/add', todoController.add);
app.put('/edit/:id', todoController.edit);
app.patch('/completed/:id', todoController.completed);
app.delete('/dell/:id', todoController.dell);


app.listen(config.get('port'), function () {
    console.log('Server is launched on: http://localhost:' + config.get('port'))
});