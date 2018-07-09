const _                = require('lodash');
const updateDeployment = require('../../../lib/resources/mlb/deployment/update');
const deploymentAction = require('../../../lib/resources/mlb/deployment');
const nock             = require('nock');

const deploymentConfig = {
  "deployment": {
    "name": "test-dep"
  }
};

describe("deploymentAction", function() {
  describe("update", function() {
    
    before(function() {
      for(var i = 0; i < 3; i++) {
        nock('https://api.spotinst.io', {"encodedQueryParams": true})
          .put(
            '/loadBalancer/deployment/dp-6601af317a44',
            deploymentConfig
          )
          .reply(
            200,
            {
              "request":  {
                "id":        "037a9796-9a7f-4c60-a967-47d634a1744f",
                "url":       "/loadBalancer/deployment/dp-6601af317a44",
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
      
      updateDeployment.handler(
        _.merge({
          id:          'dp-6601af317a44',
          accessToken: ACCESSTOKEN
        }, deploymentConfig),
        context
      );
    });
    
    it("deploymentAction handler should update an existing group", function(done) {
      var context = {
        done: done
      };
      
      updateDeployment.handler(
        _.merge({
          id:           'dp-6601af317a44',
          ResourceType: 'Custom::mlb-deployment',
          accessToken:  ACCESSTOKEN
        }, deploymentConfig),
        context
      );
    });
    
    it("lambda handler should update an existing group", function(done) {
      var context = {
        done: done
      };
      
      updateDeployment.handler(
        _.merge({
          id:           'dp-6601af317a44',
          ResourceType: 'Custom::mlb-deployment',
          requestType:  'update',
          accessToken:  ACCESSTOKEN
        }, deploymentConfig),
        context
      );
    });
  });
});
