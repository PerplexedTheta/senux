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

	// hide unavailable items behind a link
	hideUnavailableResults();

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

	// begin handling links
	linkEventHandler();

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
// function to handle link actions
function linkEventHandler() {
	// bookbag link handler
	$('a[href="#openFolder"]').on('click', function(event) {
		event.preventDefault();
		basketWindowHandler();
	});

	// facet link handler
	$('a[href="#expandFacet"]').on('click', function(event) {
		event.preventDefault();

		if($(this).parents('h3').siblings('ul').css('display') == 'none') $(this).parents('h3').siblings('ul').show();
		else $(this).parents('h3').siblings('ul').hide();

		$(this).find('i.fa').toggleClass('fa-chevron-down');
		$(this).find('i.fa').toggleClass('fa-chevron-left');
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
	return;
}


//
// function to change where we scroll to
function scrollToThis(element) {
	// make scroll to content go to search box
	$('#scrolltocontent').off(); // disable other event listners
	$("#scrolltocontent").click(function (event) {
		event.preventDefault();

		var content = $(element);
		if (content.length > 0) {
			$('html,body').animate({
				scrollTop: content.first().offset().top
			}, 'slow');

			content.first().find(':focusable').eq(0).focus();
		}
	});
	return;
}


//
// function to hide unavailable items behind link
function hideUnavailableResults() {
	$('#bookbag_form tbody tr').each(function() {
        	$(this).find('.results_summary.availability .unavailable:gt(0)').hide();
		$(this).find('.results_summary.availability .unavailable .AvailabilityLabel').append(' <a href="#showUnavailable">Click here to show unavailable items</a>');
	});

	$('a[href="#showUnavailable"]').on('click', function(event) {
		event.preventDefault(); // prevent the url from changing
		$(this).closest('.results_summary.availability').find('.unavailable:gt(0)').show();
		$(this).remove();
	});
	return;
}


//
// function to add date ranges to search facets
function facetPublicationDateRange() {
	// vars
	var currentYear = new Date().getFullYear();

	$('#search-facets .menu-collapse').append('<li id=\"yr_id\"><h3 id=\"facet-yr\"><a href=\"#expandFacet\">Publication date range <i class=\"fa fa-chevron-down\" aria-hidden=\"true\"><\/i><\/a><\/h3><div style="display:none"><p>- between -</p><input minlength="4" maxlength="4" placeholder="1921" name="yr-start" type="number"><p>- and -</p><input minlength="4" maxlength="4" type="number" placeholder="' + currentYear + '" name="yr-end"><p id=\"facet-yr-error\" style=\"display:none\">Please enter two dates above<\/p><a href="#facetYrRefine" class="btn btn-primary mt-2">Refine</a></div><\/li>');

	$('#facet-yr a').on('click', function(event) {
		event.preventDefault();
		event.stopImmediatePropagation();

		if($(this).parents('h3').siblings('div').css('display') == 'none') $(this).parents('h3').siblings('div').show();
		else $(this).parents('h3').siblings('div').hide();

		$(this).find('i.fa').toggleClass('fa-chevron-down');
		$(this).find('i.fa').toggleClass('fa-chevron-left');
	});

	$('a[href="#facetYrRefine"]').on('click', function(event) {
		event.preventDefault();

		facetPublicationDateRangeSubmitHandler();
	});
	$('input[name="yr-start"]').on('keyup', function(event) {
		if (event.key === 'Enter' || event.keyCode === 13) {
			event.preventDefault();

			facetPublicationDateRangeSubmitHandler();
        }
	});
	$('input[name="yr-end"]').on('keyup', function(event) {
		if (event.key === 'Enter' || event.keyCode === 13) {
			event.preventDefault();

			facetPublicationDateRangeSubmitHandler();
        }
	});
	return;
}


//
function facetPublicationDateRangeSubmitHandler() {
	// vars
	var yrStart = $('input[name="yr-start"]');
	var yrEnd = $('input[name="yr-end"]');
	var currentYear = new Date().getFullYear();
	var urlParams = new URLSearchParams(window.location.search.substring(1));

	if(isNaN(yrStart.val()) || yrStart.val() == '') {
		$('#facet-yr-error').show();
		return false;
	}
	if(isNaN(yrEnd.val()) || yrEnd.val() == '') {
		$('#facet-yr-error').show();
		return false;
	}

	if(yrStart.val() < '1921') yrStart.val('1921');
	if(yrEnd.val() < '1921') yrEnd.val('1921');
	if(yrStart.val() > '' + currentYear) yrStart.val('' + currentYear);
	if(yrEnd.val() > '' + currentYear) yrEnd.val('' + currentYear);
	if(yrStart.val() > yrEnd.val()) yrStart.val(yrEnd.val());
	if(yrEnd.val() < yrStart.val()) yrEnd.val(yrStart.val());

	if(urlParams.get('limit-yr')) urlParams.delete('limit-yr');
	urlParams.append('limit-yr', $('input[name="yr-start"]').val() + '-' + $('input[name="yr-end"]').val());

	window.location.href = 'https://' + window.location.hostname + window.location.pathname + '?' + urlParams.toString();
	return;
}

//
// function to add accordeons to search facets
function facetAccordeons() {
	$('#search-facets .menu-collapse h3').each(function () {
		// vars
		var currentText = $(this).text();

		$(this).html('<a href="\#expandFacet"\>' + currentText + ' <i class=\"fa fa-chevron-down\" aria-hidden=\"true\"><\/i><\/a>');
	});

	$('#search-facets .collapsible-facet').each(function() {
		$(this).removeAttr('style');
		$(this).removeClass('collapsible-facet');
	});

	$('#search-facets .moretoggle').each(function() {
		$(this).remove();
	});

	$('#search-facets .menu-collapse ul').each(function() {
		$(this).hide();
	});

	return;
}
