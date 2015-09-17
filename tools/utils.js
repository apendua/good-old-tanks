var t = require('./trajectory');
var _ = require('lodash');
var ve = require('./vector');

exports.hitPoint = function (landscape, trajectory, offset) {
    try {
        var altitude = 0;
        var a = null;
        var v = null;
        var h = null;

        var hitPoint = null;

        t.walk3(trajectory, function (p, q, r) {
            var v1 = ve.sub(q, p);
            var v2 = ve.sub(r, q);

            a = ve.sub(v2, v1);
            v = v2;
            h = r;

            altitude = exports.altitude(landscape, r, r.x);

            if (r.y < altitude) {
                hitPoint = r;
            }
            return !!hitPoint;
        });

        if (hitPoint) {
            return hitPoint;
        }

        var counter = 0;

        if (!v || !a || !h) {
            return null;
        }

        while (!hitPoint && counter < 10) {
            v = ve.add(v, a);
            h = ve.add(h, v);

            altitude = exports.altitude(landscape, h.x);

            if (h.y < altitude) {
                hitPoint = h;
            }
            counter += 1;
        }
        return hitPoint;
    } catch (e) {
        console.log(e.stack);
    }
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
