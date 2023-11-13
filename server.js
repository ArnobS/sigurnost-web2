const express = require('express');
const path = require('path');
const session = require('express-session');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Use the session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.use(express.urlencoded({ extended: true }));

// Set the view engine to EJS and set the views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" directory
app.use(express.static('public'));

app.use((req, res, next) => {
    // Check if the session cookie is being set (you can adjust the condition as needed)
    if (req.session && req.session.cookie) {
        req.session.cookie.httpOnly = false;
    }
    next();
});

app.get('/', (req, res) => {
    if (req.session.user) {
        // If user is logged in, redirect to homepage
        res.redirect('/home');
    } else {
        // If not logged in, render signup/login page
        res.render('signup-login');
    }
});


// Set up a route for the home screen
app.get('/home', (req, res) => {
    console.log(req.session)

    const tekst = req.query.tekst;
    const safety = req.query.safety

    // Render the EJS template and pass the session variable
    res.render('home', { session: req.session, tekst, user: req.session.user, safety});
});


app.post('/login', async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;

    req.session.user = { username, password }
    res.redirect('/')

    // try {
    //     // Insert user into the database (plaintext password for demonstration purposes)
    //     const result = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, password]);

    //     // Create a user object to store in the session
    //     const userObject = { id: result.rows[0].id, username: result.rows[0].username };

    //     // Store the user object in the session
    //     req.session.user = userObject;

    //     res.redirect('/home');
    // } catch (error) {
    //     console.error('Error during signup:', error);
    //     res.status(500).send('Internal Server Error');
    // }
});

// Logout route
app.get('/logout', (req, res) => {
    // Destroy the session to log out the user
    req.session.destroy((err) => {
        if (err) {
            console.error('Error during logout:', err);
        }
        // Redirect to the login page after logout
        res.redirect('/');
    });
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
