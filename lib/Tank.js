'use strict';

var Promise = require('es6-promise').Promise;

function Tank(name, connection, tournament) {
    this.name = name;
    this.connection = connection;
    this.tournament = tournament;
}

Tank.prototype.register = function() {
    var self = this;

    console.log('Registering tank: ' + this.name);

    return new Promise(function(resolve, reject) {
        self.connection.request('tournaments/' + self.tournament + '/players/' + self.name, null, 'POST')
            .then(function(body) {
                if (body && body.name) {
                    console.log('Tank registered with color: ' + self.color);
                    self.color = body.color;
                    resolve(self);
                } else {
                    console.log('Registering tank error: ' + body.message);
                    reject(body.message);
                }
            });
    });
};

var DELAY = 300;

Tank.prototype.move = function(x) {
    var self = this;

    var end = DELAY + Date.now();
    return new Promise(function(resolve) {
        self.connection.request('tournaments/' + self.tournament + '/moves', {
            moveDistance: x,
            shotAngle: 0,
            shotPower: 0
        }, 'POST').then(function(data) {
            if (Date.now() < end) {
                setTimeout(function() {
                    resolve(data);
                }, end - Date.now());
            } else {
                resolve(data);
            }
        });
    });
};

Tank.prototype.shoot = function(angle, power) {
    var self = this;

    var end = DELAY + Date.now();
    return new Promise(function(resolve) {
        self.connection.request('tournaments/' + self.tournament + '/moves', {
            shotAngle: angle,
            shotPower: power,
            moveDistance: 0
        }, 'POST').then(function(data) {
            if (Date.now() < end) {
                setTimeout(function() {
                    resolve(data);
                }, end - Date.now());
            } else {
                console.log(
                    'Shoot, angle: ' + angle +
                    ', power: ' + power,
                    'result: ' + JSON.stringify(data.outcome.filter(function(n) {
                        return n.name === self.name;
                    })[0].hitCoordinates)
                );

                resolve(data);
            }
        });
    });
};

module.exports = Tank;
