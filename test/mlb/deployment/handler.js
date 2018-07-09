const assert = require('assert');
const lambda = require('../../../lib/resources/mlb/balancer');

describe('balancer', function() {
  describe('handler', function() {
    it('should require requestType', function(done) {
      let context = {
        done: function(err, obj) {
          assert(err);
          done();
        }
      };
      
      lambda.handler({}, context);
    });
    
    it('should verify requestType', function(done) {
      let context = {
        done: function(err, obj) {
          assert(err);
          done();
        }
      };
      
      lambda.handler({requestType: 'badType'}, context);
    });
    
  });
});
