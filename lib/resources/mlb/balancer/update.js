const handler  = require('lambda-formation').resource.update;
const util     = require('lambda-formation').util;
const request  = require('request');
const _        = require('lodash');
const spotUtil = require('../../../util');

function update(err, event, context) {
  if(err !== null) {
    return util.done(err);
  }
  
  spotUtil.getTokenAndConfig(event, function(err, tc) {
      if(err !== null) {
        return util.done(err, event, context);
      }
      
      let refId         = event.id || event.PhysicalResourceId;
      let updateOptions = {
        method:  'PUT',
        url:     `https://api.spotinst.io/loadBalancer/balancer/${refId}`,
        qs:      {
          accountId: spotUtil.getSpotinstAccountId(event),
        },
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${tc.token}`,
          'User-Agent':    spotUtil.getUserAgent()
        },
        json:    {
          balancer: tc.config
        }
      };
      
      console.log(`Updating balancer ${refId} : ${JSON.stringify(tc.config, null, 2)}`);
      request(updateOptions, function(err, res, body) {
        spotUtil.validateResponse({
          err:       err,
          res:       res,
          body:      body,
          event:     event,
          context:   context,
          resource:  'balancer',
          action:    'update',
          successCb: function(spotResponse) {
            let options = {
              cfn_responder: {
                returnError: false,
                logLevel:    "debug"
              }
            };
            util.done(err, event, context, {}, refId, options);
          }
        });
      });
      
    }
  )
  ;
}

function getUpdatePolicyConfig(event) {
  let updatePolicy = _.get(event, 'ResourceProperties.updatePolicy') || _.get(event, 'updatePolicy');
  return updatePolicy;
}

/* Do not change this function */
module.exports.handler = function(event, context) {
  handler.apply(this, [event, context, update]);
};















