var _ = require('lodash'),
  assert = require('assert'),
  nock = require('nock');
  util = require('../../lib/util'),
  sinon        = require('sinon'),
  utilSpy      = require('lambda-formation').util;


var rollConfig = {
  batchSize: 50,
  gracePeriod: 120
}

var token = "1234567890987654321"

var groupConfig = {
  event : {accountId:"act-12345"}, 
  context : {}, 
  updatePolicy : {
    rollConfig: rollConfig
  }, 
  refId : "sig-12345", 
  token:token, 
}


describe("util rollGroup", function() {
  beforeEach(()=>{
      nock.cleanAll();
      sandbox = sinon.createSandbox();
  })

  afterEach(()=>{
      sandbox.restore()
  });

  it("should roll group without error", function(done) {
    nock('https://api.spotinst.io', {reqheaders: {'Authorization': `Bearer ${token}`}})
      .put('/aws/ec2/group/sig-12345/roll?accountId=act-12345')
      .reply((uri, requestBody)=>{
        assert.deepEqual(requestBody, rollConfig)

        return(200, {test:true})
      });

    utilSpy.done = sandbox.stub().returns(done())

    util.rollGroup(groupConfig);
  });
});