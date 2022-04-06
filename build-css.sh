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

## check we have sass installed
if [[ ! $(command -v sass) ]]; then
	echo 'You need to install sass first. Please install npm (sudo apt install npm -y) then fetch sass (sudo npm install -g sass)'
	exit 1
fi

## die if multiple flags passed
if [[ ${#} > 1 ]]; then
	echo "Please only pass 1 command-line argument"
	exit 1
fi

## begin the main magic
if [[ $1 == "--init" ]]; then
	# copy the sample files to the root of the repo
	cp ${SCRIPT_DIR}/src/css/variables.sample.scss ${SCRIPT_DIR}/variables.scss
	cp ${SCRIPT_DIR}/src/css/customisations.sample.scss ${SCRIPT_DIR}/customisations.scss
	# tell the user what to do
	echo "Copied sample files to "${SCRIPT_DIR}
	echo "Now, run "${SCRIPT_DIR}"/build-css.sh --build"
elif [[ $1 == "--build" ]]; then
	# run the sass compiler -- it will output to STDOUT if something is wrong
	sass ${SCRIPT_DIR}/src/css/build.scss:${SCRIPT_DIR}/dist/OPACUserCSS.css --style expanded
	# tell the user where to look
	echo "File built and outputted to ./dist/OPACUserCSS.css"
elif [[ $1 == "--minify" ]]; then
	# run the sass compiler -- it will output to STDOUT
	sass ${SCRIPT_DIR}/src/css/build.scss:${SCRIPT_DIR}/dist/OPACUserCSS.min.css --style compressed
	# tell the user where to look
	echo "File built and outputted to ./dist/OPACUserCSS.min.css"
elif [[ ${#} < 1 || $1 == "--help" ]]; then
	# log the help message
	echo "a script to build the scss files and output them as dist/OPACUserCSS.css"
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
	echo "--help		show this message"
	echo "--init		run with this flag to prep this repository clone for a build"
	echo "--build		run with this flag to build the css to 'dist'"
	echo "--minify	run with this flag to build the minified css to 'dist'"
fi
