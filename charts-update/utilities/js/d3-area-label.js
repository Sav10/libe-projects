(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-array'), require('d3-scale')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-array', 'd3-scale'], factory) :
  (factory((global.d3 = global.d3 || {}),global.d3,global.d3));
}(this, function (exports,d3Array,d3Scale) { 'use strict';

  // Determines whether or not a rectangle
  // of the given width and height
  // fits in side the given area.
  function fits(options) {

    // Internall variables.
    var x0, x1, i0, i1, j, d, top, bottom, ceiling, floor,

        // The width in pixels of the rectangle to test.
        width = options.width,

        // The height in pixels of the rectangle to test.
        height = options.height,

        // The data that defines the area to test against.
        data = options.data,

        // A boolean that indicates we're only interested
        // in a Boolean return value, not full solution details.
        justTest = options.justTest,

        // The maximum X value.
        xMax = options.xMax,

        // A function that returns the index in the data array
        // that comes before the X value passed into it.
        xIndex = options.xIndex,

        // The X value accessor.
        x = options.x,

        // The Y0 value accessor.
        y1 = options.y1,

        // The Y1 value accessor.
        y0 = options.y0;

    // Check if we can fit the rectangle at an X position
    // corresponding with one of the X values from the data.
    for(i0 = 0; i0 < data.length; i0++) {
      d = data[i0];

      // The left edge of the rectangle.
      x0 = x(d);

      // The right edge of the rectangle.
      x1 = x0 + width;

      // Don't go off the right edge of the area.
      if (x1 > xMax) {
        break;
      }
      
      // Test until we reach the rightmost X position
      // within the X positions of the data points.
      i1 = xIndex(x1);
      ceiling = -Infinity;
      floor = Infinity;
      for(j = i0; j <= i1; j++) {
        d = data[j];

        bottom = y0(d);
        if(bottom < floor) {
          floor = bottom;
        }

        top = y1(d);
        if(top > ceiling) {
          ceiling = top;
        }

        // Break as soon as we know the rectangle wil not fit.
        if ((floor - ceiling) < height) {
          break;
        }
      }

      // If the rectangle fits at the current x0 position,
      // the report that the rectangle indeed fits.
      if ((floor - ceiling) >= height) {

        // Avoid creating new objects unnecessarily while just testing.
        if (justTest) {
          return true;
        }

        // Output the full solution for use in label transform.
        return {
          x: x0,
          y: ceiling,
          width: width,
          height: height
        };
      }
    }
    return false;
  };

  // Returns a transform string that will
  // translate and scale the label to the computed position and size.
  function toTransformString() {
    return [
      'translate(' + this.xTranslate + ',' + this.yTranslate + ')',
      'scale(' + this.scale + ')'
    ].join(' ');
  };

  function areaLabel(area) {
    var x,
        y0,
        y1,
        bisectorX,
        minHeight = 2,
        epsilon = 0.01,
        maxIterations = 100,
        interpolate = true,
        interpolateResolution = 800,
        paddingLeft = 0,
        paddingRight = 0,
        paddingTop = 0,
        paddingBottom = 0,
        numIterations;

    // Gets the height of the area for a particular datum.
    function getHeight(d) {
      return y0(d) - y1(d);
    }

    // Finds the largest value that passes the test
    // within some epsilon tolerance.
    // https://en.wikipedia.org/wiki/Bisection_method#Algorithm
    function bisection(a, b, test, epsilon, maxIterations) {
      var i, c, passesTest, withinEpsilon;
      for(i = 0; i < maxIterations; i++){
        c = (a + b) / 2;
        passesTest = test(c);
        withinEpsilon = (b - a) / 2 < epsilon;

        // In our case, the returned value *must* pass the test,
        // so it's not enough only to check if the value is within epsilon.
        if ( passesTest && withinEpsilon) {
          numIterations = i;
          return c;
        }
        if (passesTest) {
          a = c;
        } else {
          b = c;
        }
      }
      return null;
    }
    
    function interpolateY(data, xValue, y) {
      var i = bisectorX(data, xValue, 0, data.length - 1),
          a = data[i - 1],
          b = data[i],
          ax = x(a),
          ay = y(a),
          bx = x(b),
          by = y(b),
          t = (xValue - ax) / (bx - ax);
      return ay * (1 - t) + by * t;
    }

    // Returns true if there is at least one rectangle
    // of the given aspect ratio and scale
    // that fits somewhere within the area.

    function my(data) {

      // The bounding box of the text label as-is.
      var box = this.getBBox();

      // Account for padding.
      var paddingFactorX = 1 + paddingLeft + paddingRight;
      var paddingFactorY = 1 + paddingTop + paddingBottom;
      var boxWidth = box.width * paddingFactorX;
      var boxHeight = box.height * paddingFactorY;

      // The aspect ratio of the text label bounding box.
      var aspect = boxWidth / boxHeight;

      // Compute maximum possible label bounding box height in pixels.
      var maxHeight = d3Array.max(data, getHeight);

      // Compute the X extent once, to be reused for every height test.
      var xExtent = d3Array.extent(data, x);

      // The test function for use in the bisection method.
      var options = {
        justTest: true,
        xMax: xExtent[1]
      };

      if (interpolate) {
        var interpolateResolutionScale = d3Scale.scaleLinear()
          .domain([0, interpolateResolution - 1])
          .range(xExtent);

        var interpolatedData = d3Array.range(interpolateResolution)
          .map(function (i) {
            var xValue = interpolateResolutionScale(i);
            return {
              x: xValue,
              y0: interpolateY(data, xValue, y0),
              y1: interpolateY(data, xValue, y1)
            };
          });

        options.xIndex = function (x) {
          return Math.ceil(interpolateResolutionScale.invert(x));
        };
        options.data = interpolatedData;
        options.x = function (d) { return d.x; };
        options.y0 = function (d) { return d.y0; };
        options.y1 = function (d) { return d.y1; };
      } else {
        options.xIndex = function (x) {
          return bisectorX(data, x);
        },
        options.data = data;
        options.x = x;
        options.y0 = y0;
        options.y1 = y1;
      }

      var test = function (testHeight){
        options.height = testHeight;
        options.width = aspect * testHeight;
        return fits(options);
      };

      // Use the bisection method to find the largest height label that fits.
      var height = bisection(minHeight, maxHeight, test, epsilon, maxIterations);

      // If there's not any position that works,
      // return an object that will scale the label down to nothing,
      // and indicate that the algorithm failed.
      if (height === null) {
        return {
          failed: true,
          numIterations: maxIterations,
          scale: 0,
          xTranslate: 0,
          yTranslate: 0,
          toString: toTransformString
        };
      }

      // Get the (x, y, width, height) for the largest height label that fits.
      options.justTest = false;
      var fit = fits(options);

      // Account for padding.
      var xInner = fit.x + fit.width / paddingFactorX * paddingLeft;
      var yInner = fit.y + fit.height / paddingFactorY * paddingTop;

      // Compute the scale and translate.
      fit.scale = height / boxHeight;
      fit.xTranslate = xInner - fit.scale * box.x;
      fit.yTranslate = yInner - fit.scale * box.y;

      // Expose the toString method, which generates a transform string.
      fit.toString = toTransformString;

      // Expose how many iterations the bisection method took.
      fit.numIterations = numIterations;

      return fit;
    }

    my.x = function(_) {
      if (arguments.length) {
        x = _;
        bisectorX = d3Array.bisector(x).right;
        return my;
      }
      return x;
    };

    my.y0 = function(_) {
      return arguments.length ? (y0 = _, my) : y0;
    };

    my.y1 = function(_) {
      return arguments.length ? (y1 = _, my) : y1;
    };

    my.area = function(area) {
      my.x(area.x()).y0(area.y0()).y1(area.y1());
    };

    my.minHeight = function(_) {
      return arguments.length ? (minHeight = +_, my) : minHeight;
    };

    my.epsilon = function(_) {
      return arguments.length ? (epsilon = +_, my) : epsilon;
    };

    my.maxIterations = function(_) {
      return arguments.length ? (maxIterations = +_, my) : maxIterations;
    };

    my.interpolate = function(_) {
      return arguments.length ? (interpolate = +_, my) : interpolate;
    };

    my.interpolateResolution = function(_) {
      return arguments.length ? (interpolateResolution = +_, my) : interpolateResolution;
    };

    my.paddingLeft = function(_) {
      return arguments.length ? (paddingLeft = +_, my) : paddingLeft;
    };

    my.paddingRight = function(_) {
      return arguments.length ? (paddingRight = +_, my) : paddingRight;
    };

    my.paddingTop = function(_) {
      return arguments.length ? (paddingTop = +_, my) : paddingTop;
    };

    my.paddingBottom = function(_) {
      return arguments.length ? (paddingBottom = +_, my) : paddingBottom;
    };

    my.paddingX = function(_) {
      my.paddingLeft(_).paddingRight(_);
    };

    my.paddingY = function(_) {
      my.paddingTop(_).paddingBottom(_);
    };

    my.padding = function(_) {
      my.paddingX(_).paddingY(_);
    };

    if (area) {
      my.area(area);
    }

    return my;
  };

  exports.areaLabel = areaLabel;

  Object.defineProperty(exports, '__esModule', { value: true });

}));