#!/usr/bin/env bash
#
# Part of the Senux Project
# Copyright 2021-2022 Jake Deery
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

## vars
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

## check we have jslint & minify installed
if [[ ! $(command -v jshint) ]]; then
	echo 'You need to install jshint first. Please install npm (sudo apt install npm -y) then fetch jshint (sudo npm install -g jshint)'
	exit 1
fi
if [[ ! $(command -v minify) ]]; then
	echo 'You need to install minify first. Please install npm (sudo apt install npm -y) then fetch minify (sudo npm install -g minify)'
	exit 1
fi

## die if multiple flags passed
if [[ ${#} > 1 ]]; then
	echo "Please only pass 1 command-line argument"
	exit 1
fi

## begin the main magic
if [[ $1 == "--init" ]]; then
	# copy the sample file to the root of the repo
	cp ${SCRIPT_DIR}/src/js/customisations.sample.js ${SCRIPT_DIR}/customisations.js
	# tell the user what to do
	echo "Copied sample files to "${SCRIPT_DIR}
	echo "Now, run "${SCRIPT_DIR}"/build-js.sh --build"
elif [[ $1 == "--build" ]]; then
	# run the linter -- it will output to STDOUT if something is wrong
	jshint --verbose ${SCRIPT_DIR}/customisations.js
	# tell the user where to look
	cp ${SCRIPT_DIR}/customisations.js ${SCRIPT_DIR}/dist/OPACUserJS.js
	echo "File built and outputted to ./dist/OPACUserJS.js"
elif [[ $1 == "--minify" ]]; then
	# run the linter -- it will output to STDOUT if something is wrong
	jshint --verbose ${SCRIPT_DIR}/customisations.js
	# minify the code
	minify ${SCRIPT_DIR}/dist/OPACUserJS.js > ${SCRIPT_DIR}/dist/OPACUserJS.min.js
	# tell the user where to look
	echo "File built and outputted to ./dist/OPACUserJS.min.js"
elif [[ ${#} < 1 || $1 == "--help" ]]; then
	echo "a script to build the js files and output them as dist/OPACUserJS.js"
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
	echo "--help		show this message"
	echo "--init		run with this flag to prep this repository clone for a build"
	echo "--build		run with this flag to build the js to 'dist'"
	echo "--minify	run with this flag to build the minified js to 'dist'"
fi
