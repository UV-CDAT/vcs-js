"""
    This module is a VTK Web server application.
    The following command line illustrate how to use it::

        $ vtkpython .../server.py

    Any VTK Web executable script come with a set of standard arguments that
    can be overriden if need be::
        --host localhost
             Interface on which the HTTP server will listen on.

        --port 8080
             Port number on which the HTTP server will listen to.

        --content /path-to-web-content/
             Directory that you want to server as static web content.
             By default, this variable is empty which mean that we rely on another server
             to deliver the static content and the current process only focus on the
             WebSocket connectivity of clients.

        --authKey vtk-secret
             Secret key that should be provided by the client to allow it to make any
             WebSocket communication. The client will assume if none is given that the
             server expect "vtk-secret" as secret key.

        --data-dir /path/to/data
            Root directory to serve as data.
"""

import argparse
from autobahn.wamp import register

# import vtk modules.
import vtk
from vtk.web import protocols, server
from vtk.web import wamp as vtk_wamp

# import protocols
from FileLoader import FileLoader
from Visualizer import Visualizer

class _VCSApp(vtk_wamp.ServerProtocol):

    # Application configuration
    rootDir = '.'
    authKey = "vtkweb-secret"

    def initialize(self):
        self.registerVtkWebProtocol(protocols.vtkWebMouseHandler())
        self.registerVtkWebProtocol(protocols.vtkWebViewPort())
        self.registerVtkWebProtocol(protocols.vtkWebViewPortImageDelivery())
        self.registerVtkWebProtocol(protocols.vtkWebFileBrowser(self.rootDir, 'Home'))
        self.registerVtkWebProtocol(FileLoader())
        self.registerVtkWebProtocol(Visualizer())

if __name__ == "__main__":
    # Create argument parser
    parser = argparse.ArgumentParser(description="Demo VCS application")

    # Add default arguments
    server.add_arguments(parser)
    parser.add_argument("--data-dir", help="Base directory to list", dest="basedir", default=".")

    # Exctract arguments
    args = parser.parse_args()

    # Configure our current application
    _VCSApp.authKey = args.authKey
    _VCSApp.rootDir = args.basedir

    # Start server
    server.start_webserver(options=args, protocol=_VCSApp)
