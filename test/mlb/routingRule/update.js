const _              = require('lodash');
const updateroutingRule = require('../../../lib/resources/mlb/routingRule/update');
const routingRuleAction = require('../../../lib/resources/mlb/routingRule');
const nock           = require('nock');

const routingRuleConfig = {
  "routingRule": {
    "balancerId": "rr-12345",
    "route": "PathRegexp(`/`)",
    "targetSetIds": [
      "ts-12345",
      "ts-67890"
    ],
    "middlewareIds": [
      "mw-23456",
      "mw-7890"
    ],
    "listenerId": "ls-12345",
    "priority": 2,
    "tags": [
      {
        "key": "Environment",
        "value": "Production"
      }
    ]
  }
};

describe("routingRuleAction", function() {
  describe("update", function() {
    
    before(function() {
      for(var i = 0; i < 3; i++) {
        nock('https://api.spotinst.io', {"encodedQueryParams": true})
          .put(
            '/loadBalancer/routingRule/rr-12345',
            routingRuleConfig
          )
          .reply(
            200,
            {
              "request":  {
                "id":        "037a9796-9a7f-4c60-a967-47d634a1744f",
                "url":       "/loadBalancer/routingRule/rr-12345",
                "method":    "PUT",
                "timestamp": "2018-06-29T20:21:14.641Z"
              },
              "response": {
                "status": {
                  "code":    200,
                  "message": "OK"
                }
              }
            },
            {
              'access-control-allow-headers': 'Origin,Accept,Content-Type,X-Requested-With,X-CSRF-Token',
              'access-control-allow-methods': 'GET,POST,DELETE,PUT',
              'access-control-allow-origin':  '*',
              'content-type':                 'application/json; charset=utf-8'
            });
        
      }
    });
    
    it("update handler should update an existing group", function(done) {
      var context = {
        done: done
      };
      
      updateroutingRule.handler(
        _.merge({
          id:          'rr-12345',
          accessToken: ACCESSTOKEN
        }, routingRuleConfig),
        context
      );
    });
    
    it("routingRuleAction handler should update an existing group", function(done) {
      var context = {
        done: done
      };
      
      updateroutingRule.handler(
        _.merge({
          id:           'rr-12345',
          ResourceType: 'Custom::mlb-routingRule',
          accessToken:  ACCESSTOKEN
        }, routingRuleConfig),
        context
      );
    });
    
    it("lambda handler should update an existing group", function(done) {
      var context = {
        done: done
      };
      
      updateroutingRule.handler(
        _.merge({
          id:           'rr-12345',
          ResourceType: 'Custom::mlb-routingRule',
          requestType:  'update',
          accessToken:  ACCESSTOKEN
        }, routingRuleConfig),
        context
      );
    });
  });
});
