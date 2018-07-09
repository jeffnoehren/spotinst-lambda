const _                 = require('lodash');
const assert            = require('assert');
const create            = require('../../../lib/resources/mlb/routingRule/create');
const routingRuleAction = require('../../../lib/resources/mlb/routingRule');
const lambda            = require('../../../');
const nock              = require('nock');

const routingRuleConfig = {
  "routingRule": {
    "balancerId":    "rr-12345",
    "route":         "PathRegexp(`/`)",
    "targetSetIds":  [
      "ts-12345",
      "ts-67890"
    ],
    "middlewareIds": [
      "mw-23456",
      "mw-7890"
    ],
    "listenerId":    "ls-12345",
    "priority":      2,
    "tags":          [
      {
        "key":   "Environment",
        "value": "Production"
      }
    ]
  }
};

describe("routingRuleAction", function() {
  describe("create resource", function() {
    before(function() {
      for(let i = 0; i < 4; i++) {
        nock('https://api.spotinst.io', {"encodedQueryParams": true})
          .post(
            '/loadBalancer/routingRule',
            routingRuleConfig
          )
          .reply(
            200,
            {
              "status": {
                "code":    200,
                "message": "OK"
              },
              "kind":   "spotinst:lb:routingRule",
              "items":  [
                {
                  "id":            "rr-12345",
                  "balancerId":    "lb-12345",
                  "protocol":      "HTTP",
                  "route":         "PathRegexp(`/`)",
                  "targetSetIds":  [
                    "ts-12345",
                    "ts-67890"
                  ],
                  "middlewareIds": [
                    "mw-23456",
                    "mw-7890"
                  ],
                  "listenerId":    "ls-12345",
                  "tags":          [
                    {
                      "key":   "Environment",
                      "value": "Production"
                    }
                  ],
                  "listenerId":    "ls-12345",
                  "strategy":      "ROUNDROBIN",
                  "priority":      2
                }
              ],
              "count":  1
            },
            {
              'access-control-allow-headers': 'Origin,Accept,Content-Type,X-Requested-With,X-CSRF-Token',
              'access-control-allow-methods': 'GET,POST,DELETE,PUT',
              'access-control-allow-origin':  '*',
              'content-type':                 'application/json; charset=utf-8',
              connection:                     'Close'
            }
          );
        
      }
    });
    
    it("create handler should create a new routingRule", function(done) {
      var context = {
        done: done
      };
      
      create.handler(
        _.merge({accessToken: ACCESSTOKEN}, routingRuleConfig),
        context
      );
    });
    
    it("routingRule handler should create a new routingRule", function(done) {
      var context = {
        done: done
      };
      
      routingRuleAction.handler(
        _.merge({
          requestType: 'Create',
          accessToken: ACCESSTOKEN
        }, routingRuleConfig),
        context
      );
    });
    
    it("lambda handler should create a new routingRule", function(done) {
      var context = {
        done: done
      };
      
      lambda.handler(
        _.merge({
          ResourceType: 'Custom::mlb-routingRule',
          requestType:  'Create',
          accessToken:  ACCESSTOKEN
        }, routingRuleConfig),
        context
      );
    });
    
    it("lambda handler should create a new routingRule from CloudFormation", function(done) {
      var context = {
        done: done
      };
      
      lambda.handler({
          ResourceType:       'Custom::mlb-routingRule',
          RequestType:        'Create',
          ResourceProperties: _.merge({accessToken: ACCESSTOKEN}, routingRuleConfig)
        },
        context
      );
    });
    
  });
});
