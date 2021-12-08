// OPACUserJS, Senux Project, Jake Deery, 2021
document.addEventListener('DOMContentLoaded', function(event) { 
	//
	// gdpr
	if(localStorage.getItem('-senux-gdrp-dismissed') == null) $('body').prepend('<div id=\"-gdpr-banner\"><p>This website uses cookies to ensure you get the best experience on our website <a id=\"-gdpr-moreinfo\" href=\"https:\/\/gdpr-info.eu\/\" target=\"_blank\">More info \u00BB<\/a><button id=\"-gdpr-dismiss\" class=\"btn btn-primary\">Dismiss<\/button><\/p><\/div>');
	$('#-gdpr-dismiss, #-gdpr-moreinfo').click(function() {
		localStorage.setItem('-senux-gdrp-dismissed', 'true');
		$('#-gdpr-banner').remove();
	});

	//
	// site-wide logic (MAIN FUNC)

	// nav menus
	$('#cart-list-nav').html('<li class=\"nav-item\"><a href=\"\/cgi-bin\/koha\/opac-main.pl\" class=\"nav-link\" title=\"Homepage\" id=\"hmpmenu\"><i class=\"fa fa-home fa-icon-white\"><\/i><\/a><\/li><li class=\"nav-item\"><a href=\"#\" class=\"nav-link\" title=\"Cart\" id=\"bkbmenu\" role=\"button\"><i id=\"carticon\" class=\"fa fa-shopping-cart fa-icon-black\"><\/i> <span class=\"cartlabel\">Cart<\/span><\/a><\/li><li class=\"nav-item\"><a href=\"#\" class=\"nav-link\" title=\"Help\" id=\"hlpmenu\"><i class=\"fa fa-info-circle fa-icon-white\"><\/i> <span class=\"hlplabel\">Help<\/span><\/a><\/li><li class=\"nav-item\"><a href=\"\/cgi-bin\/koha\/opac-search.pl\" class=\"nav-link\" title=\"Help\" id=\"srchmenu\"><i class=\"fa fa-search fa-icon-white\"><\/i> <span class=\"srchlabel\">Search<\/span><\/a><\/li>');

	// bookbag link handler
	$('#bkbmenu').click(function(event) {
		event.preventDefault();
		basketWindowHandler();
	});

	// bookbag opener - modified openBasket()
	function basketWindowHandler() {
		var strCookie = '';
		var nameCookie = 'bib_list';
		var valCookie = readCookie(nameCookie);
		if (valCookie) {
			strCookie = nameCookie + '=' + valCookie;
		} else {
			strCookie = nameCookie + '=';
		}

		var iW = 800;
		var iH = 500;
		var optWin = "status=yes,scrollbars=yes,resizable=yes,toolbar=no,location=yes,height="+iH+",width="+iW;
		var loc = "/cgi-bin/koha/opac-basket.pl?" + strCookie;
		var basket = open(loc, "basket", optWin);
		if (window.focus) {
			basket.focus();
		}
	}

	// remove cart notice
	$('#cartDetails').remove();

	// set searchbar text labe;
	$('#opac-main-search label').text('Catalogue Search');

	// login modal - shibboleth
	$('#loginModal').html('<div class=\"modal-dialog\"> <div class=\"modal-content\"> <div class=\"modal-header\"> <h2 class=\"modal-title\" id=\"modalLoginLabel\">Log in to your account<\/h2> <button type=\"button\" class=\"closebtn\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">\u00D7<\/span><\/button> <\/div><div id=\"modalAuth\" class=\"modal-body\"> <h3>Academic student or staff?<\/h3> <p><a href=\"\/Shibboleth.sso\/Login?target=https:\/\/' + window.location.hostname + window.location.pathname + window.location.search + '\" class=\"btn btn-primary\">Go to institution login &raquo;<\/a><\/p><h3>Academic associate?<\/h3> <p><a href=\"\/cgi-bin\/koha\/opac-user.pl\" class=\"btn btn-primary\">Go to local Koha login &raquo;<\/a><\/p><\/div><\/div><\/div>');

	// login page - shibboleth
	if($('#auth').length > 0 && $('#opac-auth').children('h3').eq(1).length > 0) {
		$('#opac-auth').children('h3').eq(0).text('Academic student or staff?');
		$('#opac-auth').children('p').eq(0).html('Please click the button below and login with your student ID number and password.<br \/><a href=\"\/Shibboleth.sso\/Login?target=https:\/\/' + window.location.hostname + window.location.pathname + window.location.search + '\" class=\"btn btn-primary\">Go to institution login &raquo;<\/a><br \/><br \/><a href=\"\/cgi-bin\/koha\/opac-main.pl#!\/faqs\">Forgot your password?<\/a>');
		$('#opac-auth').children('h3').eq(1).text('Academic associate?');
		$('#opac-auth').children('p').eq(1).text('Please enter the login details provided to you by the Library team');
		$('#nologininstructions').html('<p style=\"padding:1rem 0\">If you don\'t have a student ID card or password, visit the Library counter, where we will be able to provide these to you. Please note: if you need a student ID card, please bring photo ID and proof of enrolment.<\/p>');
	} else if($('#auth').length > 0 && $('#opac-auth').children('h3').eq(1).length < 1) {
		$('#opac-auth').children('h3').eq(0).text('Academic associate?');
		$('#opac-auth').children('p').eq(0).text('Please enter the login details provided to you by the Library team');
		$('#nologininstructions').html('<p style=\"padding:1rem 0\">If you don\'t have a student ID card or password, visit the Library counter, where we will be able to provide these to you. Please note: if you need a student ID card, please bring photo ID and proof of enrolment to be issued with a new card.<\/p>');
	}

	// remove 'powered by koha' regardless of syspref
	$('#koha_url').remove();

});