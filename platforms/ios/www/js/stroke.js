var ipoint, splitstroke;

splitstroke = function(points) {
  var d, p0, p1, pre, slow, splitstrokes, t;
  if (!points || points.length === 0) {
    return [];
  }
  splitstrokes = [];
  pre = points[0];
  t = 0;
  slow = true;
  while (true) {
    p0 = ipoint(points, t);
    p1 = ipoint(points, t + 100);
    d = dist(p0, p1);
    if (d > 10) {
      slow = false;
    } else {
      if (d < 30 && !slow) {
        splitstrokes.push([pre, p0]);
        pre = p0;
        slow = true;
      }
    }
    if (p1[2] < 0) {
      break;
    }
    t += 100;
  }
  if (splitstrokes.length === 0) {
    splitstrokes = [[points[0], p0]];
  }
  return splitstrokes;
};

ipoint = function(points, t) {
  var ind, p1, p2, plen, torig, x, y;
  torig = points[0][2];
  plen = points.length;
  if (t === 0 || plen < 2) {
    return [points[0][0], points[0][1], 0];
  }
  if (points[plen - 1][2] - torig < t) {
    return [points[plen - 1][0], points[plen - 1][1], -1];
  }
  ind = 0;
  if (!points[ind]) {
    alert("ZZZZZZ");
  }
  while (points[ind]) {
    if (points[ind][2] - torig >= t) {
      break;
    }
    ind += 1;
  }
  p1 = points[ind - 1];
  p2 = points[ind];
  x = (p1[0] * ((p2[2] - torig) - t) + p2[0] * (t - (p1[2] - torig))) / (p2[2] - p1[2]);
  y = (p1[1] * ((p2[2] - torig) - t) + p2[1] * (t - (p1[2] - torig))) / (p2[2] - p1[2]);
  return [x, y, ind];
};
