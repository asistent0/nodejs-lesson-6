/**
 * Created by asistent on 18.05.2016.
 */

var getLogin = function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/');
    }
    res.render('login');
};

var getUser = function (req, res) {
    res.render('user');
};

var postUser = function (req, res) {
    return res.send({status: 'success', 'username': req.user.username});
};

var logout = function (req, res) {
    req.logout();
    res.redirect('/');
};

module.exports = {
    getLogin: getLogin,
    getUser: getUser,
    postUser: postUser,
    logout: logout
};