'use strict';

var Tank = require('./Tank');

var lodash = require('lodash');

var fs = require('fs');

function Game(connection) {
    this.connection = connection;
}

Game.prototype._start = function(playerName, register) {
    var self = this;

    this.tank = new Tank(playerName, this.connection);

    return new Promise(function(resolve, reject) {
        if (register) {
            self.tank.register().then(function() {
                resolve(self);
            }, function(error) {
                reject(error);
            });
        } else {
            resolve(self);
        }
    });
};

Game.prototype.start = function(playerName, register) {
    var self = this;

    return new Promise(function(resolve, reject) {
        self._start(playerName, register).then(function() {
            register = false;

            self.getCurrentGame().then(function(data) {
                console.log('In current game');
                resolve(data);
            }, function() {
                console.log('Not in current game');
                self._onGameStart(resolve);
            });
        }, function(error) {
            reject(error);
        });
    });
};

Game.prototype.getCurrentGame = function() {
    var self = this;

    return new Promise(function(resolve, reject) {
        self.connection.request('tournaments/master/games/current').then(function(data) {
            var isCurrent = false;

            if (!data) {
                reject(null);
                return false;
            }

            for (var i = 0; i < data.setup.players.length; i++) {
                if (data.setup.players[i].name === self.tank.name) {
                    isCurrent = true;
                }
            }

            if (isCurrent) {
                resolve(data);
            } else {
                reject(null);
            }
        }, function(err) {
            reject(err);
        });
    });
};

Game.prototype._onGameStart = function(clbk) {
    var self = this;
    return this.connection.request('tournaments/master/games/my/setup').then(function(data) {
        clbk(data);
    }, function() {
        setTimeout(function() {
            self._onGameStart(clbk);
        }, 1);
    });
};

module.exports = Game;
