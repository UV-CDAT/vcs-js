"""This module exposes methods for finding and creating visualizations."""

from autobahn.wamp import register
# import vtk modules.
import vtk
from vtk.web import protocols, server
# vcs modules
import vcs

from FileLoader import FileLoader
from VcsPlot import VcsPlot

class Visualizer(protocols.vtkWebProtocol):

    _active = {}

    @register('cdat.vcs.templates')
    def list_templates(self):
        """Return a list of plot templates."""
        return _templates

    @register('cdat.vcs.methods')
    def list_methods(self):
        """Return a list of plot types and methods."""
        return _methods

    @register('cdat.view.variable')
    def variable(self, plot, variable):
        """Add or modify the variables used in the plot."""
        if plot not in self._active:
            return False
        all_vars = []
        for obj in variable:
            f = FileLoader().get_reader(obj['file'])
            all_vars.append(
                f[obj['name']]
            )
        return self._active[plot].loadVariable(all_vars)

    @register('cdat.view.template')
    def template(self, plot, template):
        """Change the given plot's template."""
        if plot in self._active:
            return self._active[plot].setTemplate(template)
        return False

    @register('cdat.view.create')
    def create(self, variable, template, methodtype, methodname, opts={}):
        vis = VcsPlot()
        vis.setPlotMethod(
            methodtype, methodname
        )
        vis.setTemplate(template)
        all_vars = []
        for obj in variable:
            f = FileLoader().get_reader(obj['file'])
            var = f[obj['name']]
            if ('subset' in obj):
                kargs = obj['subset']
                var = var(**kargs)
            all_vars.append(var)
        vis.loadVariable(all_vars)
        window = vis.getWindow()
        id = self.getGlobalId(window)
        self._active[id] = vis
        return id

    @register('cdat.view.update')
    def render_view(self, id, opts={}):
        if id in self._active:
            return self._active[id].render(opts)
        return False

    @register('cdat.view.close')
    def remove_view(self, id):
        print 'close window %s'%id
        vis = self._active.pop(id)
        if vis:
            vis.close()
            del vis
            return True
        return False

    @classmethod
    def detect_nvars(cls, g_type, g_method, g_obj):
        """Try to return the number of variables required for the plot method.

        Returns the number of variables required by the plot type.
        This isn't really exposed by vcs, so this is written by following this
        insanity:
        https://github.com/UV-CDAT/uvcdat/blob/master/Packages/vcs/Lib/Canvas.py#L251

        The reality is that this api will need to be more complicated in the
        future to account some methods (like meshfill) that can take one or two
        variables depending on the grid.
        """
        g_type = g_type.lower()

        # first check for g_naslabs
        if hasattr(g_obj, 'g_nslabs'):
            return g_obj.g_nslabs

        # then check methods that require 2 variables
        if g_type in _2d_methods:
            return 2

        # meshfill takes one or two, but there are extra requirements that we will
        # have to pass through the api once they are understood
        if g_type == 'meshfill':
            return 1

        # low level primitives should probably not happen
        if g_type in _primitives:
            return 0

        # 1d takes 2 variables
        if g_type == '1d':
            return 2

        # otherwise assume 1
        return 1


# initialize the list of templates and graphics methods
_ = vcs.init()
_templates = sorted(vcs.elements['template'].keys())
_methods = {}
_2d_methods = (
    'scatter', 'vector', 'xvsy', 'stream', 'glyph', '3d_vector', '3d_dual_scalar'
)
_primitives = (
    'line', 'marker', 'fillarea', 'text'
)
for t in vcs.graphicsmethodlist():
    _methods[t] = {}
    for m in vcs.elements[t].keys():
        _methods[t][m] = {
            'nvars': Visualizer.detect_nvars(t, m, vcs.elements[t][m])
        }
