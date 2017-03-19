/*
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
var expect = require("chai").expect;
var request_parser_alexa = require("../index.js");
var request = require("vui-request");
var session = require("vui-session");
var state = require("vui-state");

describe("vui-request-parser", function() {
  describe("Request Parser Alexa", function() {
//    var app = {};
//    request_parser_alexa.addRequestToApp(app);
    var startSession = {
      "session": {
        "sessionId": "SessionId.a12b3456-7890-1c23-d45e-67f890123gh4",
        "application": {
          "applicationId": "amzn1.ask.skill.a12b3c4d-e5fg-6780-1h2i-3j4567890k1l"
        },
        "attributes": {},
        "user": {
          "userId": "amzn1.ask.account.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
        },
        "new": true
      },
      "request": {
        "type": "LaunchRequest",
        "requestId": "EdwRequestId.12a345b6-cde4-5fg6-7h8i-j9k012l3mn45",
        "locale": "en-US",
        "timestamp": "2017-03-18T19:12:28Z"
      },
      "version": "1.0"
    };

    var intentRequest = {
      "session": {
        "sessionId": "SessionId.a12b3456-7890-1c23-d45e-67f890123gh4",
        "application": {
          "applicationId": "amzn1.ask.skill.a12b3c4d-e5fg-6780-1h2i-3j4567890k1l"
        },
        "attributes": {
          "currentFlow": "USER_INFO",
          "lastPrompt": "USER_INFO.PHONE",
          "gatheredAnswers": {"TEST":{"FLOW":{"PROMPT":"simple string value","ANOTHER_PROMPT":42}}},
          "autoIncrementPrompts": false,
          "promptCounts": {"TEST":{"FLOW":{"PROMPT1":2,"PROMPT2":0,"PROMPT":1}}}
        },
        "user": {
          "userId": "amzn1.ask.account.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
        },
        "new": false
      },
      "request": {
        "type": "IntentRequest",
        "requestId": "EdwRequestId.12a345b6-cde4-5fg6-7h8i-j9k012l3mn45",
        "locale": "en-US",
        "timestamp": "2017-03-18T19:12:28Z",
        "intent": {
          "name": "UserPhoneNumberIntent",
          "slots": {
            "NumberSlot": {
              "name": "NumberSlot",
              "value": "1"
            }
          }
        }
      },
      "version": "1.0"
    };

    var sessionEndedRequest = {
      "session": {
        "sessionId": "SessionId.a12b3456-7890-1c23-d45e-67f890123gh4",
        "application": {
          "applicationId": "amzn1.ask.skill.a12b3c4d-e5fg-6780-1h2i-3j4567890k1l"
        },
        "attributes": {
          "currentFlow": "USER_INFO",
          "lastPrompt": "USER_INFO.PHONE",
          "gatheredAnswers": {"TEST":{"FLOW":{"PROMPT":"simple string value","ANOTHER_PROMPT":42}}},
          "autoIncrementPrompts": false,
          "promptCounts": {"TEST":{"FLOW":{"PROMPT1":2,"PROMPT2":0,"PROMPT":1}}}
        },
        "user": {
          "userId": "amzn1.ask.account.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
        },
        "new": false
      },
      "request": {
        "type": "SessionEndedRequest",
        "requestId": "EdwRequestId.12a345b6-cde4-5fg6-7h8i-j9k012l3mn45",
        "reason": "some reason",
        "locale": "en-US",
        "error": {
          "type": "INTERNAL_SERVER_ERROR",
          "message": "something went wrong"
        },
        "timestamp": "2017-03-18T19:12:28Z",
      },
      "version": "1.0"
    };

    it("verify Request parsing start session request.", function() {
      var parserAlexa = new request_parser_alexa.RequestParser();
      var requestToPopulate = new request.Request();
      var sessionToPopulate = new session.Session();
      var stateToPopulate = new state.State();
      var parseResult = parserAlexa.parse(startSession, requestToPopulate, sessionToPopulate, stateToPopulate);
      expect(parseResult).to.equal(true);

      expect(requestToPopulate.getRequestType()).to.equal("START_SESSION");
      expect(requestToPopulate.getRequestId()).to.equal("EdwRequestId.12a345b6-cde4-5fg6-7h8i-j9k012l3mn45");
      expect(requestToPopulate.getRequestLocale()).to.equal("en-US");
      expect(requestToPopulate.getRequestTimeStamp()).to.equal("2017-03-18T19:12:28Z");
      expect(requestToPopulate.getRequestMatchCount()).to.equal(0);
      expect(requestToPopulate.getRequestReason()).to.equal(undefined);
      expect(requestToPopulate.getRequestError()).to.equal(undefined);

      expect(sessionToPopulate.getCurrentSessionId()).to.eql({"sessionId": "SessionId.a12b3456-7890-1c23-d45e-67f890123gh4", "platformId": "Alexa"});
      expect(sessionToPopulate.getClientId()).to.equal("amzn1.ask.skill.a12b3c4d-e5fg-6780-1h2i-3j4567890k1l");
      expect(sessionToPopulate.getUserId()).to.equal("amzn1.ask.account.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
      expect(sessionToPopulate.getIsNew()).to.equal(true);
      expect(sessionToPopulate.getUserFirstName()).to.equal(undefined);
      expect(sessionToPopulate.getUserLastName()).to.equal(undefined);

      expect (stateToPopulate.getCurrentFlow()).to.equal(undefined);
      expect (stateToPopulate.getLastPrompt()).to.equal(undefined);
      expect (stateToPopulate.gatheredAnswers).to.eql({});
      expect (stateToPopulate.getPromptCountAutoIncrement()).to.equal(false);
      expect (stateToPopulate.promptCounts).to.eql({});

    });
    it("verify Request parsing intent request.", function() {
      var parserAlexa = new request_parser_alexa.RequestParser();
      var requestToPopulate = new request.Request();
      var sessionToPopulate = new session.Session();
      var stateToPopulate = new state.State();
      var parseResult = parserAlexa.parse(intentRequest, requestToPopulate, sessionToPopulate, stateToPopulate);
      expect(parseResult).to.equal(true);

      expect(requestToPopulate.getRequestType()).to.equal("INTENT");
      expect(requestToPopulate.getRequestId()).to.equal("EdwRequestId.12a345b6-cde4-5fg6-7h8i-j9k012l3mn45");
      expect(requestToPopulate.getRequestLocale()).to.equal("en-US");
      expect(requestToPopulate.getRequestTimeStamp()).to.equal("2017-03-18T19:12:28Z");
      expect(requestToPopulate.getRequestMatchCount()).to.equal(0);
      expect(requestToPopulate.getRequestReason()).to.equal(undefined);
      expect(requestToPopulate.getRequestError()).to.equal(undefined);

      expect(sessionToPopulate.getCurrentSessionId()).to.eql({"sessionId": "SessionId.a12b3456-7890-1c23-d45e-67f890123gh4", "platformId": "Alexa"});
      expect(sessionToPopulate.getClientId()).to.equal("amzn1.ask.skill.a12b3c4d-e5fg-6780-1h2i-3j4567890k1l");
      expect(sessionToPopulate.getUserId()).to.equal("amzn1.ask.account.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
      expect(sessionToPopulate.getIsNew()).to.equal(false);
      expect(sessionToPopulate.getUserFirstName()).to.equal(undefined);
      expect(sessionToPopulate.getUserLastName()).to.equal(undefined);

      expect (stateToPopulate.getCurrentFlow()).to.equal("USER_INFO");
      expect (stateToPopulate.getLastPrompt()).to.equal("USER_INFO.PHONE");
      expect (stateToPopulate.gatheredAnswers).to.eql({"TEST":{"FLOW":{"PROMPT":"simple string value","ANOTHER_PROMPT":42}}});
      expect (stateToPopulate.getPromptCountAutoIncrement()).to.equal(false);
      expect (stateToPopulate.promptCounts).to.eql({"TEST":{"FLOW":{"PROMPT1":2,"PROMPT2":0,"PROMPT":1}}});

    });

    it("verify Request parsing session ended request.", function() {
      var parserAlexa = new request_parser_alexa.RequestParser();
      var requestToPopulate = new request.Request();
      var sessionToPopulate = new session.Session();
      var stateToPopulate = new state.State();
      var parseResult = parserAlexa.parse(sessionEndedRequest, requestToPopulate, sessionToPopulate, stateToPopulate);
      expect(parseResult).to.equal(true);

      expect(requestToPopulate.getRequestType()).to.equal("END_SESSION");
      expect(requestToPopulate.getRequestId()).to.equal("EdwRequestId.12a345b6-cde4-5fg6-7h8i-j9k012l3mn45");
      expect(requestToPopulate.getRequestLocale()).to.equal("en-US");
      expect(requestToPopulate.getRequestTimeStamp()).to.equal("2017-03-18T19:12:28Z");
      expect(requestToPopulate.getRequestMatchCount()).to.equal(0);
      expect(requestToPopulate.getRequestReason()).to.equal("some reason");
      expect(requestToPopulate.getRequestError()).to.eql({"code": "INTERNAL_SERVER_ERROR", "message": "something went wrong"});

      expect(sessionToPopulate.getCurrentSessionId()).to.eql({"sessionId": "SessionId.a12b3456-7890-1c23-d45e-67f890123gh4", "platformId": "Alexa"});
      expect(sessionToPopulate.getClientId()).to.equal("amzn1.ask.skill.a12b3c4d-e5fg-6780-1h2i-3j4567890k1l");
      expect(sessionToPopulate.getUserId()).to.equal("amzn1.ask.account.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
      expect(sessionToPopulate.getIsNew()).to.equal(false);
      expect(sessionToPopulate.getUserFirstName()).to.equal(undefined);
      expect(sessionToPopulate.getUserLastName()).to.equal(undefined);

      expect (stateToPopulate.getCurrentFlow()).to.equal("USER_INFO");
      expect (stateToPopulate.getLastPrompt()).to.equal("USER_INFO.PHONE");
      expect (stateToPopulate.gatheredAnswers).to.eql({"TEST":{"FLOW":{"PROMPT":"simple string value","ANOTHER_PROMPT":42}}});
      expect (stateToPopulate.getPromptCountAutoIncrement()).to.equal(false);
      expect (stateToPopulate.promptCounts).to.eql({"TEST":{"FLOW":{"PROMPT1":2,"PROMPT2":0,"PROMPT":1}}});

    });



  });
});
