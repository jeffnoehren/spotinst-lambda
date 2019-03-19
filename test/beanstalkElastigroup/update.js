var _            = require('lodash'),
    assert       = require('assert'),
    update       = require('../../lib/resources/beanstalkElastigroup/update'),
    elasticgroup = require('../../lib/resources/beanstalkElastigroup'),
    lambda       = require('../../'),
    nock         = require('nock'),
    sinon     = require('sinon'),
    util      = require('lambda-formation').util;

var groupConfig = {
  "accountId":"act-123456",
  "group": {
    "name":                    "test",
    "description":             "asdf",
    "strategy":                {
      "risk":               100,
      "onDemandCount":      null,
      "availabilityVsCost": "balanced"
    },
    "capacity":                {
      "target":  1,
      "minimum": 1,
      "maximum": 1
    },
    "scaling":                 {},
    "compute":                 {
      "instanceTypes":       {
        "ondemand": "m3.medium",
        "spot":     [
          "m3.medium"
        ]
      },
      "availabilityZones":   [
        {
          "name":     "us-east-1a",
          "subnetId": "subnet-11111111"
        }
      ],
      "product":             "Linux/UNIX",
      "launchSpecification": {
        "securityGroupIds": [
          "sg-11111111"
        ],
        "monitoring":       false,
        "imageId":          "ami-60b6c60a",
        "keyPair":          "testkey"
      }
    },
    "scheduling":              {},
    "thirdPartiesIntegration": {}
  }
};

groupConfig.group.description = Date.now() / 1000 + "";

describe("beanstalkElastigroup", function() {
  beforeEach(()=>{
    nock.cleanAll();
    sandbox = sinon.createSandbox();
  })

  afterEach(()=>{
    sandbox.restore()
  });

  describe("update resource", function() {
    it("update handler should update an existing group", function(done) {
      nock('https://api.spotinst.io', {"encodedQueryParams": true})
        .put('/aws/ec2/group/sig-11111111')
        .query({ accountId: 'act-123456' })
        .reply(200, {});

      util.done = sandbox.spy((err, event, context, body)=>{
          assert.equal(err, null)
          done()
      })

      update.handler(
        _.merge({
          accessToken:        ACCESSTOKEN,
          PhysicalResourceId: 'sig-11111111'
        }, groupConfig),
        context
      );
    });

    it("elasticgroup handler should update an existing group", function(done) {
      nock('https://api.spotinst.io', {"encodedQueryParams": true})
        .put('/aws/ec2/group/sig-11111111')
        .query({ accountId: 'act-123456' })
        .reply(200, {});

      util.done = sandbox.spy((err, event, context, body)=>{
          assert.equal(err, null)
          done()
      })

      update.handler(
        _.merge({
          requestType: 'update',
          accessToken: ACCESSTOKEN,
          id:          'sig-11111111'
        }, groupConfig),
        context
      );
    });

    it("lambda handler should update an existing group", function(done) {
      nock('https://api.spotinst.io', {"encodedQueryParams": true})
        .put('/aws/ec2/group/sig-11111111')
        .query({ accountId: 'act-123456' })
        .reply(200, {});

      util.done = sandbox.spy((err, event, context, body)=>{
          assert.equal(err, null)
          done()
      })


      update.handler(
        _.merge({
          resourceType: 'elasticgroup',
          requestType:  'update',
          accessToken:  ACCESSTOKEN,
          id:           'sig-11111111'
        }, groupConfig),
        context
      );
    });

    it("update handler should update an existing group and roll", function(done) {
      nock('https://api.spotinst.io', {"encodedQueryParams": true})
        .put('/aws/ec2/group/sig-11111111')
        .query({ accountId: 'act-123456' })
        .reply(200, {});
  
      nock('https://api.spotinst.io', {"encodedQueryParams": true})
        .put('/aws/ec2/group/sig-11111111/roll')
        .query({ accountId: 'act-123456' })
        .reply(200,{})

      util.done = sandbox.spy((err, event, context, body)=>{
          assert.equal(err, null)
          done()
      })

      var updatePolicyConfig = {
        shouldRoll: true,
        rollConfig: {
          batchSizePercentage: 50,
          gracePeriod:         600
        }
      };

      update.handler(
        _.merge({
          accessToken:  ACCESSTOKEN,
          id:           'sig-11111111',
          updatePolicy: updatePolicyConfig
        }, groupConfig),
        context
      );
    });

    it("update handler should update an existing group and not perform roll", function(done) {
      nock('https://api.spotinst.io', {"encodedQueryParams": true})
        .put('/aws/ec2/group/sig-11111111')
        .query({ accountId: 'act-123456' })
        .reply(200, {});

      util.done = sandbox.spy((err, event, context, body)=>{
          assert.equal(err, null)
          done()
      })

      var updatePolicyConfig = {
        shouldRoll: false,
        rollConfig: {
          batchSizePercentage: 50,
          gracePeriod:         600
        }
      };

      update.handler(
        _.merge({
          accessToken:  ACCESSTOKEN,
          id:           'sig-11111111',
          updatePolicy: updatePolicyConfig
        }, groupConfig),
        context
      );
    });

    it("update group with new beanstalk config", function(done){
      nock('https://api.spotinst.io', {"encodedQueryParams": true})
        .put('/aws/ec2/group/sig-11111111')
        .query({ accountId: 'act-123456' })
        .reply(200, {});

      util.done = sandbox.spy((err, event, context, body)=>{
          assert.equal(err, null)
          done()
      })

      var tempGroup = groupConfig

      var beanstalkConfig = {
        "environmentId": "e-hmbfgpqj6k",
        "managedActions": {
          "platformUpdate": {
            "performAt"   : "timeWindow",
            "timeWindow"  : "Mon:12:15-Mon:14:15",
            "updateLevel" : "minorAndPatch",
            "instanceRefreshEnabled": true
          }
        },
        "deploymentPreferences":{
          "automaticRoll": true,
          "batchSizePercentage": 100,
          "gracePeriod":0,
          "strategy":{
            "action": "REPLACE_SERVER",
            "shouldDrainInstances": false
          }
        }
      };

      tempGroup.group.beanstalk = beanstalkConfig

      update.handler(
        _.merge({
          accessToken:  ACCESSTOKEN,
          id:           'sig-11111111',
        }, tempGroup),
        context
      );
    })

    it("update group with healthCheckType and healthCheckGracePeriod", function(done){
      nock('https://api.spotinst.io', {"encodedQueryParams": true})
        .put('/aws/ec2/group/sig-11111111')
        .query({ accountId: 'act-123456' })
        .reply(200, {});

      util.done = sandbox.spy((err, event, context, body)=>{
          assert.equal(err, null)
          done()
      })

      var tempGroup = groupConfig

      tempGroup.group.healthCheckType = "test-type"
      tempGroup.group.healthCheckGracePeriod = 60

      update.handler(
        _.merge({
          accessToken:  ACCESSTOKEN,
          id:           'sig-11111111',
        }, tempGroup),
        context
      );
    })

    it("return error from spotUtil.getTokenAndConfig", function(done){
      util.done = sandbox.spy((err, event, context, body)=>{
          assert.notEqual(err, null)
          done()
      })

      update.handler(
        _.merge({
          id:           'sig-11111111',
        }, groupConfig),
        context
      );
    })
  });
});
