const _                = require('lodash');
const assert           = require('assert');
const create           = require('../../../lib/resources/mlb/deployment/create');
const deploymentAction = require('../../../lib/resources/mlb/deployment');
const lambda           = require('../../../');
const nock             = require('nock');

const deploymentConfig = {
  "deployment": {
    "name": "test-dep"
  }
};

describe("deploymentAction", function() {
  describe("create resource", function() {
    before(function() {
      for(let i = 0; i < 4; i++) {
        nock('https://api.spotinst.io', {"encodedQueryParams": true})
          .post(
            '/loadBalancer/deployment',
            deploymentConfig
          )
          .reply(
            200,
            {
              "request":  {
                "id":        "8765536e-612d-497b-a9a8-29a71c294274",
                "url":       "/loadBalancer/deployment",
                "method":    "POST",
                "timestamp": "2018-07-08T11:49:04.351Z"
              },
              "response": {
                "status": {
                  "code":    200,
                  "message": "OK"
                },
                "kind":   "spotinst:lb:deployment",
                "items":  [{
                  "id":        "dp-2b4a66218afc",
                  "name":      "test-dep",
                  "accountId": "dp-6601af317a44",
                  "updatedAt": "2018-07-08T11:49:04.343Z",
                  "createdAt": "2018-07-08T11:49:04.343Z"
                }],
                "count":  1
              }
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
    
    it("create handler should create a new deployment", function(done) {
      var context = {
        done: done
      };
      
      create.handler(
        _.merge({accessToken: ACCESSTOKEN}, deploymentConfig),
        context
      );
    });
    
    it("deployment handler should create a new deployment", function(done) {
      var context = {
        done: done
      };
      
      deploymentAction.handler(
        _.merge({
          requestType: 'Create',
          accessToken: ACCESSTOKEN
        }, deploymentConfig),
        context
      );
    });
    
    it("lambda handler should create a new deployment", function(done) {
      var context = {
        done: done
      };
      
      lambda.handler(
        _.merge({
          ResourceType: 'Custom::mlb-deployment',
          requestType:  'Create',
          accessToken:  ACCESSTOKEN
        }, deploymentConfig),
        context
      );
    });
    
    it("lambda handler should create a new deployment from CloudFormation", function(done) {
      var context = {
        done: done
      };
      
      lambda.handler({
          ResourceType:       'Custom::mlb-deployment',
          RequestType:        'Create',
          ResourceProperties: _.merge({accessToken: ACCESSTOKEN}, deploymentConfig)
        },
        context
      );
    });
    
  });
});
