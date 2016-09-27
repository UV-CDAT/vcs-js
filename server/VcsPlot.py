
from PlotManager import PlotManager

import vcs
import sys
import gc

class VcsPlot(object):

    def __init__(self, *arg, **kw):
        self._width = kw.get('width', 800)
        self._height = kw.get('height', 600)
        self._canvas = vcs.init()
        self._plot = PlotManager(self._canvas)
        self._plot.graphics_method = vcs.getisofill()              # default
        self._plot.template = vcs.elements['template']['default']  # default

    def render(self, opts={}):
        self._width = opts.get('width', self._width)
        self._height = opts.get('height', self._height)

        if not self.getWindow():
            return
        self.getWindow().SetSize(self._width, self._height)
        self._canvas.backend.configureEvent(None, None)
        self._canvas.update()
        return True

    def setPlotMethod(self, plot_type, plot_method):
        method = vcs.getgraphicsmethod(plot_type, plot_method)
        if method:
            self._plot.graphics_method = method
            return True
        else:
            return False

    def setTemplate(self, template):
        if template in vcs.elements['template']:
            self._plot.template = vcs.elements['template'][template]
            return True
        else:
            return False

    def loadVariable(self, var, opts={}):
        """Load a variable into the visualization.

        Returns success or failure.
        """
        self._plot.variables = var
        return True

    def getWindow(self):
        return self._canvas.backend.renWin

    def close(self):
        print 'VcsPlot.close(): %s'%self._canvas
        print 'refcount: %s'%str(sys.getrefcount(self.getWindow()))
        self._canvas.close()
