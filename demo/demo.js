var sessionPromise;

(function () {

  var variables = {
    "clt": {"id": "clt", "derivation": [{"type": "file", "uri": "clt.nc"}, {"parents": [0], "operation": {"type": "get", "id": "clt"}, "type": "variable"}]},
    "u": {"id": "u", "derivation": [{"type": "file", "uri": "clt.nc"}, {"parents": [0], "operation": {"type": "get", "id": "u"}, "type": "variable"}]},
    "v": {"id": "v", "derivation": [{"type": "file", "uri": "clt.nc"}, {"parents": [0], "operation": {"type": "get", "id": "v"}, "type": "variable"}]}
  }

  var boxfill = {"fillareaopacity": [], "datawc_timeunits": "days since 2000", "projection": "linear", "xticlabels1": "*", "xticlabels2": "*", "ymtics1": "", "ymtics2": "", "datawc_x1": 1e+20, "datawc_x2": 1e+20, "boxfill_type": "linear", "xmtics1": "", "fillareacolors": null, "xmtics2": "", "color_2": 255, "datawc_calendar": 135441, "fillareaindices": [1], "color_1": 0, "colormap": null, "missing": [0.0, 0.0, 0.0, 100.0], "xaxisconvert": "linear", "level_2": 1e+20, "ext_1": false, "ext_2": false, "datawc_y2": 1e+20, "datawc_y1": 1e+20, "yaxisconvert": "linear", "legend": null, "color_2": 255, "datawc_calendar": 135441, "fillareaindices": [1], "color_1": 0, "colormap": null, "missing": [0.0, 0.0, 0.0, 100.0], "xaxisconvert": "linear", "level_2": 1e+20, "ext_1": false, "ext_2": false, "datawc_y2": 1e+20, "datawc_y1": 1e+20, "yaxisconvert": "linear", "legend": null, "name": "__boxfill_717978942019492", "yticlabels1": "*", "yticlabels2": "*", "fillareastyle": "solid", "levels": [1e+20, 1e+20], "g_name": "Gfb", "level_1": 1e+20};
  var vector = {"datawc_timeunits": "days since 2000", "projection": "linear", "reference": 1e+20, "xticlabels1": "*", "xticlabels2": "*", "linecolor": null, "ymtics1": "", "ymtics2": "", "linewidth": null, "datawc_x1": 1e+20, "datawc_x2": 1e+20, "xmtics1": "", "xmtics2": "", "datawc_calendar": 135441, "alignment": "center", "type": "arrows", "colormap": null, "xaxisconvert": "linear", "scale": 1.0, "linetype": null, "datawc_y2": 1e+20, "datawc_y1": 1e+20, "yaxisconvert": "linear", "name": "vector_full", "yticlabels1": "*", "yticlabels2": "*", "scalerange": [0.1, 1.0], "scaleoptions": ["off", "constant", "normalize", "linear", "constantNNormalize", "constantNLinear"], "g_name": "Gv", "scaletype": "constantNNormalize"};
  var vector_subview = {"datawc_timeunits": "days since 2000", "projection": "linear", "reference": 1e+20, "xticlabels1": "*", "xticlabels2": "*", "linecolor": null, "ymtics1": "", "ymtics2": "", "linewidth": null, "datawc_x1": 60, "datawc_x2": 180, "xmtics1": "", "xmtics2": "", "datawc_calendar": 135441, "alignment": "center", "type": "arrows", "colormap": null, "xaxisconvert": "linear", "scale": 1.0, "linetype": null, "datawc_y2": 90, "datawc_y1": 0, "yaxisconvert": "linear", "name": "subset_vector", "yticlabels1": "*", "yticlabels2": "*", "scalerange": [0.1, 1.0], "scaleoptions": ["off", "constant", "normalize", "linear", "constantNNormalize", "constantNLinear"], "g_name": "Gv", "scaletype": "constantNNormalize"};
  var isofill = {"g_name": "Gfi"};
  var dv3d = {ScaleColormap: null, ScaleOpacity: null, BasemapOpacity: null, Camera: "{}", ZSlider: null, YSlider: null, ToggleVolumePlot: null, PointSize: null, Configure: null, XSlider: null, SliceThickness: null, axes: "xyz", plot_attributes: {name: "3d_scalar", template: "default"}, IsosurfaceValue: null, VerticalScaling: null, ChooseColormap: null, ToggleSurfacePlot: null, Colorbar: null, ncores: 8, ScaleTransferFunction: null, name: "default", ToggleClipping: null, Animation: null, g_name: "3d_scalar" };

  // create the session
  var b = document.getElementById('vcs-boxfill');
  var canvas = vcs.init(b);

  b.addEventListener('vcsPlotStart', function() {
    console.log("Began plotting boxfill");
  });

  b.addEventListener('vcsPlotEnd', function() {
    console.log("Finished plotting boxfill");
  });

  var dataSpec = variables.clt;
  canvas.plot(dataSpec, boxfill, 'no_legend').then(function(){
    console.log("Promise completed.");
  });

  var canvas2 = vcs.init(document.getElementById('plotly-isofill'), 'client');
  canvas2.plot(dataSpec, isofill);

  var canvas3 = vcs.init(document.getElementById('vcs-vector'));
    // generate the plot when all of the promises resolve
  var dataSpec = [variables.u, variables.v];
  canvas3.plot(dataSpec, vector_subview);

  var canvas4 = vcs.init(document.getElementById('vcs-vector-subset'));
  var dataSpec = variables.clt;
  canvas4.plot(dataSpec, dv3d);

})();