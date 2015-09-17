'use strict';

function random(from, to) {
    return Math.ceil((Math.random() * to + from) % to);
}

var settings = require('./settings.json'),
    connection = new (require('./lib/Connection'))(settings.apiUrl, settings.secret),
    game = new (require('./lib/Game'))(connection, settings.tournament);

function shootRandomly() {
    var angle = random(0, 180) - 90;
    var power = random(1, 100);

    game.tank.shoot(angle, power).then(function(data) {
        shootRandomly();
    })
}

game.start(settings.username, false).then(function() {
    console.log('Game started, waiting for play');

    shootRandomly();
});
