/////
var script = document.createElement('script');
script.src = 'js/jquery.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);
/////

chrome.browserAction.setBadgeText({text: "x"});
var session_id = null;
var user = null;
var phonebook = null;
var countrycode = null;
var sent = null;
var received = null;
var originators = null;
var ads = null;
var new_messages = 0;

function setSession(id)
{
	console.log("Setting session_id to: " + id);
	session_id = id;
}

function getSession()
{
	console.log("Getting session_id: " + session_id);
	return session_id;
}

function getUser()
{
	return user;
}

function setUser(data)
{
	console.log("Setting user:");
	console.log(data);
	user = data;
}

// Update badge ever 60 seconds
window.setInterval(getNewMessages, 30000);
function getNewMessages()
{
	if( user == null || session_id == null ) 
	{
		chrome.browserAction.setBadgeText({text: "x"});
		return;
	}
	
	$.post
	(
		"https://www.smsnetwork.org/_scripts/members-update.php",
		{
			user_id        : user.id,
			php_session_id : session_id
		},
		function(reply)
		{
			console.log(reply);
			if(reply.new_messages != 0)
			{
				chrome.browserAction.setBadgeText({text: reply.new_messages.toString()});
				console.log("Set badge to: " + reply.new_messages);
				new_messages = reply.new_messages;
			}
		},
		"json"
	);
	//
}


