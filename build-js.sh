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
# required: minify
# npm:		sudo npm install -g minify
#

if [[ ! $(command -v minify) ]]; then
	echo 'You need to install minify first. Please install npm (sudo apt install npm -y) then fetch minify (sudo npm install -g minify)'
	exit 1
fi

if [[ $1 == "--sample-run" ]]; then
	# we do nothing here
	echo -n ''
else
	minify ${SCRIPT_DIR}/dist/OPACUserJS.js > ${SCRIPT_DIR}/dist/OPACUserJS.min.js
fi
echo "File built and outputted to ./dist folder"
