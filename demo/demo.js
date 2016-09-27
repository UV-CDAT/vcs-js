var sessionPromise;

/**
 * Returns a promise object to the variables stored in a file
 */
function get_variables(fileName) {
  // get the promise for the data object for the variables
  return sessionPromise.then(function (session) {
    return session.files();
  }).then(function (files) {
    // get the file object for a netcdf variable
      var nc = files.filter(function (f) {
        var re = new RegExp(fileName);
        return f.fileName.match(re);
      })[0];

    if (!nc) {
      console.log('No netcdf variables found');
      return;
    }

    // get a list of variables
    return nc.variables();
  });
}

/**
 * Prints the result from get_variables to the console.
 * @param {string? filename An absolute path to a netcdf file
 */
function print_variables (filename) {
    var fileVars = get_variables(filename);
    var vars, axes, shape, axisList, lonLat, logString, boundsString,
        gridType;
    var v, i, al;
    fileVars.then(
        function (varsAxes) {
            // variables
            vars = varsAxes[0];
            for (v in vars) {
                // shape of the variable
                shape = '(' + vars[v].shape[0];
                for (i = 1; i < vars[v].shape.length; ++i) {
                    shape += (',' + vars[v].shape[i]);
                }
                shape += ')';
                // axes for the variable
                al = vars[v].axisList;
                axisList = '(' + al[0];
                for (i = 1; i < al.length; ++i) {
                    axisList += (', ' + al[i]);
                }
                axisList += ')';
                // bounds are received for longitude and latitude
                boundsString = '';
                if (vars[v].bounds) {
                    boundsString += ': (' + vars[v].bounds[0] + ', ' +
                        vars[v].bounds[1] + ')';
                }
                // longitude, latitude for the variable
                // these are different than the axes for the curvilinear or
                // generic grids
                lonLat = null;
                if (vars[v].lonLat) {
                    lonLat = '(' + vars[v].lonLat[0] + ', ' +
                        vars[v].lonLat[1] + ')';
                }
                logString = v + shape + '[' + vars[v].name + ', ' +
                    vars[v].units + boundsString + ']' + ': ' + axisList;
                if (lonLat) {
                    logString += (', ' + lonLat);
                }
                if (vars[v].gridType) {
                    logString += (', ' + vars[v].gridType);
                }
                console.log(logString);
            }
            // all axes in the file
            axes = varsAxes[1];
            for (v in axes) {
                shape = '(' + axes[v].shape[0];
                for (i = 1; i < axes[v].shape.length; ++i) {
                    shape += (',' + axes[v].shape[i]);
                }
                shape += ')';
                console.log(v + shape + '[' + axes[v].name + ', ' +
                            axes[v].units + ': (' +
                            axes[v].data[0] + ', ' +
                            axes[v].data[axes[v].data.length - 1] + ')]');
            }
        },
        function (reason) {
            console.log(reason);
        }
    );
}

$(function () {    
  // Ordinarily this would be a URL string of a rest
  // interface for generating a new server side connection.
  // Here we short circuit that code to generate a simulated
  // session connecting to pregenerated files through
  // Girder's rest interface.
  var url = 'ws://localhost:9000/ws';

  // create the session
  sessionPromise = vcs.createSession(url);

  sessionPromise.catch(() => {
    console.log('Could not connect to ' + url);
  });

  var canvasPromise = sessionPromise.then(function (session) {
    return session.init(document.getElementById('vcs-isofill'));
  });
    
  // generate the plot when all of the promises resolve
  canvasPromise.then(function (canvas) {
    var dataSpec = {
      file: 'coads_climatology.nc',
      variable: 'SST',
    };
    canvas.plot(dataSpec, 'no_legend', 'isofill', 'robinson', 'server');
  });
  
  // generate another plot using client side rendering
  // we don't have an api for getting data yet, so we'll
  // just use an ajax request to data.kitware.com
  var cltPromise = $.ajax('https://data.kitware.com/api/v1/file/576aa3c08d777f1ecd6701ae/download');
  var latPromise = $.ajax('https://data.kitware.com/api/v1/item/576aa3c08d777f1ecd6701b0/download');
  var lonPromise = $.ajax('https://data.kitware.com/api/v1/item/576aa3c08d777f1ecd6701b9/download');
  var canvasPromise2 = sessionPromise.then(function (session) {
    return session.init(document.getElementById('plotly-isofill'));
  });


  // This is all very rough, likely much of this should be wrapped inside the api
  Promise.all([
    canvasPromise2, cltPromise, latPromise, lonPromise
  ]).then(function (arg) {
    var canvas = arg[0];
    var clt = arg[1];
    var lat = arg[2];
    var lon = arg[3];
    var timestep = 0;

    var data = {
      x: lon.data,
      y: lat.data
    };

    function draw() {
      data.z = ndarray(clt.data, clt.shape).pick(timestep, null, null);
      canvas.plot(data, 'default', 'isofill', 'quick', 'client');
      timestep = (timestep + 1) % clt.shape[0];
    }

    // call again for the next time step
    draw();
  });

  var canvasPromise3 = sessionPromise.then(function (session) {
    return session.init(document.getElementById('vcs-vector'));
  });
    
    // generate the plot when all of the promises resolve
  canvasPromise3.then(function (canvas) {
    var dataSpec = {
      file: 'coads_climatology.nc',
      variable: ['UWND', 'VWND'],
    };
    canvas.plot(dataSpec, 'default', 'vector', 'default', 'server');
  });

  var canvasPromise4 = sessionPromise.then(function (session) {
    return session.init(document.getElementById('vcs-vector-subset'));
  });
    
    // generate the plot when all of the promises resolve
  canvasPromise4.then(function (canvas) {
    var dataSpec = {
      file: 'coads_climatology.nc',
      variable: ['UWND', 'VWND'],
      subset: {'COADSX': [60, 180], 'COADSY': [0, 90]}
    };
    canvas.plot(dataSpec, 'default', 'vector', 'default', 'server');
  });

  $(window).on('beforeunload', function() {
    canvasPromise.then((canvas) => canvas.close());
    canvasPromise2.then((canvas) => canvas.close());
    canvasPromise3.then((canvas) => canvas.close());
    canvasPromise4.then((canvas) => canvas.close());        
    return 'Your own message goes here...';
  });
});

