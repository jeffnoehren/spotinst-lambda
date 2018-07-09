const _              = require('lodash');
const updatelistener = require('../../../lib/resources/mlb/listener/update');
const listenerAction = require('../../../lib/resources/mlb/listener');
const nock           = require('nock');

const listenerConfig = {
  "listener": {
    "balancerId": "lb-5470a9fb",
    "protocol": "HTTPS",
    "port": "443",
    "tlsConfig": {
      "minVersion": "TLS10",
      "maxVersion": "TLS12",
      "sessionTicketsDisabled": true,
      "preferServerCipherSuites": true,
      "cipherSuites": [
        "TLS_RSA_WITH_AES_256_CBC_SHA",
        "TLS_RSA_WITH_AES_128_CBC_SHA256"
      ],
      "insecureSkipVerify": false,
      "certificateIds": [
        "ce-12345",
        "ce-67890"
      ]
    },
    "tags": [
      {
        "key": "Environment",
        "value": "Production"
      }
    ]
  }
};

describe("listenerAction", function() {
  describe("update", function() {
    
    before(function() {
      for(var i = 0; i < 3; i++) {
        nock('https://api.spotinst.io', {"encodedQueryParams": true})
          .put(
            '/loadBalancer/listener/lb-12345',
            listenerConfig
          )
          .reply(
            200,
            {
              "request":  {
                "id":        "037a9796-9a7f-4c60-a967-47d634a1744f",
                "url":       "/loadBalancer/listener/lb-12345",
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
      
      updatelistener.handler(
        _.merge({
          id:          'lb-12345',
          accessToken: ACCESSTOKEN
        }, listenerConfig),
        context
      );
    });
    
    it("listenerAction handler should update an existing group", function(done) {
      var context = {
        done: done
      };
      
      updatelistener.handler(
        _.merge({
          id:           'lb-12345',
          ResourceType: 'Custom::mlb-listener',
          accessToken:  ACCESSTOKEN
        }, listenerConfig),
        context
      );
    });
    
    it("lambda handler should update an existing group", function(done) {
      var context = {
        done: done
      };
      
      updatelistener.handler(
        _.merge({
          id:           'lb-12345',
          ResourceType: 'Custom::mlb-listener',
          requestType:  'update',
          accessToken:  ACCESSTOKEN
        }, listenerConfig),
        context
      );
    });
  });
});
