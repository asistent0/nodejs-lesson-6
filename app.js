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

app.set(express.static(path.join(__dirname, '/views')));
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
app.get('/user', mustBeAuthentificated, userController.getUser);
app.post('/user', mustBeAuthentificated, userController.postUser);
app.get('/', mustBeAuthentificated, todoController.index);
app.post('/', mustBeAuthentificated, todoController.getting);
app.post('/add', mustBeAuthentificated, todoController.add);
app.post('/description', mustBeAuthentificated, todoController.description);
app.post('/completed', mustBeAuthentificated, todoController.completed);
app.post('/dell', mustBeAuthentificated, todoController.dell);

function mustBeAuthentificated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login'); // go to login page
}

app.listen(config.get('port'), function () {
    console.log('Server is launched on: http://localhost:' + config.get('port'))
});