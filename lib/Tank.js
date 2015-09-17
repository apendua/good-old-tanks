'use strict';

var Promise = require('es6-promise').Promise;

function Tank(name, connection) {
    this.name = name;
    this.connection = connection;
}

Tank.prototype.register = function() {
    var self = this;

    console.log('Registering tank: ' + this.name);

    return new Promise(function(resolve, reject) {
        self.connection.request('tournaments/master/players/' + self.name, null, 'POST')
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

Tank.prototype.move = function(x, angle, power) {
    var self = this;

    return new Promise(function(resolve) {
        self.connection.request('tournaments/master/moves', {
            shotAngle: angle,
            shotPower: power,
            moveDistance: x
        }, 'POST').then(function(data) {
            resolve(data);
        });
    });
};

Tank.prototype.shoot = function(angle, power) {
    return this.move(0, angle, power);
};

module.exports = Tank;
