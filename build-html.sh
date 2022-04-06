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

## die if multiple flags passed
if [[ ${#} > 1 ]]; then
	echo "Please only pass 1 command-line argument"
	exit 1
fi

## begin the main magic
if [[ $1 == "--init" ]]; then
	# copy the sample files to the dist folder
	cp ${SCRIPT_DIR}/src/html/ArticleRequestDisclaimerText.sample.html ${SCRIPT_DIR}/dist/ArticleRequestDisclaimerText.html
	cp ${SCRIPT_DIR}/src/html/OPACCredits.sample.html ${SCRIPT_DIR}/dist/OPACCredits.html
	cp ${SCRIPT_DIR}/src/html/OPACCustomSearch.sample.html ${SCRIPT_DIR}/dist/OPACCustomSearch.html
	cp ${SCRIPT_DIR}/src/html/OPACHeader.sample.html ${SCRIPT_DIR}/dist/OPACHeader.html
	cp ${SCRIPT_DIR}/src/html/OPACLoginInstructions.sample.html ${SCRIPT_DIR}/dist/OPACLoginInstructions.html
	cp ${SCRIPT_DIR}/src/html/OPACMaintenanceNotice.sample.html ${SCRIPT_DIR}/dist/OPACMaintenanceNotice.html
	cp ${SCRIPT_DIR}/src/html/OPACMainUserBlock.sample.html ${SCRIPT_DIR}/dist/OPACMainUserBlock.html
	cp ${SCRIPT_DIR}/src/html/OPACMySummaryHTML.sample.html ${SCRIPT_DIR}/dist/OPACMySummaryHTML.html
	cp ${SCRIPT_DIR}/src/html/OPACMySummaryNote.sample.html ${SCRIPT_DIR}/dist/OPACMySummaryNote.html
	cp ${SCRIPT_DIR}/src/html/OPACNav.sample.html ${SCRIPT_DIR}/dist/OPACNav.html
	cp ${SCRIPT_DIR}/src/html/OPACNavBottom.sample.html ${SCRIPT_DIR}/dist/OPACNavBottom.html
	cp ${SCRIPT_DIR}/src/html/OPACNavRight.sample.html ${SCRIPT_DIR}/dist/OPACNavRight.html
	cp ${SCRIPT_DIR}/src/html/OPACNoResultsFound.sample.html ${SCRIPT_DIR}/dist/OPACNoResultsFound.html
	cp ${SCRIPT_DIR}/src/html/OPACResultsSidebar.sample.html ${SCRIPT_DIR}/dist/OPACResultsSidebar.html
	cp ${SCRIPT_DIR}/src/html/OPACSearchForTitleIn.sample.html ${SCRIPT_DIR}/dist/OPACSearchForTitleIn.html
	cp ${SCRIPT_DIR}/src/html/OPACSuggestionInstructions.sample.html ${SCRIPT_DIR}/dist/OPACSuggestionInstructions.html
	cp ${SCRIPT_DIR}/src/html/PatronSelfRegistrationAdditionalInstructions.sample.html ${SCRIPT_DIR}/dist/PatronSelfRegistrationAdditionalInstructions.html
	cp ${SCRIPT_DIR}/src/html/RestrictedPageContent.sample.html ${SCRIPT_DIR}/dist/RestrictedPageContent.html
	# tell the user what to do
	echo "Copied sample files to "${SCRIPT_DIR}"/dist"
elif [[ ${#} < 1 || $1 == "--help" ]]; then
	# log the help message
	echo "a script to prep the HTML files and copy them to dist"
	echo ""
	echo "available arguments:"
	echo "--help		show this message"
	echo "--init		run with this flag to prep this repository clone"
fi
