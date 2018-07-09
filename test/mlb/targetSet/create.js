const _            = require('lodash');
const assert       = require('assert');
const create       = require('../../../lib/resources/mlb/targetSet/create');
const targetSetAction = require('../../../lib/resources/mlb/targetSet');
const lambda       = require('../../../');
const nock         = require('nock');

const targetSetConfig = {
  "targetSet": {
    "name":         "targetSet1",
    "balancerId":   "lb-5470a9fb",
    "deploymentId": "de-12345",
    "protocol":     "HTTP",
    "weight":       1,
    "healthCheck":  {
      "interval":                10,
      "path":                    "/healthCheck",
      "port":                    80,
      "protocol":                "HTTP",
      "timeout":                 5,
      "healthyThresholdCount":   2,
      "unhealthyThresholdCount": 3
    },
    "tags":         [
      {
        "key":   "Environment",
        "value": "Production"
      }
    ]
  }
};

describe("targetSetAction", function() {
  describe("create resource", function() {
    before(function() {
      for(let i = 0; i < 4; i++) {
        nock('https://api.spotinst.io', {"encodedQueryParams": true})
          .post(
            '/loadBalancer/targetSet',
            targetSetConfig
          )
          .reply(
            200, {
              "status": {
                "code":    200,
                "message": "OK"
              },
              "kind":   "spotinst:lb:targetSet",
              "items":  [
                {
                  "id":           "ts-12345",
                  "deploymentId": "de-12345",
                  "name":         "targetSet1",
                  "balancerId":   "lb-5470a9fb",
                  "protocol":     "HTTP",
                  "port":         null,
                  "weight":       1,
                  "healthCheck":  {
                    "interval":                10,
                    "path":                    "/healthCheck",
                    "port":                    80,
                    "protocol":                "HTTP",
                    "timeout":                 5,
                    "healthyThresholdCount":   2,
                    "unhealthyThresholdCount": 3
                  },
                  "tags":         [
                    {
                      "key":   "Environment",
                      "value": "Production"
                    }
                  ]
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
    
    it("create handler should create a new targetSet", function(done) {
      var context = {
        done: done
      };
      
      create.handler(
        _.merge({accessToken: ACCESSTOKEN}, targetSetConfig),
        context
      );
    });
    
    it("targetSet handler should create a new targetSet", function(done) {
      var context = {
        done: done
      };
      
      targetSetAction.handler(
        _.merge({
          requestType: 'Create',
          accessToken: ACCESSTOKEN
        }, targetSetConfig),
        context
      );
    });
    
    it("lambda handler should create a new targetSet", function(done) {
      var context = {
        done: done
      };
      
      lambda.handler(
        _.merge({
          ResourceType: 'Custom::mlb-targetSet',
          requestType:  'Create',
          accessToken:  ACCESSTOKEN
        }, targetSetConfig),
        context
      );
    });
    
    it("lambda handler should create a new targetSet from CloudFormation", function(done) {
      var context = {
        done: done
      };
      
      lambda.handler({
          ResourceType:       'Custom::mlb-targetSet',
          RequestType:        'Create',
          ResourceProperties: _.merge({accessToken: ACCESSTOKEN}, targetSetConfig)
        },
        context
      );
    });
    
  });
});
