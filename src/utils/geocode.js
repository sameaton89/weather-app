const request = require('request');

// Geocoding
// Address -> Lat/Long -> Weather
const geocode = (address, callback) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?access_token=pk.eyJ1Ijoic2htb25leSIsImEiOiJjazNjbGRlM3AweDgzM2NxbHQ4ZmttMTBqIn0.Bsh0Vez1ZzoBxR9s-PSkRQ';

    request({ url, json: true}, (error, { body }) => {
        if (error) {
            // sends to function call as a string, allowing caller to do whatever they want with that string. we can manually define undefined, but even without it, javascript will automatically return the second argument as undefined.
            callback('Unable to connect to location services.', undefined)
        } else if (body.features.length === 0) {
            callback('Unable to find location. Try another search.', undefined)
            // for the else statement, we don't want to return an error, so we pass the first argument as undefined
        } else {
            callback(undefined, {
            latitude: body.features[0].center[1],
            longitude: body.features[0].center[0],
            location: body.features[0].place_name
            });
        }
    });
}

module.exports = geocode;