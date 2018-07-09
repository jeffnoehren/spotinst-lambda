const _              = require('lodash');
const assert         = require('assert');
const deletelistener = require('../../../lib/resources/mlb/listener/delete');
const listenerAction = require('../../../lib/resources/mlb/listener');
const lambda         = require('../../../');
const nock           = require('nock');

describe("listenerAction", function() {
  describe("delete resource", function() {
    
    before(function() {
      for(let i = 0; i < 3; i++) {
        nock('https://api.spotinst.io', {"encodedQueryParams": true})
          .delete('/loadBalancer/listener/lb-12345')
          .reply(200,
            {
              "request":  {
                "id":        "c60c4796-fbde-4e03-bcef-1cc97e374376",
                "url":       "/loadBalancer/listener/lb-12345",
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
          assert.equal(obj.request.url, "/loadBalancer/listener/lb-12345");
          done(err, obj);
        }
      };
      deletelistener.handler({
          accessToken: ACCESSTOKEN,
          id:          'lb-12345'
        },
        context
      );
    });
    
    it("listenerAction handler should delete an existing group", function(done) {
      var context = {
        done: function(err, obj) {
          assert.ifError(err);
          assert.equal(obj.request.url, "/loadBalancer/listener/lb-12345");
          done(err, obj);
        }
      };
      
      listenerAction.handler({
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
          assert.equal(obj.request.url, "/loadBalancer/listener/lb-12345");
          done(err, obj);
        }
      };
      
      lambda.handler({
          ResourceType: 'Custom::mlb-listener',
          requestType:  'delete',
          accessToken:  ACCESSTOKEN,
          id:           'lb-12345'
        },
        context
      );
    });
    
    it("lambda handler should delete for CloudFormation", function(done) {
      
      nock('https://api.spotinst.io', {"encodedQueryParams": true})
        .delete('/loadBalancer/listener/lb-12345')
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
          ResourceType:       'Custom::mlb-listener',
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
