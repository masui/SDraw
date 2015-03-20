// Generated by CoffeeScript 1.7.1
var bgrect, body, candsearch, clickedElement, clone, deletestate, downpoint, downtime, drawPath, draw_mode, duplicated, edit_mode, elementpath, elements, fontsize, hideframe, linecolor, lines, linewidth, mode, modetimeout, moved, movepoint, moving, path, pen, points, polygon, polyline, randomTimeout, recognition, recogstrokes, resettimeout, resize, selected, selfunc, setTemplate, setfunc, shakepoint, showframe, sizeframe, sizesquare, snapdx, snapdy, strokes, svg, timeseed, totaldist, uppoint, zooming, zoomorigx, zoomorigy, zoomx, zoomy,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

body = d3.select("body");

svg = d3.select("svg");

bgrect = svg.append('rect');

downpoint = null;

movepoint = null;

uppoint = null;

elements = [];

selected = [];

points = [];

strokes = [];

recogstrokes = [];

moving = false;

moved = null;

duplicated = false;

linewidth = 10;

fontsize = 50;

linecolor = '#000000';

modetimeout = null;

resettimeout = null;

downtime = null;

deletestate = 0;

snapdx = 0;

snapdy = 0;

totaldist = 0;

shakepoint = [0, 0];

sizeframe = null;

sizesquare = null;

clickedElement = null;

zooming = false;

window.debug = function(s) {
  return $('#searchtext').val(s);
};

window.browserWidth = function() {
  return window.innerWidth || document.body.clientWidth;
};

window.browserHeight = function() {
  return window.innerHeight || document.body.clientHeight;
};

resize = function() {
  window.drawWidth = browserWidth() * 0.69;
  window.drawHeight = browserHeight();
  svg.attr({
    width: drawWidth,
    height: drawHeight
  }).style({
    'background-color': "#ffffff"
  });
  bgrect.attr({
    'x': 0,
    'y': 0,
    'width': window.drawWidth,
    'height': window.drawHeight,
    'fill': '#d0d0d0',
    'stroke': '#ffffff',
    'stroke-width': 0
  });
  $('#candidates').css('height', drawHeight / 2 - 30);
  return $('#suggestions').css('height', drawHeight / 2 - 30);
};

$(function() {
  resize();
  $(window).resize(resize);
  return draw_mode();
});

mode = 'draw';

$('#edit').on('click', function() {
  return edit_mode();
});

$('#delete').on('click', function() {
  var element, newelements, query, _i, _len;
  if (selected.length === 0) {
    query = $('#searchtext').val();
    $('#searchtext').val(query.slice(0, -1));
  } else {
    newelements = [];
    for (_i = 0, _len = elements.length; _i < _len; _i++) {
      element = elements[_i];
      if (__indexOf.call(selected, element) >= 0) {
        element.remove();
      } else {
        newelements.push(element);
      }
    }
    selected = [];
    elements = newelements;
  }
  return draw_mode();
});

$('#dup').on('click', function() {
  if (moved && duplicated) {
    clone(moved[0] + 30, moved[1] + 30);
  } else {
    clone(30, 30);
  }
  return duplicated = true;
});

$('#line1').on('click', function() {
  draw_mode();
  linewidth = 4;
  return fontsize = 30;
});

$('#line2').on('click', function() {
  draw_mode();
  linewidth = 10;
  return fontsize = 50;
});

$('#line3').on('click', function() {
  draw_mode();
  linewidth = 20;
  return fontsize = 80;
});

$('#color1').on('click', function() {
  draw_mode();
  return linecolor = '#ffffff';
});

$('#color2').on('click', function() {
  draw_mode();
  return linecolor = '#808080';
});

$('#color3').on('click', function() {
  draw_mode();
  return linecolor = '#000000';
});

pen = d3.select("#pen");

pen.on('mousedown', function() {
  downpoint = d3.mouse(this);
  if (downpoint[0] >= 140) {
    $('#penbg').attr('src', "pen3.png");
    linecolor = '#000000';
  }
  if (downpoint[0] > 110 && downpoint[0] < 140) {
    $('#penbg').attr('src', "pen2.png");
    linecolor = '#808080';
  }
  if (downpoint[0] > 80 && downpoint[0] < 110) {
    $('#penbg').attr('src', "pen1.png");
    linecolor = '#ffffff';
  }
  if (downpoint[0] > 50 && downpoint[0] < 80) {
    $('#pentop1').attr('src', "pentop2.png");
    $('#pentop2').attr('src', "pentop2.png");
    $('#pentop3').attr('src', "pentop1.png");
    linewidth = 20;
    fontsize = 80;
  }
  if (downpoint[0] > 25 && downpoint[0] < 50) {
    $('#pentop1').attr('src', "pentop2.png");
    $('#pentop2').attr('src', "pentop1.png");
    $('#pentop3').attr('src', "pentop2.png");
    linewidth = 10;
    fontsize = 50;
  }
  if (downpoint[0] > 0 && downpoint[0] < 25) {
    $('#pentop1').attr('src', "pentop1.png");
    $('#pentop2').attr('src', "pentop2.png");
    $('#pentop3').attr('src', "pentop2.png");
    linewidth = 4;
    fontsize = 30;
  }
  return downpoint = null;
});

clone = function(dx, dy) {
  var attr, ccloned, cloned, e, element, newselected, nodeName, parent, snappoint, _i, _j, _k, _len, _len1, _len2, _ref;
  newselected = [];
  for (_i = 0, _len = selected.length; _i < _len; _i++) {
    element = selected[_i];
    attr = element.node().attributes;
    nodeName = element.property("nodeName");
    parent = d3.select(element.node().parentNode);
    cloned = parent.append(nodeName);
    for (_j = 0, _len1 = attr.length; _j < _len1; _j++) {
      e = attr[_j];
      cloned.attr(e.nodeName, e.value);
    }
    element.attr('stroke', linecolor);
    if (element.snappoints) {
      cloned.snappoints = element.snappoints.map(function(point) {
        return point.concat();
      });
      _ref = cloned.snappoints;
      for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
        snappoint = _ref[_k];
        snappoint[0] += dx;
        snappoint[1] += dy;
      }
    }
    points = JSON.parse(element.attr('origpoints')).map(function(point) {
      return [point[0] + dx, point[1] + dy];
    });
    cloned.attr('points', JSON.stringify(points));
    cloned.attr('origpoints', JSON.stringify(points));
    cloned.attr('d', elementpath(element, points));
    if (nodeName === 'text') {
      cloned.text(element.text());
    }
    ccloned = cloned;
    cloned.on('mousedown', function() {
      clickedElement = setfunc(ccloned);
      if (mode === 'edit') {
        ccloned.attr("stroke", "yellow");
        if (__indexOf.call(selected, ccloned) < 0) {
          selected.push(ccloned);
        }
      }
      downpoint = d3.mouse(this);
      return moving = true;
    });
    cloned.on('mousemove', selfunc(cloned));
    cloned.on('mouseup', function() {});
    newselected.push(cloned);
    elements.push(cloned);
  }
  selected = newselected;
  return showframe();
};

$('#selectall').on('click', function() {
  svg.selectAll("*").attr("stroke", "yellow");
  selected = elements;
  debug(elements.length);
  showframe();
  return edit_mode();
});

candsearch = function() {
  var query;
  query = $('#searchtext').val();
  if (query.length > 0) {
    return bing_search(query, function(data) {
      return data.map(function(url, i) {
        var cand, candimage;
        cand = d3.select("#cand" + i);
        cand.selectAll('*').remove();
        candimage = cand.append('image').attr({
          'xlink:href': url,
          x: 0,
          y: 0,
          width: 120,
          height: 120,
          preserveAspectRatio: "meet"
        });
        candimage.x = 0;
        candimage.y = 0;
        return candimage.on('click', function() {
          var iimage, image;
          image = svg.append('image').attr({
            'xlink:href': url,
            x: 0,
            y: 0,
            width: 240,
            height: 240,
            preserveAspectRatio: "meet"
          });
          iimage = image;
          image.on('mousedown', function() {
            clickedElement = setfunc(iimage);
            downpoint = d3.mouse(this);
            return moving = true;
          });
          image.on('mousemove', selfunc(image));
          return image.on('mouseup', function() {});
        });
      });
    });
  }
};

$('#searchbutton').on('click', candsearch);

$('#searchtext').on('keydown', function(e) {
  if (e.keyCode === 13) {
    return candsearch();
  }
});

window.line = d3.svg.line().interpolate('cardinal').x(function(d) {
  return d[0];
}).y(function(d) {
  return d[1];
});

polyline = d3.svg.line().x(function(d) {
  return d[0];
}).y(function(d) {
  return d[1];
});

polygon = function(points) {
  var res, s;
  s = "M" + points.map(function(point) {
    return "" + point[0] + "," + point[1];
  }).join("L");
  res = s + "z";
  return res;
};

lines = function(points) {
  var s;
  s = "";
  points.forEach(function(entry, ind) {
    if (ind % 2 === 0) {
      return s += "M" + entry[0] + "," + entry[1];
    } else {
      return s += "L" + entry[0] + "," + entry[1];
    }
  });
  return s;
};

elementpath = function(element, points) {
  switch (element.attr('name')) {
    case 'circle':
      return circlepath(points);
    case 'polyline':
      return polyline(points);
    case 'polygon':
      return polygon(points);
    case 'lines':
      return lines(points);
    default:
      return line(points);
  }
};

window.template = svg.append("g");

window.drawline = function(x1, y1, x2, y2) {
  return template.append("polyline").attr({
    points: [[x1, y1], [x2, y2]],
    stroke: "#d0d0d0",
    fill: "none",
    "stroke-width": "3"
  });
};

timeseed = 0;

randomTimeout = null;

setTemplate = function(id, template) {
  d3.select("#" + id).on('click', function() {
    return template.draw();
  });
  d3.select("#" + id).on('mousedown', function() {
    d3.event.preventDefault();
    downpoint = d3.mouse(this);
    if (randomTimeout) {
      clearTimeout(randomTimeout);
    }
    return srand(timeseed);
  });
  d3.select("#" + id).on('mousemove', function() {
    var i, j, x, y, _ref;
    if (downpoint) {
      d3.event.preventDefault();
      _ref = d3.mouse(this), x = _ref[0], y = _ref[1];
      template.change(x - downpoint[0], y - downpoint[1]);
      i = Math.floor((x - downpoint[0]) / 10);
      j = Math.floor((y - downpoint[1]) / 10);
      return srand(timeseed + i * 100 + j);
    }
  });
  return d3.select("#" + id).on('mouseup', function() {
    return downpoint = null;
  });
};

setTemplate("template0", meshTemplate);

setTemplate("template1", parseTemplate);

setTemplate("template2", kareobanaTemplate);

setTemplate("template3", kareobanaTemplate3);

setTemplate("template4", kareobanaTemplate4);

path = null;

drawPath = function(path) {
  path.attr({
    d: line(points),
    stroke: path.attr('color'),
    'stroke-width': linewidth,
    'stroke-linecap': "round",
    fill: "none",
    points: JSON.stringify(points)
  });
  path.x = 0;
  return path.y = 0;
};

selfunc = function(element) {
  return function() {
    if (mode === 'edit') {
      if (!downpoint) {
        return;
      }
      if (moving) {
        return;
      }
      if (zooming) {
        return;
      }
      element.attr("stroke", "yellow");
      if (__indexOf.call(selected, element) < 0) {
        selected.push(element);
      }
      return showframe();
    }
  };
};

setfunc = function(element) {
  return function() {
    return element;
  };
};

zoomorigx = 0;

zoomorigy = 0;

zoomx = 0;

zoomy = 0;

showframe = function() {
  var element, maxx, maxy, minx, miny, point, x, y, _i, _j, _len, _len1, _ref;
  hideframe();
  points = [];
  for (_i = 0, _len = selected.length; _i < _len; _i++) {
    element = selected[_i];
    _ref = JSON.parse(element.attr('points'));
    for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
      point = _ref[_j];
      points.push(point);
    }
  }
  x = points.map(function(e) {
    return e[0];
  });
  y = points.map(function(e) {
    return e[1];
  });
  maxx = Math.max.apply(Math, x);
  minx = Math.min.apply(Math, x);
  maxy = Math.max.apply(Math, y);
  miny = Math.min.apply(Math, y);
  sizeframe = svg.append('path');
  sizeframe.attr({
    'x': minx - 5,
    'y': miny - 5,
    'width': maxx - minx + 10,
    'height': maxy - miny + 10,
    d: "M" + (minx - 5) + "," + (miny - 5) + "L" + (minx - 5) + "," + (maxy + 5) + "L" + (maxx + 5) + "," + (maxy + 5) + "L" + (maxx + 5) + "," + (miny - 5) + "Z",
    fill: 'none',
    'stroke': '#0000ff',
    'stroke-opacity': 0.5,
    'stroke-width': 2
  });
  sizesquare = svg.append('path');
  sizesquare.attr({
    d: "M" + (maxx - 10) + "," + (maxy - 10) + "L" + (maxx - 10) + "," + (maxy + 10) + "L" + (maxx + 10) + "," + (maxy + 10) + "L" + (maxx + 10) + "," + (maxy - 10) + "Z",
    fill: '#ff0000',
    'fill-opacity': 0.5
  });
  return sizesquare.on('mousedown', function() {
    downpoint = d3.mouse(this);
    zoomorigx = minx;
    zoomorigy = miny;
    zoomx = downpoint[0];
    zoomy = downpoint[1];
    zooming = true;
    return moving = false;
  });
};

hideframe = function() {
  if (sizeframe) {
    sizeframe.remove();
  }
  if (sizesquare) {
    return sizesquare.remove();
  }
};

draw_mode = function() {
  hideframe();
  mode = 'draw';
  moved = null;
  duplicated = false;
  deletestate = 0;
  strokes = [];
  recogstrokes = [];
  template.selectAll("*").remove();
  elements.map(function(element) {
    return element.attr("stroke", element.attr('color'));
  });
  bgrect.attr("fill", "#ffffff");
  svg.on('mousedown', function() {
    var ppath;
    d3.event.preventDefault();
    downpoint = d3.mouse(this);
    downtime = d3.event.timeStamp;
    downpoint.push(downtime);
    if (resettimeout) {
      clearTimeout(resettimeout);
    }
    modetimeout = setTimeout(function() {
      var element, f;
      if (clickedElement) {
        selected = [];
        path.remove();
        element = clickedElement();
        element.attr("stroke", "yellow");
        f = element.attr("fill");
        if (f && f !== "none") {
          element.attr("fill", "yellow");
        }
        selected.push(element);
        showframe();
        return edit_mode();
      }
    }, 500);
    path = svg.append('path');
    path.attr("color", linecolor);
    elements.push(path);
    points = [downpoint];
    ppath = path;
    path.on('mousedown', function() {
      clickedElement = setfunc(ppath);
      if (mode === 'edit') {
        ppath.attr("stroke", "yellow");
        if (__indexOf.call(selected, ppath) < 0) {
          selected.push(ppath);
        }
        showframe();
      }
      downpoint = d3.mouse(this);
      return moving = true;
    });
    path.on('mousemove', selfunc(path));
    return path.on('mouseup', function() {});
  });
  svg.on('mouseup', function() {
    var element, f, newelements, uptime, _i, _len;
    if (!downpoint) {
      return;
    }
    d3.event.preventDefault();
    uppoint = d3.mouse(this);
    uptime = d3.event.timeStamp;
    uppoint.push(uptime);
    if (modetimeout) {
      clearTimeout(modetimeout);
    }
    if (resettimeout) {
      clearTimeout(resettimeout);
    }
    resettimeout = setTimeout(function() {
      strokes = [];
      recogstrokes = [];
      points = [];
      return [0, 1, 2, 3, 4, 5, 6, 7].forEach(function(i) {
        var candsvg;
        candsvg = d3.select("#cand" + i);
        return candsvg.selectAll("*").remove();
      });
    }, 1500);
    if (clickedElement && uptime - downtime < 300 && dist(uppoint, downpoint) < 20) {
      selected = [];
      path.remove();
      newelements = [];
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        element = elements[_i];
        if (element !== path) {
          newelements.push(element);
        }
      }
      elements = newelements;
      element = clickedElement();
      element.attr("stroke", "yellow");
      f = element.attr("fill");
      if (f && f !== "none") {
        element.attr("fill", "yellow");
      }
      selected.push(element);
      downpoint = null;
      showframe();
      zooming = false;
      edit_mode();
    }
    points.push(uppoint);
    recogstrokes = recogstrokes.concat(splitstroke(points));
    strokes.push([downpoint, uppoint]);
    path.snappoints = [downpoint, uppoint];
    path.scalex = 1;
    path.scaley = 1;
    downpoint = null;
    moving = false;
    clickedElement = null;
    return recognition(recogstrokes);
  });
  return svg.on('mousemove', function() {
    var movetime;
    if (!downpoint) {
      return;
    }
    movepoint = d3.mouse(this);
    movetime = d3.event.timeStamp;
    movepoint.push(movetime);
    if (dist(movepoint, downpoint) > 20.0) {
      clearTimeout(modetimeout);
    }
    d3.event.preventDefault();
    points.push(movepoint);
    return drawPath(path);
  });
};

edit_mode = function() {
  var element, _i, _len;
  mode = 'edit';
  deletestate = 0;
  shakepoint = downpoint;
  template.selectAll("*").remove();
  bgrect.attr("fill", "#c0c0c0");
  for (_i = 0, _len = selected.length; _i < _len; _i++) {
    element = selected[_i];
    element.attr('origpoints', element.attr('points'));
  }
  svg.on('mousedown', function() {
    var _j, _len1, _results;
    d3.event.preventDefault();
    downpoint = d3.mouse(this);
    movepoint = downpoint;
    downtime = d3.event.timeStamp;
    moved = null;
    totaldist = 0;
    deletestate = 0;
    shakepoint = downpoint;
    _results = [];
    for (_j = 0, _len1 = selected.length; _j < _len1; _j++) {
      element = selected[_j];
      _results.push(element.attr('origpoints', element.attr('points')));
    }
    return _results;
  });
  svg.on('mousemove', function() {
    var d, dd, movetime, movex, movey, newelements, oldmovepoint, point, refpoint, refpoints, scalex, scaley, snappoint, _j, _k, _l, _len1, _len2, _len3, _len4, _len5, _len6, _len7, _len8, _len9, _m, _n, _o, _p, _q, _r, _ref, _ref1;
    if (!downpoint) {
      return;
    }
    oldmovepoint = movepoint;
    movepoint = d3.mouse(this);
    movetime = d3.event.timeStamp;
    if (zooming) {
      if (downpoint) {
        sizeframe.attr({
          d: "M" + (zoomorigx - 5) + "," + (zoomorigy - 5) + "L" + (zoomorigx - 5) + "," + (movepoint[1] + 5) + "L" + (movepoint[0] + 5) + "," + (movepoint[1] + 5) + "L" + (movepoint[0] + 5) + "," + (zoomorigy - 5) + "Z"
        });
        sizesquare.attr({
          d: "M" + (movepoint[0] - 10) + "," + (movepoint[1] - 10) + "L" + (movepoint[0] - 10) + "," + (movepoint[1] + 10) + "L" + (movepoint[0] + 10) + "," + (movepoint[1] + 10) + "L" + (movepoint[0] + 10) + "," + (movepoint[1] - 10) + "Z"
        });
        for (_j = 0, _len1 = selected.length; _j < _len1; _j++) {
          element = selected[_j];
          scalex = (movepoint[0] - zoomorigx) / (zoomx - zoomorigx);
          scaley = (movepoint[1] - zoomorigy) / (zoomy - zoomorigy);
          points = JSON.parse(element.attr('origpoints')).map(function(point) {
            return [zoomorigx + (point[0] - zoomorigx) * scalex, zoomorigy + (point[1] - zoomorigy) * scaley];
          });
          element.attr('points', JSON.stringify(points));
          element.attr('d', elementpath(element, points));
        }
      }
    }
    if (moving) {
      switch (deletestate) {
        case 0:
          if (movepoint[0] - shakepoint[0] > 30) {
            deletestate = 1;
            shakepoint = movepoint;
          }
          break;
        case 1:
          if (shakepoint[0] - movepoint[0] > 30) {
            deletestate = 2;
            shakepoint = movepoint;
          }
          break;
        case 2:
          if (movepoint[0] - shakepoint[0] > 30) {
            deletestate = 3;
            shakepoint = movepoint;
          }
          break;
        case 3:
          if (shakepoint[0] - movepoint[0] > 30 && movetime - downtime < 2000) {
            newelements = [];
            for (_k = 0, _len2 = elements.length; _k < _len2; _k++) {
              element = elements[_k];
              if (__indexOf.call(selected, element) < 0) {
                newelements.push(element);
              }
            }
            for (_l = 0, _len3 = selected.length; _l < _len3; _l++) {
              element = selected[_l];
              element.remove();
            }
            selected = [];
            elements = newelements;
            draw_mode();
          }
      }
      totaldist += dist(movepoint, oldmovepoint);
      snapdx = 0;
      snapdy = 0;
      if (totaldist > 200) {
        points = [];
        refpoints = [];
        for (_m = 0, _len4 = elements.length; _m < _len4; _m++) {
          element = elements[_m];
          if (element.snappoints) {
            if (__indexOf.call(selected, element) >= 0) {
              _ref = element.snappoints;
              for (_n = 0, _len5 = _ref.length; _n < _len5; _n++) {
                snappoint = _ref[_n];
                points.push([snappoint[0] + movepoint[0] - downpoint[0], snappoint[1] + movepoint[1] - downpoint[1]]);
              }
            } else {
              _ref1 = element.snappoints;
              for (_o = 0, _len6 = _ref1.length; _o < _len6; _o++) {
                snappoint = _ref1[_o];
                refpoints.push([snappoint[0], snappoint[1]]);
              }
            }
          }
        }
        d = 10000000;
        for (_p = 0, _len7 = points.length; _p < _len7; _p++) {
          point = points[_p];
          for (_q = 0, _len8 = refpoints.length; _q < _len8; _q++) {
            refpoint = refpoints[_q];
            dd = dist(point, refpoint);
            if (dd < d) {
              d = dd;
              snapdx = point[0] - refpoint[0];
              snapdy = point[1] - refpoint[1];
            }
          }
        }
      }
      if (Math.abs(snapdx) > 50 || Math.abs(snapdy > 50)) {
        snapdx = 0;
        snapdy = 0;
      }
      for (_r = 0, _len9 = selected.length; _r < _len9; _r++) {
        element = selected[_r];
        movex = movepoint[0] - downpoint[0] - snapdx;
        movey = movepoint[1] - downpoint[1] - snapdy;
        points = JSON.parse(element.attr('origpoints')).map(function(point) {
          return [point[0] + movex, point[1] + movey];
        });
        element.attr('points', JSON.stringify(points));
        element.attr('d', elementpath(element, points));
      }
      return showframe();
    }
  });
  return svg.on('mouseup', function() {
    var f, scalex, scaley, snappoint, uptime, _j, _k, _l, _len1, _len2, _len3, _len4, _m, _ref;
    if (!downpoint) {
      return;
    }
    d3.event.preventDefault();
    uppoint = d3.mouse(this);
    if (zooming) {
      for (_j = 0, _len1 = selected.length; _j < _len1; _j++) {
        element = selected[_j];
        scalex = (uppoint[0] - zoomorigx) / (zoomx - zoomorigx);
        scaley = (uppoint[1] - zoomorigy) / (zoomy - zoomorigy);
        element.scalex = scalex;
        element.scaley = scaley;
        element.snappoints = element.snappoints.map(function(point) {
          return [zoomorigx + (point[0] - zoomorigx) * scalex, zoomorigy + (point[1] - zoomorigy) * scaley];
        });
        points = JSON.parse(element.attr('origpoints')).map(function(point) {
          return [zoomorigx + (point[0] - zoomorigx) * scalex, zoomorigy + (point[1] - zoomorigy) * scaley];
        });
        element.attr('points', JSON.stringify(points));
        element.attr('d', elementpath(element, points));
      }
    }
    if (moving) {
      moved = [uppoint[0] - downpoint[0] - snapdx, uppoint[1] - downpoint[1] - snapdy];
      for (_k = 0, _len2 = selected.length; _k < _len2; _k++) {
        element = selected[_k];
        element.x += moved[0];
        element.y += moved[1];
        if (element.snappoints) {
          _ref = element.snappoints;
          for (_l = 0, _len3 = _ref.length; _l < _len3; _l++) {
            snappoint = _ref[_l];
            snappoint[0] += moved[0];
            snappoint[1] += moved[1];
          }
        }
        points = JSON.parse(element.attr('origpoints')).map(function(point) {
          return [point[0] + moved[0], point[1] + moved[1]];
        });
        element.attr('points', JSON.stringify(points));
        element.attr('d', elementpath(element, points));
      }
      showframe();
    }
    element.attr('origpoints', element.attr('points'));
    moving = false;
    zooming = false;
    downpoint = null;
    uptime = d3.event.timeStamp;
    if (uptime - downtime < 300 && !clickedElement) {
      duplicated = false;
      if (selected.length === 0) {
        selected = [];
        strokes = [];
        recogstrokes = [];
        hideframe();
        draw_mode();
      } else {
        for (_m = 0, _len4 = selected.length; _m < _len4; _m++) {
          element = selected[_m];
          element.attr("stroke", element.attr('color'));
          f = element.attr("fill");
          if (f && f !== "none") {
            element.attr("fill", element.attr('color'));
          }
        }
        selected = [];
        hideframe();
        draw_mode();
      }
    }
    return clickedElement = null;
  });
};

recognition = function(recogStrokes) {
  var cands;
  cands = recognize(recogStrokes, points, window.figuredata);
  return [0, 1, 2, 3, 4, 5, 6, 7].forEach(function(i) {
    var cand, candElement, candselfunc, candsvg, scalexx, scaleyy, _ref, _ref1;
    cand = cands[i];
    candsvg = d3.select("#cand" + i);
    candsvg.selectAll("*").remove();
    candElement = candsvg.append(cand.type);
    candElement.attr(cand.attr);
    if (cand.snappoints) {
      candElement.attr('snappoints', JSON.stringify(cand.snappoints));
    }
    if (cand.text) {
      candElement.text(cand.text);
    }
    candElement.attr('color', 'black');
    scalexx = (_ref = cand.scalex) != null ? _ref : 1;
    scaleyy = (_ref1 = cand.scaley) != null ? _ref1 : 1;
    candselfunc = function() {
      var attr, ce, copiedElement, point, snappoint, stroke, target, text, xx, yy, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _n, _ref2, _ref3, _ref4, _ref5, _results;
      d3.event.preventDefault();
      downpoint = d3.mouse(this);
      target = d3.event.target;
      if (target.nodeName === 'svg') {
        target = target.childNodes[0];
      }
      xx = 1000;
      yy = 1000;
      for (_i = 0, _len = recogStrokes.length; _i < _len; _i++) {
        stroke = recogStrokes[_i];
        for (_j = 0, _len1 = stroke.length; _j < _len1; _j++) {
          point = stroke[_j];
          if (point[0] < xx) {
            xx = point[0];
          }
          if (point[1] < yy) {
            yy = point[1];
          }
        }
      }
      (function() {
        _results = [];
        for (var _k = 0, _ref2 = strokes.length; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; 0 <= _ref2 ? _k++ : _k--){ _results.push(_k); }
        return _results;
      }).apply(this).forEach(function(i) {
        var element;
        element = elements.pop();
        return element.remove();
      });
      copiedElement = svg.append(target.nodeName);
      copiedElement.x = 0;
      copiedElement.y = 0;
      _ref3 = target.attributes;
      for (_l = 0, _len2 = _ref3.length; _l < _len2; _l++) {
        attr = _ref3[_l];
        copiedElement.attr(attr.nodeName, attr.value);
        if (attr.nodeName === 'snappoints') {
          copiedElement.snappoints = JSON.parse(attr.value);
        }
      }
      copiedElement.attr('x', xx);
      copiedElement.attr('y', yy);
      copiedElement.attr('font-size', fontsize);
      if (target.nodeName !== 'text') {
        copiedElement.attr('stroke-width', linewidth);
      }
      if (target.nodeName === 'path') {
        _ref4 = copiedElement.snappoints;
        for (_m = 0, _len3 = _ref4.length; _m < _len3; _m++) {
          snappoint = _ref4[_m];
          snappoint[0] *= scalexx;
          snappoint[1] *= scaleyy;
          snappoint[0] += xx;
          snappoint[1] += yy;
          copiedElement.attr("stroke-width", linewidth);
        }
        copiedElement.x = xx;
        copiedElement.y = yy;
        copiedElement.attr('stroke', linecolor);
        copiedElement.attr('color', linecolor);
        points = JSON.parse(copiedElement.attr('points')).map(function(point) {
          var z;
          return z = [xx + point[0] * scalexx, yy + point[1] * scaleyy];
        });
        copiedElement.attr('points', JSON.stringify(points));
        copiedElement.attr('d', elementpath(copiedElement, points));
      }
      if (target.nodeName === 'text') {
        _ref5 = copiedElement.snappoints;
        for (_n = 0, _len4 = _ref5.length; _n < _len4; _n++) {
          snappoint = _ref5[_n];
          snappoint[0] += xx;
          snappoint[1] += yy;
        }
      }
      copiedElement.attr('scalex', scalexx);
      copiedElement.scalex = scalexx;
      copiedElement.attr('scaley', scaleyy);
      copiedElement.scaley = scaleyy;
      if (target.innerHTML) {
        copiedElement.text(target.innerHTML);
        text = $('#searchtext').val();
        $('#searchtext').val(text + target.innerHTML);
      }
      elements.push(copiedElement);
      copiedElement.on('mousemove', selfunc(copiedElement));
      ce = copiedElement;
      copiedElement.on('mousedown', function() {
        clickedElement = setfunc(ce);
        ce.attr("stroke", "yellow");
        if (__indexOf.call(selected, ce) < 0) {
          selected.push(ce);
        }
        return moving = true;
      });
      strokes = [];
      return recogstrokes = [];
    };
    candElement.on('mousedown', candselfunc);
    if (!cand.text) {
      candsvg.on('mousedown', candselfunc);
    }
    return candElement.on('mouseup', function() {
      if (!downpoint) {
        return;
      }
      d3.event.preventDefault();
      return downpoint = null;
    });
  });
};
