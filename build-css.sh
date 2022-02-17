#!/usr/bin/env bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

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

if [[ ! $(command -v sass) ]]; then
	echo 'You need to install sass first. Please install npm (sudo apt install npm -y) then fetch sass (sudo npm install -g sass)'
	exit 1
fi

if [[ $1 == "--sample-run" ]]; then
	sass ${SCRIPT_DIR}/src/css/build.sample.scss:dist/OPACUserCSS.sample.css
else
	sass ${SCRIPT_DIR}/src/css/build.scss:dist/OPACUserCSS.css
	sass ${SCRIPT_DIR}/src/css/build.scss:dist/OPACUserCSS.min.css --style compressed
fi
echo "File built and outputted to ./dist folder"
