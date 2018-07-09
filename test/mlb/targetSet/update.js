const _              = require('lodash');
const updatetargetSet = require('../../../lib/resources/mlb/targetSet/update');
const targetSetAction = require('../../../lib/resources/mlb/targetSet');
const nock           = require('nock');

const targetSetConfig = {
  "targetSet": {
    "name": "targetSet1",
    "balancerId": "lb-5470a9fb",
    "deploymentId": "de-12345",
    "protocol": "HTTP",
    "weight": 1,
    "healthCheck": {
      "interval": 10,
      "path": "/healthCheck",
      "port": 80,
      "protocol": "HTTP",
      "timeout": 5,
      "healthyThresholdCount": 2,
      "unhealthyThresholdCount": 3
    },
    "tags": [
      {
        "key": "Environment",
        "value": "Production"
      }
    ]
  }
};

describe("targetSetAction", function() {
  describe("update", function() {
    
    before(function() {
      for(var i = 0; i < 3; i++) {
        nock('https://api.spotinst.io', {"encodedQueryParams": true})
          .put(
            '/loadBalancer/targetSet/ts-12345',
            targetSetConfig
          )
          .reply(
            200,
            {
              "request":  {
                "id":        "037a9796-9a7f-4c60-a967-47d634a1744f",
                "url":       "/loadBalancer/targetSet/ts-12345",
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
      
      updatetargetSet.handler(
        _.merge({
          id:          'ts-12345',
          accessToken: ACCESSTOKEN
        }, targetSetConfig),
        context
      );
    });
    
    it("targetSetAction handler should update an existing group", function(done) {
      var context = {
        done: done
      };
      
      updatetargetSet.handler(
        _.merge({
          id:           'ts-12345',
          ResourceType: 'Custom::mlb-targetSet',
          accessToken:  ACCESSTOKEN
        }, targetSetConfig),
        context
      );
    });
    
    it("lambda handler should update an existing group", function(done) {
      var context = {
        done: done
      };
      
      updatetargetSet.handler(
        _.merge({
          id:           'ts-12345',
          ResourceType: 'Custom::mlb-targetSet',
          requestType:  'update',
          accessToken:  ACCESSTOKEN
        }, targetSetConfig),
        context
      );
    });
  });
});
