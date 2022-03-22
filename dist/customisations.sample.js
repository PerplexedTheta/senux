// OPACUserJS, Senux Project, Jake Deery, 2021
document.addEventListener('DOMContentLoaded', function(event) {
	// vars
	var baseHost = window.location.hostname;
	var baseUri = window.location.pathname + window.location.search + window.location.hash;

	//
	// gdpr
	showGdprBanner();


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
	$('#loginModal').html('<div class=\"modal-dialog\"> <div class=\"modal-content\"> <div class=\"modal-header\"> <h2 class=\"modal-title\" id=\"modalLoginLabel\">Log in to your account<\/h2> <button type=\"button\" class=\"closebtn\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">\u00D7<\/span><\/button> <\/div><div id=\"modalAuth\" class=\"modal-body\"> <h3>Academic student or staff?<\/h3> <p><a href=\"\/Shibboleth.sso\/Login?target=https:\/\/' + window.location.hostname + window.location.pathname + window.location.search + '\" class=\"btn btn-primary\">Go to institution login &raquo;<\/a><\/p><h3>Academic associate?<\/h3> <p><a href=\"\/cgi-bin\/koha\/opac-user.pl\" class=\"btn btn-primary\">Go to local Koha login &raquo;<\/a><\/p><\/div><\/div><\/div>');

	// disable borrower contact method dropdown if it is readonly
	if($('select[name="borrower_primary_contact_method"]').attr('readonly') == "readonly") {
		$('select[name="borrower_primary_contact_method"]').removeAttr('readonly');
		$('select[name="borrower_primary_contact_method"]').attr('disabled', 'disabled');
	}

	// hide search facets under menus
	facetAccordeons();

	// add publication date range to facets
	facetPublicationDateRange();

	// remove 'powered by koha' regardless of syspref
	$('#koha_url').remove();
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
	$('#search-facets .menu-collapse').append('<li id=\"yr_id\"><h3 id=\"facet-yr\"><a href=\"#expandFacet\">Publication date range <i class=\"fa fa-chevron-down\" aria-hidden=\"true\"><\/i><\/a><\/h3><div style=\"display:none\"><input type=\"text\" name=\"limit-yr\"><p class=\"hint\">For example: 1999-2001<\/p><a href=\"#facetYrRefine\" class=\"btn btn-default mt-2\">Refine<\/a><\/div><\/li>');

	// then, check for and inject, the previous value
	if(urlParams.get('limit-yr')) sessionStorage.setItem('limit-yr', urlParams.get('limit-yr'));

	// then handle clicks
	$('#facet-yr a').on('click', function(event) {
		event.preventDefault(); // disable usual behaviour
		event.stopImmediatePropagation();

		if($(this).parents('h3').siblings('div').css('display') == 'none') $(this).parents('h3').siblings('div').show(); // see facetAccordeon for how this code works
		else $(this).parents('h3').siblings('div').hide();

		$(this).find('i.fa').toggleClass('fa-chevron-down');
		$(this).find('i.fa').toggleClass('fa-chevron-left');
	});

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

	// lastly, check for and set the section expander
	if(sessionStorage.getItem('limit-yr')) $('input[name="limit-yr"]').val(sessionStorage.getItem('limit-yr'));
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