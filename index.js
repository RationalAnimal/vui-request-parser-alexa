/*
@author Ilya Shubentsov

MIT License

Copyright (c) 2017 Ilya Shubentsov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
'use strict'
var request = require("vui-request");
var platforms = require("vui-platforms");

var parser_alexa = {};

parser_alexa.RequestParser = class {
  constructor(){
  }
  parse(requestToParse, requestToPopulate, sessionToPopulate, stateToPopulate){
    if(typeof requestToParse == "undefined" || typeof requestToPopulate != "object" || typeof sessionToPopulate != "object" || typeof stateToPopulate != "object"){
      return false;
    }
    if(typeof requestToParse == "string"){
      requestToParse = JSON.parse(requestToParse);
    }
    if(requestToParse.version != "1.0"){
      return false;
    }
    // Validate Request object specific bits
    if(typeof requestToParse.request == "undefined" ||
       typeof requestToParse.request.type != "string" ||
       typeof requestToParse.request.requestId != "string" ||
       typeof requestToParse.request.locale != "string" ||
       typeof requestToParse.request.timestamp != "string"){
      return false;
    }
    // Validate Session object specific bits
    if(typeof requestToParse.session == "undefined" ||
       typeof requestToParse.session.sessionId != "string" ||
       typeof requestToParse.session.application == "undefined" ||
       typeof requestToParse.session.application.applicationId != "string" ||
       typeof requestToParse.session.attributes != "object" ||
       typeof requestToParse.session.user == "undefined" ||
       typeof requestToParse.session.user.userId != "string" ||
       typeof requestToParse.session.new != "boolean"){
      return false;
    }

    if(typeof requestToParse.session.attributes != "object"){
      return false;
    }

    // We have finished all the verifications - now start updating args
    // First update the requestToPopulate
    switch(requestToParse.request.type){
      case "LaunchRequest":
        requestToPopulate.setRequestType(request.Request.type.START_SESSION);
        break;
      case "IntentRequest":
        requestToPopulate.setRequestType(request.Request.type.INTENT);
        break;
      case "SessionEndedRequest":
        requestToPopulate.setRequestType(request.Request.type.END_SESSION);
        break;
      default:
        // Do nothing.
    }
    requestToPopulate.setRequestId(requestToParse.request.requestId);
    requestToPopulate.setRequestLocale(requestToParse.request.locale);
    requestToPopulate.setRequestTimeStamp(requestToParse.request.timestamp);
    requestToPopulate.setRequestReason(requestToParse.request.reason);
    if(typeof requestToParse.request.error != "undefined"){
      var error = {};
      if(typeof requestToParse.request.error.message != "undefined"){
        error.message = requestToParse.request.error.message;
      }
      switch(requestToParse.request.error.type){
        case "INVALID_RESPONSE":
          error.code = request.Request.errorCode.INVALID_RESPONSE;
          break;
        case "DEVICE_COMMUNICATION_ERROR":
          error.code = request.Request.errorCode.DEVICE_COMMUNICATION_ERROR;
          break;
        case "INTERNAL_ERROR":
        case "INTERNAL_SERVER_ERROR":
          error.code = request.Request.errorCode.INTERNAL_SERVER_ERROR;
          break;
        default:
          // Do nothing
      }
      requestToPopulate.setRequestError(error);
    }
    // Now update sessionToPopulate
    sessionToPopulate.setCurrentSessionId({"sessionId": requestToParse.session.sessionId, "platformId": platforms.ALEXA});
    sessionToPopulate.setClientId(requestToParse.session.application.applicationId);
    sessionToPopulate.setUserId(requestToParse.session.user.userId);
    sessionToPopulate.setIsNew(requestToParse.session.new);
    // Finally update stateToPopulate
//    console.log("requestToParse.session.attributes: " + JSON.stringify(requestToParse.session.attributes));

    stateToPopulate.parseState(requestToParse.session.attributes, stateToPopulate);
//    console.log("stateToPopulate: " + stateToPopulate.toString());
    return true;
  }

  getPlatformId(){
    return platforms.ALEXA;
  }
};


module.exports = parser_alexa;
