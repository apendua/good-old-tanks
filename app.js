'use strict';

function random(from, to) {
    return (Math.random() * to + from) % to;
}

var settings = require('./settings.json'),
    connection = new (require('./lib/Connection'))(settings.apiUrl, settings.secret),
    game = new (require('./lib/Game'))(connection);

function shootRandomly() {
    var angle = random(-90, 90);
    var power = random(1, 100);

    game.tank.shoot(angle, power).then(function(data) {
        console.log(JSON.stringify(data));
        shootRandomly();
    })
}

game.start('DROP TABLE', false).then(function() {
    console.log('Game started, waiting for play');

    shootRandomly();
});
