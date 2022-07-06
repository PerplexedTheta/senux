//
// Part of the Senux Project
// Copyright 2021-2022 Jake Deery
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

/*!
  WELCOME TO SENUX! VER. 2111-05 -- PLEASE READ CAREFULLY!

  THIS FILE EXISTS AS A TEMPLATE FOR YOU TO COPY INTO THE OPACUSERJS AND
  CUSTOMISE AS YOU SEE FIT. PLEASE DISREGARD THE LICENCE ABOVE - THIS EXISTS
  ONLY TO PROTECT THE FILE IN THE GIT REPOSITORY. COPY EVERYTHING FROM LINE 37
  ONWARDS INTO OPACUSERJS AND HAVE AT IT!

  HAVE A GOOD DAY - BUENOS DIAS - GUTEN TAG - BONNE JOURNEE - BUONA GIORNATA
*/

/*!
  -----------------------------------------
  PLACE YOUR OPACUSERJS CUSTOMISATIONS HERE
  -----------------------------------------
*/

// you may proceed

document.addEventListener('DOMContentLoaded', function(event) {
	// Insert your user customisations for JavaScript below this line
	// Some useful custom values and functions have been included for you

	// vars
	var baseLang = $('html').attr('lang');
	var baseHost = window.location.hostname;
	var baseUri = window.location.pathname + window.location.search + window.location.hash;

	//
	// gdpr
	showGdprBanner();


	//
	// accessibility

	// add link labels
	externalLinkAriaLabeller();


	//
	// site-wide logic (MAIN FUNC)

	// nav menus
	$('#cart-list-nav').html('<!--<li class=\"nav-item\"><a href=\"\/cgi-bin\/koha\/opac-main.pl\" class=\"nav-link\" title=\"Homepage\" id=\"hmpmenu\"><i class=\"fa fa-home fa-icon-white\"><\/i><\/a><\/li>--><li class=\"nav-item\"><a href=\"#openFolder\" class=\"nav-link\" title=\"Folder\" id=\"cartmenu\" role=\"button\"><i id=\"carticon\" class=\"fa fa-folder-open fa-icon-black\"><\/i> <span class=\"cartlabel\">Folder<\/span><\/a><\/li><li class=\"nav-item\"><a href=\"\/cgi-bin\/koha\/opac-shelves.pl?op=list&public=1\" class=\"nav-link\" title=\"Lists\" id=\"listsmenu\" role=\"button\"><i id=\"listsicon\" class=\"fa fa-list fa-icon-black\"><\/i> <span class=\"listslabel\">Lists<\/span><\/a><\/li><li class=\"nav-item\"><a href=\"\/cgi-bin\/koha\/opac-main.pl?news_id=2\" class=\"nav-link\" title=\"Help\" id=\"helpmenu\"><i class=\"fa fa-info-circle fa-icon-white\"><\/i> <span class=\"custlabel1\">Help<\/span><\/a><\/li>');

	// relabel login link
	if($('#user-menu').hasClass('dropdown-toggle') == false) $('.userlabel').text('Log in');

	// remove cart notice
	$('#cartDetails').remove();

	// set searchbar text label
	$('#opac-main-search label').text('Catalogue Search');

	// login modal - shibboleth
	// comment this out if you don't use saml
	/*
	$('#opac-auth > h2:contains("Shibboleth Login")').text('Academic student or staff?');
	$('#opac-auth > p:contains("Log in using a Shibboleth account.")').html('<a href=\"\/Shibboleth.sso\/Login?target=https:\/\/' + window.location.hostname + window.location.pathname + window.location.search + '\" class=\"btn btn-primary\">Go to Institutional login &raquo;<\/a>');
	$('#opac-auth > h2:contains("Local login")').text('Academic partner or public user?');
	$('#opac-auth > p:contains("If you do not have a Shibboleth account")').text('If you do not have an Institution account, then you may login below.');
	$('#loginModal').html('<div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><h2 class=\"modal-title\" id=\"modalLoginLabel\">Log in to your account<\/h2><button type=\"button\" class=\"closebtn\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">\u00D7<\/span><\/button><\/div><div id=\"modalAuth\" class=\"modal-body\"><h3>Academic student or staff?<\/h3><p><a href=\"\/Shibboleth.sso\/Login?target=https:\/\/' + window.location.hostname + window.location.pathname + window.location.search + '\" class=\"btn btn-primary\">Go to Institutional login &raquo;<\/a><\/p><h3>Academic partner or public user?<\/h3><p><a href=\"\/cgi-bin\/koha\/opac-user.pl\" class=\"btn btn-primary\">Go to local Koha login &raquo;<\/a><\/p><\/div><\/div><\/div>');
	*/

	// relabel & swap go search button type
	$('#searchsubmit').html('Go \u00BB');
	//$('#searchsubmit').toggleClass('btn-primary btn-default');

	// disable borrower contact method dropdown if it is readonly
	$('select[name="borrower_primary_contact_method"]').removeAttr('readonly');
	$('select[name="borrower_primary_contact_method"]').attr('disabled', 'disabled');

	// hide search facets under menus
	facetAccordeons();

	// add publication date range to facets
	facetPublicationDateRange();

	// add a link to clear all search facets
	facetClearAllHandler();

	// explorit masthead pulldown handler
	//mastheadEventHandler();
	//searchCatalogue();

	// wiki autocompletion api
	wikiAutocomplete();

	// add basket link handler
	basketLinkHandler();

	// reservation link handler
	reservationLinkHandler();

	// rename 'save records'
	renameSaveRecord();

	// add authority record alt text & tooltips
	$('a.authlink').attr('alt','View authority record');
	$('a.authlink').attr('title','View authority record');

	// remove ics links
	//$('#buttons-ics').remove();

	// remove 'powered by koha' regardless of syspref
	$('#koha_url').remove();


	//
	// page-specific logic


	//
	// mobilc-specific logic

});


//
// function to show gdpr banner
function showGdprBanner() {
	if(localStorage.getItem('-senux-gdrp-dismissed') == null) $('body').prepend('<div id=\"-gdpr-banner\"><p>This website uses cookies to ensure you get the best experience on our website <a id=\"-gdpr-moreinfo\" href=\"https:\/\/gdpr-info.eu\/\" target=\"_blank\">More info \u00BB<\/a><button id=\"-gdpr-dismiss\" class=\"btn btn-primary\">Dismiss<\/button><\/p><\/div>');
	$('#-gdpr-dismiss, #-gdpr-moreinfo').click(function() {
		localStorage.setItem('-senux-gdrp-dismissed', 'true');
		$('#-gdpr-banner').remove();
	});
	return;
}


//
// function to label external links
function externalLinkAriaLabeller() {
	$('a[target="_blank"]').each(function() {
		$(this).attr('aria-label', $(this).text() + ' (new window)');
	});
}


//
// function to change where we scroll to
function scrollToThis(element) {
	// make scroll to content go to search box
	$('#scrolltocontent').off(); // disable other event listners
	$("#scrolltocontent").click(function (event) {
		event.preventDefault();

		var content = $(element); // based on passed param
		if (content.length > 0) { // jump to element
			$('html,body').animate({
				scrollTop: content.first().offset().top
			}, 'slow');

			content.first().find(':focusable').eq(0).focus(); // focus it
		}
	});
	return;
}


//
// handle the basked a bit differently
function basketWindowHandler() {
	var strCookie = '';
	var nameCookie = 'bib_list';
	var valCookie = readCookie(nameCookie);
	if (valCookie) strCookie = nameCookie + '=' + valCookie;
	else strCookie = nameCookie + '=';

	var iW = 800;
	var iH = 500;
	var optWin = "status=yes,scrollbars=yes,resizable=yes,toolbar=no,location=yes,height="+iH+",width="+iW;
	var loc = "/cgi-bin/koha/opac-basket.pl?" + strCookie;
	var basket = open(loc, "basket", optWin);
	if (window.focus) basket.focus();
}
function basketLinkHandler() {
	// bookbag link handler
	$('a[href="#openFolder"]').on('click', function(event) {
		event.preventDefault();
		basketWindowHandler();
	});
	return;
}


//
// function to monitor masthead pulldown for changes and act on events
function mastheadEventHandler() {
	$("#masthead_search").on('change', function(event) { // this handles dropdown change events
		if($(this).val() == 'catalogue') {
			searchCatalogue();
		} else if ($(this).val() == 'explorit') { // if the user picks explorit . . .
			searchExplorit();
		} else if ($(this).val() == 'everything') {
			$('#fullText').val('');
		} else if ($(this).val() == 'ftonly') {
			$('#fullText').val('true');
		}
	});
}


//
// masthead seach pulldown changes -- search catalogue
function searchCatalogue() {
	// form config
	$('#masthead_search').find('option').remove().end(); //remove all masthead options
	$('#searchform').attr('action', '/cgi-bin/koha/opac-search.pl'); // set form name
	$('#searchform').attr('name', 'searchform'); // set form name
	$('#searchform').attr('method', 'get'); // set form method
	$('#searchform').attr('target', '_self'); // set target
	$('#translControl1').attr('name', 'q'); // set search box name
	$('#translControl1').attr('placeholder', 'Find books, e-books, journal titles and films'); // set text field placeholder
	$('#masthead_search').attr('name', 'limit');
	$('#fullText').remove(); //
	$('#formName').remove(); // remove explorit hidden fields
	$('#select_library').attr('name', 'limit');
	$('#select_library').parent().css('display', 'initial'); // show library pulldown
	if($('input[name="weight_search"]').length < 1) $('#searchform').append('<input type=\"hidden\" name=\"weight_search\" value=\"1\">'); // (re)add weight_search

	// dropdown config
	$('#masthead_search').append($('<option>', { // explorit option
		value: 'explorit',
		text: 'Search Articles Plus'
	}));
	$('#masthead_search').append($('<option>', { // catalogue option
		value: '',
		text: 'Search Catalogue',
		selected: 'selected'
	}));
	$('#masthead_search').append($('<option>', { // search books
		value: 'mc-ccode:PBK',
		text: '-- Books'
	}));
	$('#masthead_search').append($('<option>', { // search ebooks
		value: 'mc-ccode:EBK',
		text: '-- e-Books'
	}));
	$('#masthead_search').append($('<option>', { // search journals
		value: 'mc-ccode:JOUR',
		text: '-- Journals'
	}));
	$('#masthead_search').append($('<option>', { // search ejournals
		value: 'mc-ccode:EJOURN',
		text: '-- e-Journals'
	}));
	$('#masthead_search').append($('<option>', { // search dvds
		value: 'mc-ccode:DVD',
		text: '-- DVDs'
	}));
	$('#masthead_search').append($('<option>', { // search streaming media
		value: 'mc-ccode:ESTREAM',
		text: '-- Streaming media'
	}));

	// link config
	$('#moresearches').html('<li class=\"nav-item\"><a href=\"\/cgi-bin\/koha\/opac-search.pl\">Catalogue advanced search<\/a><\/li><li class=\"nav-item\"><a href=\"https:\/\/articlesplus.arts.ac.uk\/search\/desktop\/en\/search.html\" target=\"_blank\">Articles Plus advanced search<\/a><\/li>');

}


//
// masthead seach pulldown changes -- search catalogue
function searchExplorit() {
	// form config
	$('#masthead_search').find('option').remove().end(); //remove all masthead options
	$('#searchform').attr('action', '//foo.bar/baz/'); // set form name
	$('#searchform').attr('name', 'dwtform'); // set form name
	$('#searchform').attr('method', 'post'); // set form method
	$('#searchform').attr('target', '_blank'); // set target
	$('#translControl1').attr('name', 'fullRecord'); // set search box name
	$('#translControl1').attr('placeholder', 'Find full-text articles, reports, images, books and e-books'); // set text field placeholder
	$('#masthead_search').attr('name', 'formName');
	$('#masthead_search').before('<input id=\"fullText\" type=\"hidden\" name=\"fullTextOnly\" value=\"\" \/>');
	$('#masthead_search').after('<input type=\"hidden\" name=\"formName\" value=\"undefined\" \/>');
	$('#select_library').attr('name', '');
	$('#select_library').parent().css('display', 'none'); // hide library pulldown
	$('input[name="weight_search"]').remove(); // nuke weight_search

	// dropdown config
	$('#masthead_search').append($('<option>', { // catalogue option
		value: 'catalogue',
		text: 'Search Catalogue'
	}));
	$('#masthead_search').append($('<option>', { // explorit option
		value: 'everything',
		text: 'Search Articles Plus',
		selected: 'selected'
	}));
	$('#masthead_search').append($('<option>', { // search fulltext-only
		value: 'ftonly',
		text: '-- Search full-text only'
	}));

	// link config
	$('#moresearches').html('<li class=\"nav-item\"><a href=\"https:\/\/articlesplus.arts.ac.uk\/search\/desktop\/en\/search.html\" target=\"_blank\">Articles Plus advanced search<\/a><\/li><li class=\"nav-item\"><a href=\"\/cgi-bin\/koha\/opac-search.pl\">Catalogue advanced search<\/a><\/li>');

	// explorit link handler
        $('a[href="#switchSearch"]').on('click', function(event) {
		event.preventDefault(); // prevent the url from changing
		if($('#searchform').attr('name') == 'searchform') searchExplorit();
		else if($('#searchform').attr('name') == 'dwtform') searchCatalogue();
	});

}


//
// function to enable autocompletion from wikipedia
function wikiAutocomplete() {
	$('#translControl1').autocomplete({
		source: function(request, response) {
			$.ajax({
				url: 'https://en.wikipedia.org/w/api.php',
				dataType: 'jsonp',
				data: {
					'action': 'opensearch',
					'format': 'json',
					'search': request.term
				},
				success: function(data) {
					response(data[1]);
				}
			});
		}
	});
}


//
// function to add accordeons to search facets
function facetAccordeons() {
	// change the labels to be links
	$('#search-facets .menu-collapse h3').each(function () {
		// vars
		var currentText = $(this).text();

		$(this).html('<a href="\#expandFacet"\>' + currentText + ' <i class=\"fa fa-chevron-down\" aria-hidden=\"true\"><\/i><\/a>');
	});

	// remove the display:none and collapsible facet
	$('#search-facets .collapsible-facet').each(function() {
		$(this).removeAttr('style');
		$(this).removeAttr('class');
	});

	// remove the toggle links
	$('#search-facets .moretoggle').each(function() {
		$(this).remove();
	});

	// hide the lists
	$('#search-facets .menu-collapse ul').each(function() {
		$(this).hide();
	});

	// facet link handler
	$('a[href="#expandFacet"]').on('click', function(event) {
		event.preventDefault();

		if($(this).parents('h3').siblings('ul').css('display') == 'none') $(this).parents('h3').siblings('ul').show(); // unhide
		else $(this).parents('h3').siblings('ul').hide(); // else hide

		$(this).find('i.fa').toggleClass('fa-chevron-down'); // swap the chevrons
		$(this).find('i.fa').toggleClass('fa-chevron-left');
	});

	// unhide anything that has been selected
	$('#search-facets .menu-collapse li').find('li:contains("[x]")').each(function() {
		$(this).parents('li').find('h3 a').click();
	});
	$('#search-facets .menu-collapse li').find('li:contains("Showing only available items")').each(function() {
		$(this).parents('li').find('h3 a').click();
	});

	return;
}


//
// function to add a button which, on click, clears all search facets
function facetClearAllHandler() {
	// vars
	var urlParams = new URLSearchParams(window.location.search.substring(1));
	var q = urlParams.get('q');

	// detect if [x] exists
	if($('#search-facets .menu-collapse li:contains("[x]")').length > 0) $('#search-facets ul:first').prepend('<li id=\"cls_id\"><h3 id=\"facet-cls\"><a href=\"#facetAllClear\" class=\"logout\">Clear all refinements <i class=\"fa fa-times\" aria-hidden=\"true\"><\/i><\/a><\/h3><\/li>');

	// handle any clicks
	$('a[href="#facetAllClear"]').on('click', function(event) {
		event.preventDefault();

		window.location.href = 'https://' + window.location.hostname + '/cgi-bin/koha/opac-search.pl?q=' + q;
	});

	return;
}


//
// function to add date ranges to search facets
function facetPublicationDateRange() {
	// vars
	var urlParams = new URLSearchParams(window.location.search.substring(1)); // this doesnt like question marks
	var urlParamsFiltered = Array.from(urlParams.entries()).filter(value => { // remove previous limit params
		if(!value[1].includes('yr,st-numeric')) return false;
		else return true; // only return true if above conditions are met
	});
	if(urlParamsFiltered[0]) {
		var urlFacetSet = true;
		var urlFacet = urlParamsFiltered[0][1].substr(14);
	} else {
		var urlFacetSet = false;
		var urlFacet = '';
	}
	var currentYear = new Date().getFullYear();

	// first, inject the markup
	$('#search-facets ul:first').append('<li id=\"yr_id\"><h3 id=\"facet-yr\"><a href=\"#expandFacet\">Publication date range<i class=\"fa fa-chevron-down\" aria-hidden=\"true\"><\/i><\/a><\/h3> <div style=\"display:none\"><input name=\"limit-yr\" type=\"text\" class=\"mt-4\"><p class=\"hint pt-2\">For example: 1999-2001<\/p><p id=\"limit-yr-err\" class=\"hint pt-2\" style=\"display:none;color:red\">Please check you entered two valid years<\/p><a href=\"#facetYrRefine\" class=\"btn btn-primary mt-2\">Refine by date<\/a><\/div><\/li>');
	if(urlFacetSet) {
		$('input[name="limit-yr"]').val(urlFacet);
		$('a[href="#facetYrRefine"]').after('<a href=\"#facetYrClear\" class=\"btn btn-danger mt-2\">Clear date refinement [x]<\/a>'); // add clear button
	}

	// then handle clicks
	$('#facet-yr a').on('click', function(event) {
		event.preventDefault(); // disable usual behaviour
		event.stopImmediatePropagation();

		if($(this).parents('h3').siblings('div').css('display') == 'none') $(this).parents('h3').siblings('div').show(); // see facetAccordeon for how this code works
		else $(this).parents('h3').siblings('div').hide();

		$(this).find('i.fa').toggleClass('fa-chevron-down');
		$(this).find('i.fa').toggleClass('fa-chevron-left');
	});
	if(urlFacetSet) {
		$('#facet-yr a').click(); // we want to show the user the facet, you see
	}

	$('a[href="#facetYrRefine"]').on('click', function(event) {
		event.preventDefault();

		facetPublicationDateRangeSubmitHandler();
	});
	$('a[href="#facetYrClear"]').on('click', function(event) {
		event.preventDefault();

		facetPublicationDateRangeResetHandler();
	});
	$('input[name="limit-yr"]').on('keyup', function(event) {
		if (event.key === 'Enter' || event.keyCode === 13) {
			event.preventDefault();

			facetPublicationDateRangeSubmitHandler();
		}
	});
	return;
}


//
// function to process publication date range submissions
function facetPublicationDateRangeSubmitHandler() {
	// vars
	var urlParams = new URLSearchParams(window.location.search.substring(1)); // this doesnt like question marks
	var urlParamsFiltered = Array.from(urlParams.entries()).filter(value => { // remove previous limit params
		if(value[0] == 'limit-yr') return false;
		else if(value[1].includes('yr,st-numeric')) return false;
		else return true; // only return true if above conditions are met
	});
	var urlParamString = urlParamsFiltered.map(function(value, key) { // generate new string for urlParams
		return value[0] + '=' + value[1];
	}).join('&');
	var inputFacet = $('input[name="limit-yr"]').val();

	// rebuild urlParams
	urlParams = new URLSearchParams(urlParamString);

	// do it
	urlParams.append('limit', 'yr,st-numeric=' + inputFacet); // add our years
	window.location.href = 'https://' + window.location.hostname + window.location.pathname + '?' + urlParams.toString(); // lets go

	return;
}


//
// function to process publication date range submissions
function facetPublicationDateRangeResetHandler() {
	// vars
	var urlParams = Array.from(new URLSearchParams(window.location.search.substring(1)).entries()); // this doesnt like question marks
	var urlParamsFiltered = urlParams.filter(value => { // remove previous limit params
		if(value[0] == 'limit-yr') return false;
		else if(value[1].includes('yr,st-numeric')) return false;
		else return true; // only return true if above conditions are met
	});
	var urlParamString = urlParamsFiltered.map(function(value, key) { // generate new string for urlParams
		return value[0] + '=' + value[1];
	}).join('&');

	// rebuild urlParams
	urlParams = new URLSearchParams(urlParamString);

	// do it
	window.location.href = 'https://' + window.location.hostname + window.location.pathname + '?' + urlParams.toString(); // lets go
	return;
}


//
// function to handle reservation link actions
function reservationLinkHandler() {
	$('a[href*="/cgi-bin/koha/opac-reserve.pl"]').on('click', function(event){
		event.preventDefault();
		$('#modalReserveOk').attr('href', $(this).attr('href')); // set link to be correct
		$("#reserveModal").modal("show"); // show modal
	});

	$('#loginModal').after('<div class=\"modal show\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"modalLoginLabel\" id=\"reserveModal\" aria-modal=\"true\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><h2 class=\"modal-title\" id=\"modalReserveLabel\">Place a reservation on this item?<\/h2><button type=\"button\" class=\"closebtn\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">\u00D7<\/span><\/button><\/div><div class=\"modal-body\"><p id=\"modalReserveDesc\">Please click Ok to progress with this reservation. Be sure to await an email from your local Library branch, before coming in!<\/p><\/div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Cancel<\/button><a id=\"modalReserveOk\" href=\"#\" class=\"btn btn-primary\" aria-describedby=\"modalReserveDesc\">Ok<\/a><\/div><\/div><\/div><\/div>');
}


//
// function to relabel save record links
function renameSaveRecord() {
	$('#export .dropdown-item').each(function() {
		// vars
		var thisText = $(this).text();

		$(this).text('Save to ' + thisText);
	});
}
