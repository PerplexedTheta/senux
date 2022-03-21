#!/usr/bin/env bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

if [[ ! $(command -v jshint) ]]; then
	echo 'You need to install jshint first. Please install npm (sudo apt install npm -y) then fetch jshint (sudo npm install -g jshint)'
	exit 1
fi
if [[ ! $(command -v minify) ]]; then
	echo 'You need to install minify first. Please install npm (sudo apt install npm -y) then fetch minify (sudo npm install -g minify)'
	exit 1
fi

if [[ $1 == "--init" ]]; then
	cp ${SCRIPT_DIR}/dist/customisations.sample.js ${SCRIPT_DIR}/customisations.js
	echo "Copied sample files to "${SCRIPT_DIR}
	echo "Now, run "${SCRIPT_DIR}"/build-js.sh --build"
elif [[ $1 == "--build" ]]; then
	jshint --verbose ${SCRIPT_DIR}/customisations.js
	cp ${SCRIPT_DIR}/customisations.js ${SCRIPT_DIR}/dist/OPACUserJS.js
	echo "File built and outputted to ./dist/OPACUserJS.js"
elif [[ $1 == "--minify" ]]; then
	minify ${SCRIPT_DIR}/dist/OPACUserJS.js > ${SCRIPT_DIR}/dist/OPACUserJS.min.js
	echo "File built and outputted to ./dist/OPACUserJS.min.js"
else
	echo "a script to build the js files and output them as dist/Senux Project.js"
	echo ""
	echo "required: npm"
	echo "deb:		sudo apt install npm -y"
	echo "brew:		brew install npm"
	echo "winget:		winget install -e --id OpenJS.Nodejs"
	echo ""
	echo "required: jshint"
	echo "npm:		sudo npm install -g jshint"
	echo ""
	echo "required: minify"
	echo "npm:		sudo npm install -g minify"
	echo ""
	echo ""
	echo "available arguments:"
	echo "--init		run with this flag to prep this repository clone for a build"
	echo "--build		run with this flag to build the js to 'dist'"
	echo "--minify	run with this flag to build the minified js to 'dist'"
fi
