// core modules required before NPM packages
const path = require('path');
const express = require('express');
const hbs = require('hbs');

const request = require('request');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// set up handlebars engine
app.set('view engine', 'hbs');
// customize name of views directory
app.set('views', viewsPath);
// configure partials path
hbs.registerPartials(partialsPath);

// Setup static directory to serve
// .use --> a way to customize server
app.use(express.static(publicDirectoryPath))

// render handlebars element
// first argument - name of view to render
// second argument - object with all the values you want the view to be able to access
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Sam Eaton'
    });
});

// lets us configure what the server should do when the user tries to get a resource at a certain URL
// function - what we want to do when someone visits a route
// takes two arguments - request and response
// app.get('', (req, res) => {
//     res.send('<h1>Weather</h1>');
// });


app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: "Sam Eaton"
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        helpMessage: 'You want help? Bitch, I need all the help I can get. We don\'t have enough to go around.',
        title: 'Help',
        name: 'Sam Eaton'
    });
});


// request object (req) has query object on it (req.query)
// query string and request (e.g. ?adress=miami, or any other similar key/value pair) are parsed by express, and data is made available in req.query object

app.get('/weather', (req, res) => {
    console.log(req.query);
    if (!req.query.address) {
        return res.send({
            error: 'Please provide a search term.'
        });
    }

    // we have to supply a default parameter of an empty object, otherwise our app will attempt to destructure an undefined object and the app will crash.
    // although we are still attempting to destructure an empty object, our code in geocode.js makes sure this works. if the response is 0, and it is, our function sends an error message.
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error });
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send(error)
            }
            res.send({
                location,
                forecast: forecastData,
                address: req.query.address
            })
        })
    })
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        // stop rest of function from executing to avoid error
        return res.send({
            error: 'You must provide a search term.'
        });
    }
    
    console.log(req.query.search);
    res.send({
        products:[]
    })
});

// matches any page that starts with /help that hasn't been matched so far
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        text: 'Help article not found.',
        name: 'Sam Eaton'
    });
});

// 404 handling
// * match anything that hasn't been matched so far
// 404 needs to come last, right before app.listen. this is because express goes through list of route handler when request comes in, until it finds a match. if it doesn't, we get a 404.
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        text: 'Page not found.',
        name: 'Sam Eaton'
    })
});

// starts server and has it listen on a specific port
// callback runs when the server is up and running
app.listen(3000, () => {
    console.log('Server is up on port 3000');
});