var t = require('trajectory');
var _ = require('lodash');
var v = require('vector');

exports.hitPoint = function (landscape, trajectory, offset) {
    var altitude = 0;
    var a = null;
    var v = null;
    var h = null;
    
    var hitPoint = null;
    
    t.walk(trajectory, function (p, q, r) {
        var v1 = v.sub(q,p);
        var v2 = v.sub(r,q);
        
        a = v.sub(v2, v1);
        v = v2;
        h = r;
        
        altitude = exports.altitude(landscape, r.x);
        
        if (r.y < altitude) {
            hitPoint = r;
        }
        return !!hitPoint;
    });
    
    if (hitPoint) {
        return hitPoint;
    }
    
    var counter = 0;
    
    while (!hitPoint && counter < 1000) {
        v += a;
        h += v;
        
        altitude = exports.altitude(landscape, h.x);
        
        if (h.y < altitude) {
            hitPoint = h;
        }
        counter += 1;
    }    
    return hitPoint;
};

exports.altitude = function (landscape, x) {
    var i = 0;
    while (landscape[i].x < x && i < landscape.length) {
        i += 1;
    }
    if (i === landscape.length) {
        return landscape[landscape.length-1].y;
    }
    if (i === 0) {
        return landscape[0].x;
    }
    return (landscape[i].y + landscape[i-1].y)/2;
};
