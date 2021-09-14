#!/bin/sh

#
# a script to build the scss files and output them as dist/Senux Project.css
#
# required: npm
# deb:		sudo apt install npm -y
# brew:		brew install npm
# winget:	winget install -e --id OpenJS.Nodejs
#
# required: sass
# npm:		sudo npm install -g sass
#

if ! hash sass 2>/dev/null; then
	echo 'You need to install sass first. Please install npm (sudo apt install npm -y) then fetch sass (sudo npm install -g sass)'
	exit 1
fi

sass ../src/css/build.scss:./OPACUserCSS.css --style compressed
echo "File built and outputted to dist folder (-1 level)"
