// Generated by CoffeeScript 1.7.1
var f, strokes;

strokes = [1, 2, 3, 4];

f = function(strokes) {
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function(d, i) {
    return strokes.push(d);
  });
  return console.log(strokes);
};

f(strokes);

console.log(strokes);