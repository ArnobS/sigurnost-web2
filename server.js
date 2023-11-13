const express = require('express');
const path = require('path');
const session = require('express-session');
require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(express.urlencoded({ extended: true }));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static('public'));

app.use((req, res, next) => {
    if (req.session && req.session.cookie) {
        req.session.cookie.httpOnly = false;
    }
    next();
});

app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/home');
    } else {
        res.render('signup-login');
    }
});


app.get('/home', (req, res) => {
    console.log(req.session)

    const tekst = req.query.tekst;
    const safety = req.query.safety

    res.render('home', { session: req.session, tekst, user: req.session.user, safety});
});


app.post('/login', async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;

    req.session.user = { username, password }
    res.redirect('/')
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error during logout:', err);
        }
        res.redirect('/');
    });
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
