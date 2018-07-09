const _              = require('lodash');
const assert         = require('assert');
const create         = require('../../../lib/resources/mlb/balancer/create');
const balancerAction = require('../../../lib/resources/mlb/balancer');
const lambda         = require('../../../');
const nock           = require('nock');

const balancerConfig = {
  "balancer": {
    "name":     "bestLoadBalancerInTheWorld",
    "timeouts": {
      "draining": 300,
      "idle":     60
    },
    "tags":     [
      {
        "key":   "Environment",
        "value": "Production"
      }
    ]
  }
};

describe("balancerAction", function() {
  describe("create resource", function() {
    before(function() {
      for(let i = 0; i < 4; i++) {
        nock('https://api.spotinst.io', {"encodedQueryParams": true})
          .post(
            '/loadBalancer/balancer',
            balancerConfig
          )
          .reply(
            200,
            {
              "status": {
                "code":    200,
                "message": "OK"
              },
              "kind":   "spotinst:lb:balancer",
              "items":  [
                {
                  "id":              "lb-12345",
                  "name":            "bestLoadBalancerInTheWorld",
                  "timeouts":        {
                    "draining": 300,
                    "idle":     60
                  },
                  "dnsCnameAliases": [],
                  "dnsRrType":       "A",
                  "dnsRrName":       "bestloadbalancerintheworld.lb-380283967edf.dev.lb1.spotinst.io",
                  "tags":            [
                    {
                      "key":   "Environment",
                      "value": "Production"
                    }
                  ]
                }
              ]
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
    
    it("create handler should create a new balancer", function(done) {
      var context = {
        done: done
      };
      
      create.handler(
        _.merge({accessToken: ACCESSTOKEN}, balancerConfig),
        context
      );
    });
    
    it("balancer handler should create a new balancer", function(done) {
      var context = {
        done: done
      };
      
      balancerAction.handler(
        _.merge({
          requestType: 'Create',
          accessToken: ACCESSTOKEN
        }, balancerConfig),
        context
      );
    });
    
    it("lambda handler should create a new balancer", function(done) {
      var context = {
        done: done
      };
      
      lambda.handler(
        _.merge({
          ResourceType: 'Custom::mlb-balancer',
          requestType:  'Create',
          accessToken:  ACCESSTOKEN
        }, balancerConfig),
        context
      );
    });
    
    it("lambda handler should create a new balancer from CloudFormation", function(done) {
      var context = {
        done: done
      };
      
      lambda.handler({
          ResourceType:       'Custom::mlb-balancer',
          RequestType:        'Create',
          ResourceProperties: _.merge({accessToken: ACCESSTOKEN}, balancerConfig)
        },
        context
      );
    });
    
  });
});
