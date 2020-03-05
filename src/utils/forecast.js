const request = require('request');

const forecast = (latitude, longitude, callback) => {
    const url = 'https://api.darksky.net/forecast/f040e0cbaa750444d9e0f1826d49b835/' + latitude + ',' + longitude + '';
    // first argument: options object. outlines what we want to do (url, other info). requires property name (url in our case)
    // second argument: function to run after we get the response, i.e., the data we want is available to use



    request({ url, json: true }, (error, { body }) => {
        // console.log(response.body.currently);
        if (error) {
            callback('Unable to connect to weather service.', undefined);
        } else if (body.error) {
            callback('Unable to find location.', undefined);
        } else {
            console.log(body.daily.data[0]);
            callback(undefined, `${body.daily.data[0].summary} It is currently ${body.currently.temperature} degrees out. There is ${body.currently.precipProbability}% chance of rain. <p> Highs of ${body.daily.data[0].temperatureHigh}°F. Lows of ${body.daily.data[0].temperatureLow}°F.`)
        }
    });
}

module.exports = forecast;