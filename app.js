'use strict';

function random(from, to) {
    return Math.ceil((Math.random() * to + from) % to);
}

var settings = require('./settings.json'),
    connection = new (require('./lib/Connection'))(settings.apiUrl, settings.secret),
    game = new (require('./lib/Game'))(connection, settings.tournament),
    hitPoint = require('./tools/utils').hitPoint;

function shootCorrectly() {
    if (!game.trajectories.length) {
        console.log('randomly');
        shootRandomly();
        return;
    }

    console.log('hehe', game.trajectories[0], game.lastTankPositions['Sheep'].x);
    var hit = hitPoint(game.lastTerrain, game.trajectories[game.trajectories.length - 1], game.lastTankPositions['Sheep'].x);

    console.log('hehe2');
    if (hit === null) {
        console.log('hit null');
        game.tank.shoot(game.trajectories[game.trajectories.length - 1].angle, game.trajectories[game.trajectories.length - 1].power).then(function() {
            shootCorrectly();
        });
    } else {
        console.log('hit correct');
        var promise;
        if (hit.x > 30) {
            promise = game.move(30);
        } else if (hit.x < -30) {
            promise = game.move(-30);
        } else {
            promise = game.move(hit.x);
        }

        promise.then(function() {
            shootCorrectly();
        });
    }
}

function shootRandomly() {
    var angle = random(0, 180) - 90;
    var power = random(1, 100);

    game.tank.shoot(angle, power).then(function(data) {
        shootCorrectly();
    })
}

game.start(settings.username, false).then(function() {
    console.log('Game started, waiting for play');

    shootCorrectly();
});
