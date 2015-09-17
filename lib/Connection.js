'use strict';

var request = require('request');
var Promise = require('es6-promise').Promise;

function Connection(apiUrl, secretKey) {
    this.apiUrl = apiUrl;
    this.secretKey = secretKey;
}

Connection.prototype.request = function(url, data, method) {
    var self = this;

    method = method ? method.toLowerCase() : 'get';

    return new Promise(function(resolve) {
        request[method]({
            url: self.apiUrl + '/' + url,
            headers: {
                'Authorization': self.secretKey
            },
            json: data
        }, function(err, resp, body) {
            try {
                resolve(typeof body === 'object' ? body : JSON.parse(body));
            } catch (e) {
                resolve({ errors: 'Unknown error' });
            }
        });
    });
};

module.exports = Connection;
