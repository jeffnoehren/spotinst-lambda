const _              = require('lodash');
const updatebalancer = require('../../../lib/resources/mlb/balancer/update');
const balancerAction = require('../../../lib/resources/mlb/balancer');
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
  describe("update", function() {
    
    before(function() {
      for(var i = 0; i < 3; i++) {
        nock('https://api.spotinst.io', {"encodedQueryParams": true})
          .put(
            '/loadBalancer/balancer/lb-12345',
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
              'content-type':                 'application/json; charset=utf-8'
            });
        
      }
    });
    
    it("update handler should update an existing group", function(done) {
      var context = {
        done: done
      };
      
      updatebalancer.handler(
        _.merge({
          id:          'lb-12345',
          accessToken: ACCESSTOKEN
        }, balancerConfig),
        context
      );
    });
    
    it("balancerAction handler should update an existing group", function(done) {
      var context = {
        done: done
      };
      
      updatebalancer.handler(
        _.merge({
          id:           'lb-12345',
          ResourceType: 'Custom::mlb-balancer',
          accessToken:  ACCESSTOKEN
        }, balancerConfig),
        context
      );
    });
    
    it("lambda handler should update an existing group", function(done) {
      var context = {
        done: done
      };
      
      updatebalancer.handler(
        _.merge({
          id:           'lb-12345',
          ResourceType: 'Custom::mlb-balancer',
          requestType:  'update',
          accessToken:  ACCESSTOKEN
        }, balancerConfig),
        context
      );
    });
  });
});
