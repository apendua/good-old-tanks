
var PP = {};

module.exports = PP;

/**
 * A path is considered positive if it "walks" counter-clockwise
 * with respect to it's interior. In other words, the iterior
 * of a positive path is on the "left-hand-side".
 */
PP.orientation = function orientation (path) {
  'use strict';
  var sum = 0;
  PP.walk3(path, function (p, q, r) {
    sum += PP.angle(PP.sub(q, p), PP.sub(r, q));
  });
  return Math.round(sum / (2 * Math.PI));
};

/**
 * Compute path index w.r.t. point.
 */
PP.index = function orientation (p, path) {
  'use strict';
  var sum = 0;
  PP.walk2(path, function (q, r) {
    sum += PP.angle(PP.sub(q, p), PP.sub(r, p));
  });
  return Math.round(sum / (2 * Math.PI));
};

/**
 * Regions will have positive or negative sign. We generally want
 * the corresponding paths to have coherent orientation, so:
 *
 * region.sign === PP.orientation(region.path)
 *
 * so we set a third variable, region.swap to indicate if the
 * above equality holds (swap === 1) or not (swap === -1).
 */
PP.cleanOrientation = function cleanOrientation (area) {
  'use strict';
  _.each(area, function (region) {
    if (region.swap === undefined) {
      region.swap = region.sign * PP.orientation(region.path);
    }
  });
};

PP.walkArray = function walkArray (array, iterator, options) {
  'use strict';
  for (var i=0; i < array.length-1; i++) {
    iterator(array[i], array[i+1], i);
  }
};

PP.walk2 = PP.walk = function walk2 (path, iterator, options) {
  'use strict';
  var done = false;
  options = options || {};
  options.fromIndex = options.fromIndex || 0;
  for (var i=options.fromIndex; i < path.length; i++) {
    if (i+1 === path.length) {
      done = iterator(path[i], path[0], i);
    } else {
      done = iterator(path[i], path[i+1], i);
    }
    if (done) {
        return;
    }
  }
};

PP.walk3 = function walk3 (path, iterator, options) {
  'use strict';
  options = options || {};
  options.fromIndex = options.fromIndex || 0;
  for (var i=options.fromIndex; i < path.length; i++) {
    if (i+1 === path.length) {
      iterator(path[i], path[0], path[1], i);
    } else if (i+2 === path.length) {
      iterator(path[i], path[i+1], path[0], i);
    } else {
      iterator(path[i], path[i+1], path[i+2], i);
    }
  }
};
