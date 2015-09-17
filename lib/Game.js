'use strict';

var Tank = require('./Tank');

var lodash = require('lodash');

var fs = require('fs');

function Game(connection, tournament) {
    this.connection = connection;
    this.tournament = tournament;
}

Game.prototype.getMyPosition = function() {
    if (this.tank && this.lastTankPositions[this.tank.name]) {
        return this.lastTankPositions[this.tank.name];
    }

    return null;
};

Game.prototype.getDeltaX = function(toName) {
    return this.lastTankPositions[toName].x - this.getMyPosition().x;
};

Game.prototype._start = function(playerName, register) {
    var self = this;

    this.tank = new Tank(playerName, this.connection, this.tournament, this);

    this.lastTerrain = [];
    this.trajectories = [];
    this.lastTankPositions = {};

    return new Promise(function(resolve, reject) {
        if (register) {
            console.log('x');
            self.tank.register().then(function() {
                console.log('a');
                resolve(self);
            }, function(error) {
                console.log('y');
                reject(error);
            });
        } else {
            console.log('b');
            resolve(self);
        }
    });
};

Game.prototype.start = function(playerName, register) {
    var self = this;

    return new Promise(function(resolve, reject) {
        self._start(playerName, register).then(function() {
            register = false;

            console.log('Xy');

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
        self.connection.request('tournaments/' + self.tournament + '/games/current').then(function(data) {
            var isCurrent = false;

            self.lastTankPositions = data.setup.initialPositions;
            self.lastTerrain = data.setup.scene.landscape.points;
            self.lastTrajectory = [];

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
            console.log('Ddd');
            reject(err);
        });
    });
};

Game.prototype._onGameStart = function(clbk) {
    var self = this;

    self.connection.request('tournaments/' + self.tournament + '/games/my/setup').then(function(data) {
        if (!data || data.errors) {
            setTimeout(function() { self._onGameStart(clbk); }, 1);
            return;
        }

        for (var i = 0; i < data.players.length; i++) {
            if (data.players[i].name === self.tank.name) {
                clbk(data);
                return;
            }
        }

        setTimeout(function() { self._onGameStart(clbk); }, 1);
    }, function() {
        setTimeout(function() {
            self._onGameStart(clbk);
        }, 1);
    });
};

module.exports = Game;
