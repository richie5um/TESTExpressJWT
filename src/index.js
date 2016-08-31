var Express = require('express');
var ExpressJWT = require('express-jwt');
var JWT = require('jsonwebtoken');
var BodyParser = require('body-parser');

var app = Express();
var secret = 'Abcd1234';

var authUnless = function(path, middleware) {
    return function(req, res, next) {
        if ('/api/login' === req.url) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
};

app.use(authUnless('/api', ExpressJWT({ secret: secret })));

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

app.post('/api/login', function (req, res) {
    console.log(req.body);
    if (!(req.body.username === 'bob' && req.body.password === 'pass')) {
        return res.status(401).send('Wrong user or password');
    }

    var profile = {
        firstName: 'Bob',
        lastName: 'Smith',
        email: 'bob@smith.com',
        id: 123
    };

    var token = JWT.sign(profile, secret, { expiresIn: 60 * 5 });
    return res.json({ token: token });
});

app.get('/api/restricted', function (req, res) {
    console.log(req.user);
    console.log('user ' + req.user.email + ' is calling /api/restricted');
    return res.json({
        name: 'foo'
    });
});

app.listen(3000, function () {
    console.log('Listening on port 3000');
});
