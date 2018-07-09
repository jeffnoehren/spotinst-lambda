const _              = require('lodash');
const assert         = require('assert');
const create         = require('../../../lib/resources/mlb/listener/create');
const listenerAction = require('../../../lib/resources/mlb/listener');
const lambda         = require('../../../');
const nock           = require('nock');

const listenerConfig = {
  "listener": {
    "balancerId": "lb-5470a9fb",
    "protocol":   "HTTPS",
    "port":       "443",
    "tlsConfig":  {
      "minVersion":               "TLS10",
      "maxVersion":               "TLS12",
      "sessionTicketsDisabled":   true,
      "preferServerCipherSuites": true,
      "cipherSuites":             [
        "TLS_RSA_WITH_AES_256_CBC_SHA",
        "TLS_RSA_WITH_AES_128_CBC_SHA256"
      ],
      "insecureSkipVerify":       false,
      "certificateIds":           [
        "ce-12345",
        "ce-67890"
      ]
    },
    "tags":       [
      {
        "key":   "Environment",
        "value": "Production"
      }
    ]
  }
};

describe("listenerAction", function() {
  describe("create resource", function() {
    before(function() {
      for(let i = 0; i < 4; i++) {
        nock('https://api.spotinst.io', {"encodedQueryParams": true})
          .post(
            '/loadBalancer/listener',
            listenerConfig
          )
          .reply(
            200,
            {
              "status": {
                "code":    200,
                "message": "OK"
              },
              "kind":   "spotinst:lb:listener",
              "items":  [
                {
                  "id":         "ls-12345",
                  "balancerId": "lb-5470a9fb",
                  "protocol":   "HTTPS",
                  "port":       "443",
                  "tlsConfig":  {
                    "minVersion":               "TLS10",
                    "maxVersion":               "TLS12",
                    "sessionTicketsDisabled":   true,
                    "preferServerCipherSuites": true,
                    "cipherSuites":             [
                      "TLS_RSA_WITH_AES_256_CBC_SHA",
                      "TLS_RSA_WITH_AES_128_CBC_SHA256"
                    ],
                    "insecureSkipVerify":       false,
                    "certificateIds":           [
                      "ce-12345",
                      "ce-67890"
                    ]
                  },
                  "tags":       [
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
    
    it("create handler should create a new listener", function(done) {
      var context = {
        done: done
      };
      
      create.handler(
        _.merge({accessToken: ACCESSTOKEN}, listenerConfig),
        context
      );
    });
    
    it("listener handler should create a new listener", function(done) {
      var context = {
        done: done
      };
      
      listenerAction.handler(
        _.merge({
          requestType: 'Create',
          accessToken: ACCESSTOKEN
        }, listenerConfig),
        context
      );
    });
    
    it("lambda handler should create a new listener", function(done) {
      var context = {
        done: done
      };
      
      lambda.handler(
        _.merge({
          ResourceType: 'Custom::mlb-listener',
          requestType:  'Create',
          accessToken:  ACCESSTOKEN
        }, listenerConfig),
        context
      );
    });
    
    it("lambda handler should create a new listener from CloudFormation", function(done) {
      var context = {
        done: done
      };
      
      lambda.handler({
          ResourceType:       'Custom::mlb-listener',
          RequestType:        'Create',
          ResourceProperties: _.merge({accessToken: ACCESSTOKEN}, listenerConfig)
        },
        context
      );
    });
    
  });
});
