#!/usr/bin/env bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

if [[ ! $(command -v sass) ]]; then
	echo 'You need to install sass first. Please install npm (sudo apt install npm -y) then fetch sass (sudo npm install -g sass)'
	exit 1
fi

if [[ $1 == "--init" ]]; then
	cp ${SCRIPT_DIR}/dist/variables.sample.scss ${SCRIPT_DIR}/variables.scss
	cp ${SCRIPT_DIR}/dist/customisations.sample.scss ${SCRIPT_DIR}/customisations.scss
	echo "Copied sample files to "${SCRIPT_DIR}
	echo "Now, run "${SCRIPT_DIR}"/build-css.sh --build"
elif [[ $1 == "--build" ]]; then
	sass ${SCRIPT_DIR}/src/css/build.scss:${SCRIPT_DIR}/dist/OPACUserCSS.css
	echo "File built and outputted to ./dist/OPACUserCSS.css"
elif [[ $1 == "--minify" ]]; then
	sass ${SCRIPT_DIR}/src/css/build.scss:${SCRIPT_DIR}/dist/OPACUserCSS.min.css --style compressed
	echo "File built and outputted to ./dist/OPACUserCSS.min.css"
else
	echo "a script to build the scss files and output them as dist/Senux Project.css"
	echo ""
	echo "required: npm"
	echo "deb:		sudo apt install npm -y"
	echo "brew:		brew install npm"
	echo "winget:		winget install -e --id OpenJS.Nodejs"
	echo ""
	echo "required: sass"
	echo "npm:		sudo npm install -g sass"
	echo ""
	echo ""
	echo "available arguments:"
	echo "--init		run with this flag to prep this repository clone for a build"
	echo "--build		run with this flag to build the css to 'dist'"
	echo "--minify	run with this flag to build the minified css to 'dist'"
fi
