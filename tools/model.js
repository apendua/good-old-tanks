var Lyric = require('lyric-node');
var sylvester = require('sylvester');
var data = require('./data.json');
var _ = require('lodash');

data.forEach(function (ex) {
    
    var input = {};
    
    input.x = _.pluck(ex.bulletTrajectory, 'x');
    input.y = _.pluck(ex.bulletTrajectory, 'y');
    
    var model = Lyric.buildModel(input);
    
    var alpha = Math.sin(ex.shotAngle) * (ex.shotPower / 100.0);
    var param = 2 * model.e(3,1) / (alpha * alpha);
    
    console.log('model', model.e(3,1));
    console.log('param', param);
    
    
});
