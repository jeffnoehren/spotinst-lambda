const assert           = require('assert');
const deletebalancer      = require('../../../lib/resources/mlb/balancer/delete');
const balancerAction = require('../../../lib/resources/mlb/balancer');
const lambda           = require('../../../');
const nock             = require('nock');

describe("balancerAction", function() {
  describe("delete resource", function() {
    
    before(function() {
      for(let i = 0; i < 3; i++) {
        nock('https://api.spotinst.io', {"encodedQueryParams": true})
          .delete('/loadBalancer/balancer/lb-12345')
          .reply(200,
            {
              "request":  {
                "id":        "c60c4796-fbde-4e03-bcef-1cc97e374376",
                "url":       "/loadBalancer/balancer/lb-12345",
                "method":    "DELETE",
                "timestamp": "2018-06-29T20:08:34.036Z"
              },
              "response": {
                "status": {
                  "code":    200,
                  "message": "OK"
                }
              }
            },
            {
              'content-type': 'application/json; charset=utf-8',
              vary:           'Accept-Encoding',
              connection:     'Close'
            });
      }
    });
    
    it("delete handler should delete an existing group", function(done) {
      let context = {
        done: function(err, obj) {
          assert.ifError(err);
          assert.equal(obj.request.url, "/loadBalancer/balancer/lb-12345");
          done(err, obj);
        }
      };
      deletebalancer.handler({
          accessToken: ACCESSTOKEN,
          id:          'lb-12345'
        },
        context
      );
    });
    
    it("balancerAction handler should delete an existing group", function(done) {
      var context = {
        done: function(err, obj) {
          assert.ifError(err);
          assert.equal(obj.request.url, "/loadBalancer/balancer/lb-12345");
          done(err, obj);
        }
      };
      
      balancerAction.handler({
          requestType: 'delete',
          accessToken: ACCESSTOKEN,
          id:          'lb-12345'
        },
        context
      );
    });
    
    it("lambda handler should delete an existing group", function(done) {
      var context = {
        done: function(err, obj) {
          assert.ifError(err);
          assert.equal(obj.request.url, "/loadBalancer/balancer/lb-12345");
          done(err, obj);
        }
      };
      
      lambda.handler({
          ResourceType: 'Custom::mlb-balancer',
          requestType:  'delete',
          accessToken:  ACCESSTOKEN,
          id:           'lb-12345'
        },
        context
      );
    });
    
    it("lambda handler should delete for CloudFormation", function(done) {
      
      nock('https://api.spotinst.io', {"encodedQueryParams": true})
        .delete('/loadBalancer/balancer/lb-12345')
        .reply(200, {});
      
      nock('https://fake.url')
        .put('/', {
          "Status":            "SUCCESS",
          "Reason":            "See the details in CloudWatch Log Stream: undefined",
          "StackId":           "arn:aws:cloudformation:us-east-1:namespace:stack/stack-name/guid",
          "RequestId":         "unique id for this create request",
          "LogicalResourceId": "name of resource in template"
        })
        .reply(200, {});
      
      var context = {
        done: function(err, obj) {
          assert.ifError(err);
          done(err, obj);
        }
      };
      
      lambda.handler({
          ResourceType:       'Custom::mlb-balancer',
          ResourceProperties: {
            accessToken: ACCESSTOKEN,
          },
          RequestType:        "Delete",
          RequestId:          "unique id for this create request",
          ResponseURL:        "https://fake.url",
          LogicalResourceId:  "name of resource in template",
          PhysicalResourceId: 'lb-12345',
          StackId:            "arn:aws:cloudformation:us-east-1:namespace:stack/stack-name/guid"
        },
        context);
    });
  });
});
