// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
	try {
		console.log("event.session.application.applicationId=" + event.session.application.applicationId);

		/**
		 * Uncomment this if statement and populate with your skill's application ID to
		 * prevent someone else from configuring a skill that sends requests to this function.
		 */
		/*
		if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.[unique-value-here]") {
		     context.fail("Invalid Application ID");
		}
		*/

		if (event.session.new) {
			onSessionStarted({
				requestId: event.request.requestId
			}, event.session);
		}

		if (event.request.type === "LaunchRequest") {
			onLaunch(event.request,
				event.session,
				function callback(sessionAttributes, speechletResponse) {
					context.succeed(buildResponse(sessionAttributes, speechletResponse));
				});
		} else if (event.request.type === "IntentRequest") {
			onIntent(event.request,
				event.session,
				function callback(sessionAttributes, speechletResponse) {
					context.succeed(buildResponse(sessionAttributes, speechletResponse));
				});
		} else if (event.request.type === "SessionEndedRequest") {
			onSessionEnded(event.request, event.session);
			context.succeed();
		}
	} catch (e) {
		context.fail("Exception: " + e);
	}
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
	console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
		", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
	console.log("onLaunch requestId=" + launchRequest.requestId +
		", sessionId=" + session.sessionId);

	// Dispatch to your skill's launch.
	getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
	console.log("onIntent requestId=" + intentRequest.requestId +
		", sessionId=" + session.sessionId);

	var intent = intentRequest.intent,
		intentName = intentRequest.intent.name;

	/*getWelcomeResponse(callback);
	handleSessionEndRequest(callback);*/

	// Dispatch to your skill's intent handlers
	if ("GetPortfolioStatus" === intentName) {
		getPortfolioStatusResponse(intent, session, callback);
	} else if ("CheckAccountBalance" === intentName) {
		getCheckAccountBalanceResponse(intent, session, callback);
	} else if ("SetBuyOrder" === intentName) {
		getSetBuyOrderResponse(intent, session, callback);
	} else if ("ConfirmBuyOrder" === intentName) {
		getConfirmBuyOrderResponse(intent, session, callback);
	} else if ("StockRecommendations" === intentName) {
		getStockRecommendationsResponse(intent, session, callback);
	} else {
		throw "Invalid intent";
	}
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
	console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
		", sessionId=" + session.sessionId);
	// Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
	// If we wanted to initialize the session to have some attributes we could add those here.
	var sessionAttributes = {};
	var cardTitle = "Welcome";
	var speechOutput = "Welcome !!! this is Alexa your Personal Equity Portfolio Assistance. How can I help you today?";
	// If the user either does not reply to the welcome message or says something that is not
	// understood, they will be prompted again with this text.
	var repromptText = "How can I help you today?";
	var shouldEndSession = false;

	callback(sessionAttributes,
		buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getStockRecommendationsResponse(intent, session, callback) {
	var sessionAttributes = {};
	var repromptText = null;
	var speechOutput = "";
	var shouldEndSession = true;

	speechOutput = "DSP Merrill Lynch - suggest buying for INFY at Range of rupees 1176 to rupees 1180 with stop loss at rupees 1150 estimate growth 6 percentage in next 12 month. " +
		"JP Morgan Equity - suggest sale of BAJAJ AUTO at the range of 500 to 520 rupees with stop loss at rupees 521 estimate loss of 5 percentage in next 6 month. ";

	callback(sessionAttributes,
		buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}

function getPortfolioStatusResponse(intent, session, callback) {
	var sessionAttributes = {};
	var repromptText = null;
	var speechOutput = "";
	var shouldEndSession = true;

	speechOutput = "AXISBANK Open today at 526.9 rupees and went up to 533.9 rupees. Last Trading price was 532.7 rupees. Total change in amount from previous day is 9.25 rupees that is 1.77 percentage. " +
		"TATAMOTORS Open today at 461 rupees and went down to 457.3 rupees. Last Trading price was 462.25 rupees. Total change in amount from previous day is 7.9 that is 1.74 percentage. " +
		"BAJAJ AUTO Open today at 2573 rupees and went up to 2589 rupees. Last Trading price was 2572 rupees. Total change in amount from previous day is 4.9 that is 0.19 percentage.";

	callback(sessionAttributes,
		buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}

function getCheckAccountBalanceResponse(intent, session, callback){
	var sessionAttributes = {};
	var repromptText = null;
	var speechOutput = "";
	var shouldEndSession = true;

	speechOutput = "Your account balance is one Lakh twenty thousand.";

	callback(sessionAttributes,
		buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));	
}

function getConfirmBuyOrderResponse(intent, session, callback){
	var sessionAttributes = {};
	var repromptText = null;
	var speechOutput = "";
	var shouldEndSession = true;

	speechOutput = "Buy order is set. Thank you.";

	callback(sessionAttributes,
		buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));	
}

/**
 * Sets the SetBuyOrder in the session and prepares the speech to reply to the user.
 */
function getSetBuyOrderResponse(intent, session, callback) {

	var cardTitle = intent.name;
	var company = intent.slots.Company.value;
	var date = intent.slots.Date.value;
	var amount = intent.slots.Amount.value;
	var to = intent.slots.RangeTo.value;
	var from = intent.slots.RangeFrom.value;

	var repromptText = "";
	var sessionAttributes = {};
	var shouldEndSession = false;
	var speechOutput = "";

	sessionAttributes = createSetBuyOrderAttributes(company, date, amount, to, from);

	speechOutput = " Order for " + company + " for " + amount + " rupees at the rate range of rupees " + to + " with stop loss at rupees " + from + " is set. " + "Could you please confirm again?";
	repromptText = "Could you please confirm again?";

	callback(sessionAttributes,
		buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function createSetBuyOrderAttributes(company, date, amount, to, from) {
	return {
		company: company,
		date: date,
		amount: amount,
		to: to,
		from: from
	};
}

function handleSessionEndRequest(callback) {
	var cardTitle = "Session Ended";
	var speechOutput = "Thank you for trying the Stock Agent. Have a nice day!";
	// Setting this to true ends the session and exits the skill.
	var shouldEndSession = true;

	callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}


// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
	return {
		outputSpeech: {
			type: "PlainText",
			text: output
		},
		card: {
			type: "Simple",
			title: "SessionSpeechlet - " + title,
			content: "SessionSpeechlet - " + output
		},
		reprompt: {
			outputSpeech: {
				type: "PlainText",
				text: repromptText
			}
		},
		shouldEndSession: shouldEndSession
	};
}

function buildResponse(sessionAttributes, speechletResponse) {
	return {
		version: "1.0",
		sessionAttributes: sessionAttributes,
		response: speechletResponse
	};
}