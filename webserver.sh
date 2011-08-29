#!/bin/sh

echo "\nVisit http://localhost:8000/demo.svg\n"

http-server -p 8000 || python -m SimpleHTTPServer 8000
