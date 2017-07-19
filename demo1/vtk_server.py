r"""
    This module is a VTK Web server application.
    The following command line illustrates how to use it::
        $ vtkpython .../vtk_server.py
    Any VTK Web executable script comes with a set of standard arguments that
    can be overriden if need be::
        --host localhost
             Interface on which the HTTP server will listen.
        --port 8080
             Port number on which the HTTP server will listen.
        --content /path-to-web-content/
             Directory that you want to serve as static web content.
             By default, this variable is empty which means that we rely on another server
             to deliver the static content and the current process only focuses on the
             WebSocket connectivity of clients.
        --authKey vtk-secret
             Secret key that should be provided by the client to allow it to make any
             WebSocket communication. The client will assume if none is given that the
             server expects "vtk-secret" as secret key.
"""

# import to process args
import sys
import os
# import vtk modules.
import vtk
from vtk.web import protocols, server
from vtk.web import wamp as vtk_wamp
try:
    import argparse
except ImportError:
    # since  Python 2.6 and earlier don't have argparse, we simply provide
    # the source for the same as _argparse and we use it instead.
    from vtk.util import _argparse as argparse
# =============================================================================
# Create custom ServerProtocol class to handle clients requests
# =============================================================================
class _WebCone(vtk_wamp.ServerProtocol):
    # Application configuration
    view    = None
    authKey = "vtkweb-secret"


r"""
    This module is a VTK Web server application.
    The following command line illustrates how to use it::
        $ vtkpython .../vtk_server.py
    Any VTK Web executable script comes with a set of standard arguments that
    can be overriden if need be::
        --host localhost
             Interface on which the HTTP server will listen.
        --port 8080
             Port number on which the HTTP server will listen.
        --content /path-to-web-content/
             Directory that you want to serve as static web content.
             By default, this variable is empty which means that we rely on another server
             to deliver the static content and the current process only focuses on the
             WebSocket connectivity of clients.
        --authKey vtk-secret
             Secret key that should be provided by the client to allow it to make any
             WebSocket communication. The client will assume if none is given that the
             server expects "vtk-secret" as secret key.
"""
# import to process args
import sys
import os
# import vtk modules.
import vtk
from vtk.web import protocols, server
from vtk.web import wamp as vtk_wamp
try:
    import argparse
except ImportError:
    # since  Python 2.6 and earlier don't have argparse, we simply provide
    # the source for the same as _argparse and we use it instead.
    from vtk.util import _argparse as argparse
# =============================================================================
# Create custom ServerProtocol class to handle clients requests
# =============================================================================
class _WebCone(vtk_wamp.ServerProtocol):
    # Application configuration
    view    = None
    authKey = "vtkweb-secret"
    def initialize(self):
        print "initialize"
        global renderer, renderWindow, renderWindowInteractor, cone, mapper, actor
        # Bring used components
        self.registerVtkWebProtocol(protocols.vtkWebMouseHandler())
        self.registerVtkWebProtocol(protocols.vtkWebViewPort())
        self.registerVtkWebProtocol(protocols.vtkWebViewPortImageDelivery())
        self.registerVtkWebProtocol(protocols.vtkWebViewPortGeometryDelivery())
        self.registerVtkWebProtocol(protocols.vtkWebFileBrowser('.', '.'))
        # Create default pipeline (Only once for all the session)
        if not _WebCone.view:
            # # VTK specific code
            # renderer = vtk.vtkRenderer()
            # renderWindow = vtk.vtkRenderWindow()
            # renderWindow.AddRenderer(renderer)
            # renderWindowInteractor = vtk.vtkRenderWindowInteractor()
            # renderWindowInteractor.SetRenderWindow(renderWindow)
            # renderWindowInteractor.GetInteractorStyle().SetCurrentStyleToTrackballCamera()
            # cone = vtk.vtkConeSource()
            # mapper = vtk.vtkPolyDataMapper()
            # actor = vtk.vtkActor()
            # mapper.SetInputConnection(cone.GetOutputPort())
            # actor.SetMapper(mapper)
            # renderer.AddActor(actor)
            # renderer.ResetCamera()
            # renderWindow.Render()

            # VCS specific code
            import vcs, cdms2, sys
            x = vcs.init()
            f = cdms2.open( vcs.sample_data+"/geos5-sample.nc" )
            v = f["uwnd"]
            dv3d = vcs.get3d_scalar()
            dv3d.ToggleClipping = ( 40, 360, -28, 90 )
            dv3d.YSlider = ( 0.0, vcs.off)
            dv3d.XSlider = ( 180.0, vcs.on )
            dv3d.ZSlider = ( 0.0, vcs.on )
            dv3d.ToggleVolumePlot = vcs.on
            dv3d.ToggleSurfacePlot = vcs.on
            dv3d.IsosurfaceValue = 31.0
            dv3d.ScaleOpacity = [0.0, 1.0]
            dv3d.BasemapOpacity = 0.5
            dv3d.Camera={ 'Position': (-161, -171, 279),
                          'ViewUp': (.29, 0.67, 0.68),
                          'FocalPoint': (146.7, 8.5, -28.6)  }
            dv3d.VerticalScaling = 5.0
            dv3d.ScaleColormap = [ -46.0, 48.0 ]
            dv3d.ScaleTransferFunction =  [ 12.0, 77.0 ]

            x.plot( v, dv3d )
            renderWindow = x.backend.renWin
            # VTK Web application specific
            _WebCone.view = renderWindow
            self.Application.GetObjectIdMap().SetActiveObject("VIEW", renderWindow)

# =============================================================================
# Main: Parse args and start server
# =============================================================================
if __name__ == "__main__":
    # Create argument parser
    parser = argparse.ArgumentParser(description="VTK/Web Cone web-application")
    # Add default arguments
    server.add_arguments(parser)
    # Extract arguments
    args = parser.parse_args()
    # Configure our current application
    _WebCone.authKey = args.authKey
    # Start server
    server.start_webserver(options=args, protocol=_WebCone)
