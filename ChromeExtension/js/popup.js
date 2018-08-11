/////////
// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Add your Analytics tracking ID here.
 */
var _AnalyticsCode = 'UA-24068205-1';

/**
 * Below is a modified version of the Google Analytics asynchronous tracking
 * code snippet.  It has been modified to pull the HTTPS version of ga.js
 * instead of the default HTTP version.  It is recommended that you use this
 * snippet instead of the standard tracking snippet provided when setting up
 * a Google Analytics account.
 */
var _gaq = _gaq || [];
_gaq.push(['_setAccount', _AnalyticsCode]);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
})();

/**
 * Track a click on a button using the asynchronous tracking API.
 *
 * See http://code.google.com/apis/analytics/docs/tracking/asyncTracking.html
 * for information on how to use the asynchronous tracking API.
 */
function trackButtonClick(e) {
  _gaq.push(['_trackEvent', e.target.id, 'clicked']);
}

/**
 * Now set up your event handlers for the popup's `button` elements once the
 * popup's DOM has loaded.
 */
document.addEventListener('DOMContentLoaded', function () {
  var buttons = document.querySelectorAll('button');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', trackButtonClick);
  }
});
/////////////






var maxchars = 160;
var background;
var varycolor = 0;

$(document).ready(function()
{	
	background = chrome.extension.getBackgroundPage();
	console.log(background);
	
	// Quick fix for reload.
	console.log("new messages: " + background.new_messages);
	if( background.new_messages > 0 )
	{
		getData();
	}
	
	if( background.getSession() == null )
	{
		console.log("getsession is null: showing login.");
		showLogin();
	}
	else
	{
		console.log("getsession is not null: showing view.");
		showStartupView();
	}
	
	// Ads should open in a new tab and therefore they are identified via an attribute "ad=true"
	$('a').click(function(){
	
		
   });
   
   // update charsleft
   $("#radioboxes").click(function(){ updateTextArea(); console.log(charsleft); });
   
	// Char up read in the stuff
	$("#smstext").keyup(function()
	{
		updateTextArea();
	});
});

$(document).on("click", "a", function(f)
{ 
		if($(this).attr('ad')=="true")
		{
			var href = $(this).attr('href');
			chrome.tabs.create({'url': href}); 
			return false;
		}
		else
		{
			return true
		};
		
		return false;
}); 

function updateTextArea()
{
		var nrofsms = 1;
		var forceunicode = false;
		var that = $("#smstext");
		var len = 0;
		var maxsms = 6;
		var val = that.val();
		
		if( $("#unicode_click").attr("checked") || forceunicode==true )
		{ 
			maxchars = 386; 
		} 
		else 
		{ 
			maxchars = 918; 
		}
		
		if( $("#voice_click").attr("checked") )
		{ maxsms = 2; maxchars = 307; } 
		else
		{ maxsms = 6; }
		
		
		len = that.val().length;
		that.attr("maxlength",maxchars);


		
		
		var usedchars = 0;
		var smschars  = 160;
		
			if($("#unicode_click").attr("checked"))
			{
				     if( len < 71 ) { nrofsms=1; smschars=70;}
				else if( len < 136 ){ nrofsms=2; smschars=135;}
				else if( len < 199 ){ nrofsms=3; smschars=198;}
				else if( len < 262 ){ nrofsms=4; smschars=261;}
				else if( len < 325 ){ nrofsms=5; smschars=324;}
				else if( len < 388 ){ nrofsms=6; smschars=387;}
			}
			else
			{
				     if( len < 161 ){ nrofsms=1; smschars=160;}
				else if( len < 307 ){ nrofsms=2; smschars=306;}
				else if( len < 460 ){ nrofsms=3; smschars=459;}
				else if( len < 614 ){ nrofsms=4; smschars=613;}
				else if( len < 766 ){ nrofsms=5; smschars=765;}
				else if( len < 919 ){ nrofsms=6; smschars=918;}
			}
		
		
		if (len >= maxchars ) 
		{
			that.val(val.substring(0, maxchars));
		}
		
		if( nrofsms > maxsms )
		{
			
			that.val(val.substring(0, maxchars));
		}
		
		usedchars = smschars - len;
		if(len == maxchars){ usedchars = 0; nrofsms = maxsms; }
		$('#ta_left').text(usedchars);
		
		$('#ta_sms').text(nrofsms);
		$('#ta_sms_max').text(maxsms);
}


$("dt").click(function(){
	var id = this.id;
	$("#"+id+"_under").toggle();
});


function showLogin()
{
	console.log("showLogin();");
	$("#login").show();
	$("#errsucc").html(background.getSession());
}

$("li").click(
		function()
		{
			var element = this;
		
			
			hideAll();
			var id = "#"+element.id+"_content";
			$(id).show();
			
			// If you are checking your received you should mark them as read.
			if( id == "#notifications_content" ){mark_read();}
			
			console.log("showing: " + id)
			
			return false;
		}
	);
	
function mark_read()
{
	$.post
	(
		"https://www.smsnetwork.org/historic.php?type=inbox",
		function()
		{
		}
	)
	chrome.browserAction.setBadgeText({text: ""});
	background.new_messages = 0;
}	

function showStartupView()
{
	$("#login").hide();
	
	hideAll();
	
	// $("#content_table").html("");
	// $.each(background.getUser(),function(key,value){
		// $("#content_table").append("<tr><td>"+key+"</td><td>"+value+"</td></tr>")
	// });
	
	$("#content_last_login").html(background.getUser().last_login);
	$("#content_name").html(background.getUser().first_name + " " + background.getUser().last_name);
	$("#content_number").html("+"+background.getUser().mobile_numbers_worldwide);
	$("#content_credits").html(background.getUser().credits);
	
	if( background.getUser().vip_membership == "2" || background.getUser().vip_membership == "3" )
	{ 
		$("#content_free_credits").html(background.getUser().free_credit +"/6"); 
		
		$("#vip_specify_ellernumber").removeAttr("disabled");
		$("#vip_specify_from").removeAttr("disabled");
		$("#vip_specify_ellernumber").attr("placeholder","");
		$("#vip_specify_from").attr("placeholder","");
	}
	
	$("#landcode_1").html(background.user.users_country_code);
	$("#landcode_2").html(background.user.users_country_code);
	$("#landcode_3").html(background.user.users_country_code);
	
	$("#bank_reference").html(background.user.recruitment_link);
	
	
	// Reinsert the data
	fillLogs();
	fillPhonebook();
	fillAds();
	
	$("#actual_content").show();
	$("#sidebar").show();
	$("#home_content").show();
	
	console.log("showstartup");
	//$("#help_content").html(background.getSession());
}

function hideAll()
{
	$("#home_content").hide();
	$("#settings_content").hide();
	$("#notifications_content").hide();
	$("#sendsms_content").hide();
	$("#reports_content").hide();
	$("#collect_content").hide();
	$("#purchase_content").hide();
	$("#phonebook_content").hide();
	$("#help_content").hide();
}

$("#login_submit").click(function()
{
	login();
	return false;
});

$("#sendsms_submit").click(function()
{
	sendSMS();
	return false;
});

function sendSMS()
{	
	// Debug
	console.log($("#sendsms_form").serialize());

/*	if( background.user.credits == 0 )
	{
		$("#sendsms_errsucc").html("You don't have enough credits to send SMS.");
		return;
	}
*/
	$("#sendsms_errsucc").html("<img src='img/loader.gif' />");
	
	// Remove the "disabled" so that the value is sent tot the webserver even though the user is not a VIP member.
	$("#vip_specify_from").removeAttr("disabled");
	$("#vip_specify_ellernumber").removeAttr("disabled");

			// Add ,00to receiver..
			//$("#form_recipients").attr("value",",00"+$("#sendsms_receiver").attr("value"));
			
			
			$.post
			(
				"https://www.smsnetwork.org/_scripts/sendsms.php",
				$("#sendsms_form").serialize(),
				function(reply)
				{
					if( reply == null )
					{
						$("#sendsms_errsucc").html("Something went wrong!");
					}
					else
					{
						$("#sendsms_errsucc").html("Message sent!");
						getData();
					}
					
					// Reset the disabled. If the user is not vid that is
					if( background.getUser().vip_membership == "0" )
					{
						$("#vip_specify_from").addAttr("disabled");
						$("#vip_specify_ellernumber").addAttr("disabled");
					}
				}
			);

		return false;
	//	});
}

$("#logout").click(function(){$.post("https://www.smsnetwork.org/_scripts/log-out.php?logout=",function(reply){background.setSession(null);$("#sidebar").hide();background.setUser(null);hideAll();showLogin();chrome.browserAction.setBadgeText({text: "x"});})});

function fillPhonebook()
{
	if(background.phonebook   == null) return;
	if(background.originators == null) return;

	$("#phonebook_table").html("");
	$("#phonebook_table").append("<tr><th>Status</th><th>Name</th><th>Number</th></tr>");
	$("#sendsms_receiver").html("<option>Choose</option>");
	$.each( background.phonebook,
		function(key,value)
		{
			$("#phonebook_table").append("<tr "+getbg()+"><td><img src='img/active_"+value.phonebook_active+".png' /></td><td>"+value.phonebook_name+"</td><td>+"+value.phonebook_world_number+"</td></tr>");
			$("#sendsms_receiver").append("<option value='"+value.phonebook_world_number+"'>"+value.phonebook_name+" (+"+value.phonebook_world_number+")</option>");
		}
	);	
	
	$("#sendsms_originators").html("");
	$("#sendsms_originators").append("<option value='"+background.user.mobile_numbers_worldwide+"'>+"+background.user.mobile_numbers_worldwide+"</option>");
	$.each( background.originators,         
		function(key,value)
		{
			// Remove 0 and add +46
			var nr   = value.originators_senders;//.substr(1);
			var val  = "+"+nr;
			var name = val;
			
			if( value.originators_type == "alpha" )
			{
				var name = value.originators_senders;
			}
			
			var string = "<option value='"+value.originators_senders+"' "+value.originators_standard+">"+value.originators_plus+value.originators_senders+"</option>";
			console.log(string);
			$("#sendsms_originators").append(string);
			
			//$("#sendsms_originators").append("<option value='"+val+"'>"+name+"</option>");
		}
	);
	
	$("#country_code_select").html("");
	$.each(background.countrycode,function(key,value){
		$("#country_code_select").append("<option value='"+value.country_code+"'>"+value.country_code_name_en+"</option>");
	});
}

$("#add_to_phonebook_button").click(function(){
	$("#add_to_phonebook_errsucc").html("<img src='img/loader.gif' />");
	$.post("https://www.smsnetwork.org/_scripts/add-phonebook.php",
	$("#add_to_phonebook").serialize(),
	function(reply){ $("#add_to_phonebook_errsucc").html("Contact added and wil be shown when you login again."); }
	);
});

function fillLogs()
{
	if(background.sent     == null) return;
	if(background.received == null) return;
	
	// Received
	$("#received_table").html("");
	$("#received_table").append("<tr><th>From</th><th>Message</th></tr>");
	$.each( background.received,
		function(key,value)
		{
			var shownNumber = ($.isNumeric(value.logs_from_senders.charAt(0)) ? "+" + value.logs_from_senders : value.logs_from_senders );
			$("#received_table").append("<tr "+getbg()+"><td>"+shownNumber+"</td><td>"+value.logs_message+"</td></tr>");
		}
	);
	
	// Sent sms
	$("#sent_table").html("");
	$("#sent_table").append("<tr><th>Status</th><th>To</th><th>Message</th></tr>");
	$.each( background.sent,
		function(key,value)
		{
			var shownNumber = ($.isNumeric(value.logs_number.charAt(0)) ? "+" + value.logs_number : value.logs_number );
			var shownMessage = value.logs_message;
			
			if( value.logs_group_id != 0 )
			{
				shownNumber  = "Group"; 
				shownMessage = "<a ad='true' href='https://www.smsnetwork.org/historic.php?type=sms&page=&groupid="+value.logs_group_id+"'>Check report</a>";
			}
			
			$("#sent_table").append("<tr "+getbg()+">"
										+"<td><img src='img/sent_"+value.logs_status+".png'/></td>"
										+"<td>"+shownNumber+"</td>"
										+"<td>"+shownMessage+"</td>"
										+"</tr>");
		}
	);
}

function fillAds()
{
	console.log(background.ads);
	if( background.ads == null ) return;
	
	{
		// FREE OFFERS
		$("#collect_credits_free_table").html("");
		$("#collect_credits_free_table").append("<tr><th>Collect Credits - Free offers</th><th width=50><span style='padding-right:5px;'>Credits</span></th></tr>");
		
		$.each( background.ads,
			function(key,value)
			{
				if( value.advertisers_ads_bid_type == "Sale" ) return;
				
				// Might nog always be that URL?
				var aid = "https://www.smsnetwork.org/ads/imp.php?aid="+value.id;
				if( value.advertisers_ads_imp_url != "https://www.smsnetwork.org/ads/imp.php?aid=-aid-"){ aid = value.advertisers_ads_imp_url; }
				
				// Create strings
				var string = "<a ad='true' href='https://www.smsnetwork.org/_scripts/golink.php?cid="+value.id+"' target='_new'>"+value.advertisers_ads_title+"</a>";
				var text = value.advertisers_ads_text;
				
				// add to stuff
				$("#collect_credits_free_table").append("<tr "+getbg()+"><td style='text-align:left; background:url("+aid+") no-repeat; background-size: 100%;'>" + string + "<br />" + text + "<td>" + value.advertisers_ads_credits + "</td></tr>");
			}
		);
	}
	
	{
		// NOT FREE OFFERS
		$("#collect_credits_other_table").html("");
		$("#collect_credits_other_table").append("<tr><th>Collect Credits - Other offers</th><th width=50><span style='padding-right:5px;'>Credits</span></th></tr>");
		
		$.each( background.ads,
			function(key,value)
			{
				if( value.advertisers_ads_bid_type != "Sale" ) return;
				
				// Might nog always be that URL?
				var aid = "https://www.smsnetwork.org/ads/imp.php?aid="+value.id;
				if( value.advertisers_ads_imp_url != "https://www.smsnetwork.org/ads/imp.php?aid=-aid-"){ aid = value.advertisers_ads_imp_url; }
				
				// Create strings
				var string = "<a ad='true' href='https://www.smsnetwork.org/_scripts/golink.php?cid="+value.id+"' style='background:url("+aid+") no-repeat;' target='_new'>"+value.advertisers_ads_title+"</a>";
				var text = value.advertisers_ads_text;
				
				// add to stuff
				$("#collect_credits_other_table").append("<tr "+getbg()+"><td style='text-align:left;'>" + string + "<br />" + text + "<td>" + value.advertisers_ads_credits + "</td></tr>");
			}
		);
	}
}


$('#update_logs').click(function(){getData();});

function getData()
{
	varycolor = 0; // reset it.
	
	$.post
			(
				"https://www.smsnetwork.org/_scripts/members-json.php",
				{
					php_session_id 		: background.getSession(),
					user_id 			: background.getUser().id,
					country_code 		: background.getUser().users_country_code,
					born				: background.getUser().born,
					vip_membership		: background.getUser().vip_membership
				},
				function(reply)
				{
					console.log("getData() reply");
					console.log(reply);
					
					background.sent      = reply[0].Logs;
					background.received  = reply[1].Logs1;
					background.phonebook = reply[2].Phonebook;
					background.originators = reply[3].Originators;
					background.ads 		   = reply[6].Advertisers_ads;
					background.countrycode = reply[7].Countrycode;
					
					fillLogs();
					fillPhonebook();
					fillAds();
				},
				"json"
			);
		return false;
}

function login()
{
		$("#errsucc").html("<img src='img/loader.gif' />");

			$.post
			(
				"https://www.smsnetwork.org/ajax/login/ajax_login1.php",
				$("#login_form").serialize(),
				function(reply)
				{
					$("#errsucc").html("");
					
					if( reply.success )
					{
						console.log("Login successful.");
						console.log("Reply: ");
						console.log(reply);
						background.setSession(reply.php_session_id);
						background.setUser(reply.MemberInfo[0]);
						
						console.log("Getting data (logs etc.)");
						getData();
						
						showStartupView();
						chrome.browserAction.setBadgeText({text: ""});
					}
					else
					{
						$("#errsucc").append("Login failed.");
					}
				},
				"json"
			);
		return false;
	//	});
}

function getbg()
{
	varycolor++;
	return "style='background-color: " + (varycolor % 2 == 0 ? "#fff" : "#FFD9A7") + ";'";
}

$("#help_button").click(function(){
	chrome.tabs.create({'url': 'https://www.smsnetwork.org/help.php'});
});





$("#payson_submit").click(function(){
	var a = $("#payson_amount").attr("value");
	var p = "{amount:"+a+",url:'payments/payson/pay/payments.php',payson_description:'Buy "+a+" credits',payson_price:100}";
	//var p = "{amount:"+a+",url:'payments/paypal/paypal_credits.php'}";
	chrome.tabs.create({"url" : "javascript:"+fakePostCode+" createFormAndBuy("+p+");"});
});

$("#paypal_submit").click(function(){
	var a = $("#paypal_amount").attr("value");
	var p = "{antal:"+a+",url:'payments/paypal/paypal_credits.php'}";
	chrome.tabs.create({"url" : "javascript:"+fakePostCode+" createFormAndBuy("+p+");"});
});

function createFormAndBuy(p) {  
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "https://www.smsnetwork.org/" + p.url);
	
    for(var key in p) 
	{
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", p[key]);
        form.appendChild(hiddenField);
    }
    document.body.appendChild(form);
    form.submit();
};
//minify function
fakePostCode = createFormAndBuy.toString().replace(/(\n|\t)/gm,'');



$("#sendsms_receiver").change(function(){
	AddRecipient($(this).find("option:selected").text(),$(this).find("option:selected").val())
});

$(document).on("click", "remover", function(f)
{ 
	var id = this.id;
	RemoveRecipient(id); 
}); 



function AddRecipient(name, number) {
	if (!document.getElementById(number) && number != "" && number != "Choose") {
		var ni = document.getElementById('myDiv');
		var newdiv = document.createElement('remover');
		newdiv.setAttribute("id",number);
		newdiv.innerHTML = "<span style='cursor:pointer;'><span style='color:red;'>X</span> " + name + "</span><br />";
		ni.appendChild(newdiv);
		//document.getElementById('spaceDiv').style.height = "5px";
		stfubreak = ',00';
		num = stfubreak+number;
		data=document.getElementById('form_recipients').value+num;
		document.getElementById('form_recipients').value=data;
	}
}

function RemoveRecipient(divNum) {
		var divEls = document.getElementById(divNum);
		var data=(",00")+divEls.id;
        var a = document.getElementById('form_recipients').value;
        var gi = a.split(data).join("");
		var d = document.getElementById('myDiv');
		var olddiv = document.getElementById(divNum);
		d.removeChild(olddiv);

		if(document.getElementById("myDiv").getElementsByTagName("div").length == 0) {
			//document.getElementById('spaceDiv').style.height = "0px";
		}
		
        document.getElementById('form_recipients').value=gi;
}
