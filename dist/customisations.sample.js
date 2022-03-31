// OPACUserJS, Senux Project, Jake Deery, 2021
document.addEventListener('DOMContentLoaded', function(event) {
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
	$('#cart-list-nav').html('<li class=\"nav-item\"><a href=\"\/cgi-bin\/koha\/opac-main.pl\" class=\"nav-link\" title=\"Homepage\" id=\"hmpmenu\"><i class=\"fa fa-home fa-icon-white\"><\/i><\/a><\/li><li class=\"nav-item\"><a href=\"#openFolder\" class=\"nav-link\" title=\"Cart\" id=\"bkbmenu\" role=\"button\"><i id=\"carticon\" class=\"fa fa-shopping-cart fa-icon-black\"><\/i> <span class=\"cartlabel\">Cart<\/span><\/a><\/li><li class=\"nav-item\"><a href=\"#\" class=\"nav-link\" title=\"Help\" id=\"helpmenu\"><i class=\"fa fa-info-circle fa-icon-white\"><\/i> <span class=\"helplabel\">Help<\/span><\/a><\/li><li class=\"nav-item\"><a href=\"\/cgi-bin\/koha\/opac-search.pl\" class=\"nav-link\" title=\"Help\" id=\"srchmenu\"><i class=\"fa fa-search fa-icon-white\"><\/i> <span class=\"srchlabel\">Search<\/span><\/a><\/li>');

	// relabel login link
	if($('#user-menu').hasClass('dropdown-toggle') == false) $('.userlabel').text('Log in');

	// remove cart notice
	$('#cartDetails').remove();

	// set searchbar text label
	$('#opac-main-search label').text('Catalogue Search');

	// login modal - shibboleth
	// comment this out if you don't use saml
	//$('#loginModal').html('<div class=\"modal-dialog\"> <div class=\"modal-content\"> <div class=\"modal-header\"> <h2 class=\"modal-title\" id=\"modalLoginLabel\">Log in to your account<\/h2> <button type=\"button\" class=\"closebtn\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">\u00D7<\/span><\/button> <\/div><div id=\"modalAuth\" class=\"modal-body\"> <h3>Academic student or staff?<\/h3> <p><a href=\"\/Shibboleth.sso\/Login?target=https:\/\/' + window.location.hostname + window.location.pathname + window.location.search + '\" class=\"btn btn-primary\">Go to institution login &raquo;<\/a><\/p><h3>Academic associate?<\/h3> <p><a href=\"\/cgi-bin\/koha\/opac-user.pl\" class=\"btn btn-primary\">Go to local Koha login &raquo;<\/a><\/p><\/div><\/div><\/div>');

	// disable borrower contact method dropdown if it is readonly
	if($('select[name="borrower_primary_contact_method"]').attr('readonly') == "readonly") {
		$('select[name="borrower_primary_contact_method"]').removeAttr('readonly');
		$('select[name="borrower_primary_contact_method"]').attr('disabled', 'disabled');
	}

	// hide search facets under menus
	facetAccordeons();

	// add publication date range to facets
	facetPublicationDateRange();

	// explorit masthead pulldown handler
	//mastheadEventHandler();
	//searchCatalogue();

	// add basket link handler
	basketLinkHandler();

	// reservation link handler
	reservationLinkHandler();

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
// function to add date ranges to search facets
function facetPublicationDateRange() {
	// vars
	var urlParams = new URLSearchParams(window.location.search.substring(1)); // this doesnt like the questionmark
	var currentYear = new Date().getFullYear();

	// first, inject the markup
	$('#facetcontainer').after('<div class=\"facetcontainer\"><div role=\"region\" aria-label=\"Date range facets\" class=\"search-facets\"><h2><p>Refine date range<\/p><\/h2><div id=\"yr_id\" class=\"container-fluid\"><input name=\"limit-yr\" type=\"text\" class=\"mt-4\"><p class=\"hint pt-2\">For example: 1999-2001<\/p><p id=\"limit-yr-err\" class=\"hint pt-2\" style=\"display:none;color:red\">Please check you entered two valid years<\/p><a href=\"#facetYrRefine\" class=\"btn btn-default mt-2\">Refine date<\/a><\/div><\/div><\/div>');

	// then, check for and inject, the previous value
	if(urlParams.get('limit-yr')) {
		var date = urlParams.get('limit-yr');
		sessionStorage.setItem('limit-yr');
	}

	// handle clicks
	$('a[href="#facetYrRefine"]').on('click', function(event) {
		event.preventDefault();

		facetPublicationDateRangeSubmitHandler();
	});
	$('input[name="limit-yr"]').on('keyup', function(event) {
		if (event.key === 'Enter' || event.keyCode === 13) {
			event.preventDefault();

			facetPublicationDateRangeSubmitHandler();
		}
	});

	if(sessionStorage.getItem('limit-yr')) {
		$('input[name="limit-yr"]').val(sessionStorage.getItem('limit-yr'));
	}
	if(urlParams.get('limit-yr')) $('#facet-yr a').click();
	return;
}


//
// function to process publication date range submissions
function facetPublicationDateRangeSubmitHandler() {
	// vars
	var limitYr = $('input[name="limit-yr"]').val();
	var urlParams = new URLSearchParams(window.location.search.substring(1)); // this doesnt like the questionmark

	if(urlParams.get('limit-yr')) urlParams.delete('limit-yr'); // if we have a limit-yr already, delete...
	if(urlParams.get('limit')) urlParams.delete('limit'); // if we have a limit already, delete...
	urlParams.append('limit-yr', limitYr); // add our years

	window.location.href = 'https://' + window.location.hostname + window.location.pathname + '?' + urlParams.toString(); // lets go
	return;
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
// function to handle reservation link actions
function reservationLinkHandler() {
	$('a[href*="/cgi-bin/koha/opac-reserve.pl"]').on('click', function(event){
		event.preventDefault();
		$('#modalReserveOk').attr('href', $(this).attr('href')); // set link to be correct
		$("#reserveModal").modal("show"); // show modal
	});

	$('#loginModal').after('<div class=\"modal show\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"modalLoginLabel\" id=\"reserveModal\" aria-modal=\"true\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><h2 class=\"modal-title\" id=\"modalReserveLabel\">Place a reservation on this item?<\/h2><button type=\"button\" class=\"closebtn\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">\u00D7<\/span><\/button><\/div><div class=\"modal-body\"><p id=\"modalReserveDesc\">Please click Ok to progress with this reservation. Be sure to await an email from your local Library branch, before coming in!<\/p><\/div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Cancel<\/button><a id=\"modalReserveOk\" href=\"#\" class=\"btn btn-primary\" aria-describedby=\"modalReserveDesc\">Ok<\/a><\/div><\/div><\/div><\/div>');
}
