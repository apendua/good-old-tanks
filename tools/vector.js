var PP = {};

module.exports = PP;

PP.center = function (arrayOfVectors) {
  var sumX = 0;
  var sumY = 0;
  _.each(arrayOfVectors, function (v) {
    sumX += v.x;
    sumY += v.y;
  });
  return {
    x: sumX / arrayOfVectors.length,
    y: sumY / arrayOfVectors.length,
  };
};

PP.bbox = function (arrayOfVectors) {
  var bbox = {
    minX: +Infinity,
    minY: +Infinity,
    maxX: -Infinity,
    maxY: -Infinity,
  };
  _.each(arrayOfVectors, function (v) {
    bbox.minX = Math.min(v.x, bbox.minX);
    bbox.maxX = Math.max(v.x, bbox.maxX);
    bbox.minY = Math.min(v.y, bbox.minY);
    bbox.maxY = Math.max(v.y, bbox.maxY);
  });
  return bbox;
};

/**
 * Linear interpolation, if t === 1, returns q if t === 0 returns p.
 *
 * @param {vector} p
 * @param {vector} q
 * @param {number} t
 */
PP.interpolate = function (p, q, t) {
  return PP.add(PP.mul(q, t), PP.mul(p, 1-t));
};

PP.zero = function () {
  return {
    x: 0,
    y: 0,
  };
};

PP.vect = function (x, y) {
  return {
    x: x, y: y
  };
};

PP.mul = function mul(v, c) {
  return {
    x: v.x * c,
    y: v.y * c,
  };
};

PP.sub = function sub(u, v) {
  return {
    x: u.x - v.x,
    y: u.y - v.y,
  };
};

PP.add = function add(u, v) {
  return {
    x: u.x + v.x,
    y: u.y + v.y,
  };
};

PP.dot = function add(u, v) {
  return u.x * v.x + u.y * v.y;
};

PP.det = function det(u, v) {
  return u.x * v.y - u.y * v.x;
};

PP.norm = function norm(u) {
  return Math.sqrt(u.x * u.x + u.y * u.y);
};

PP.norm2 = function norm2(u) {
  return u.x * u.x + u.y * u.y;
};

PP.inv = function inv(u, v) {
  var one_over_det = 1 / (u.x * v.y - u.y * v.x);
  return function (p) {
    return {
      x: one_over_det * (  p.x * v.y - p.y * v.x),
      y: one_over_det * (- p.x * u.y + p.y * u.x),
    };
  };
};

PP.swap = function swap (u) {
  var temp = u.x;
  u.x = u.y;
  u.y = temp;
};

PP.copy = function (u) {
  return { x: u.x, y: u.y };
};

/**
 * Compute angle between the two vectors. The result is a value
 * between -pi and +pi, and it's positive iff [u,v] is positively
 * oriented, i.e. we are counting "counter-clockwise".
 *
 * @param {object} u
 * @param {object} v
 */
PP.angle = function (u, v) {
  var c = PP.dot(u,v) / ( PP.norm(u) * PP.norm(v) );
  //------------------------------------------------
  if (!_.isNumber(c) || !_.isFinite(c)) {
    return NaN;
  }
  // e.g. sometimes c may end up being 1.00000000001
  if (c > 1) {
    c = 1;
  }
  if (c < -1) {
    c = -1;
  }
  if (PP.det(u,v) > 0) {
    return Math.acos(c);
  }
  return - Math.acos(c);
};
