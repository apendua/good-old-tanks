var utils = require('./utils');

module.exports = function (landscape, trajectory, targetX) {
    
    return (function next (min, max) {
        
        var pos = (min + max) / 2;
        var hit = null;
        
        if (max - min < 30) {
            return null;
        }
        
        hit = utils.hitPoint(landscape, trajectory, {
            x: pos,
            y: utils.altitude(landscape, pos),
        });
        
        if (Math.abs(hit.x - targetX) < 30) {
            return pos;
        }
        
        if (hit.x > targetX) {
            return next(min, pos);
        } else {
            return next(pos, max);
        }
        
    })(-500, 500);
};
