const handler  = require('lambda-formation').resource.create;
const util     = require('lambda-formation').util;
const request  = require('request');
const spotUtil = require('../../../util');
const _        = require('lodash');

function destroy(err, event, context) {
  if(err !== null) {
    return util.done(err);
  }
  
  spotUtil.getToken(event, function(err, token) {
    if(err !== null) {
      return util.done(err, event, context);
    }
    
    let refId = event.id || event.PhysicalResourceId;
    
    // Let CloudFormation rollbacks happen for failed stacks
    if(event.StackId && !_.startsWith(refId, 'lb'))
      return util.done(null, event, context);
    
    let createOptions = {
      method:  'DELETE',
      qs:      {
        accountId: spotUtil.getSpotinstAccountId(event)
      },
      url:     `https://api.spotinst.io/loadBalancer/balancer/${refId}`,
      headers: {
        'content-type':  'application/json',
        'Authorization': `Bearer ${token}`,
        'User-Agent':    spotUtil.getUserAgent()
      }
    };
    
    console.log(`Deleting balancer  ${refId}`);
    request(createOptions, function(err, res, body) {
      spotUtil.validateResponse({
        err:       err,
        res:       res,
        body:      body,
        event:     event,
        context:   context,
        resource:  'balancer',
        action:    'delete',
        successCb: function(spotResponse) {
          // Ensure JSON
          body = JSON.parse(body.toString());
          
          util.done(err, event, context, body);
        },
        failureCb: function(spotResponse) {
          // if the group doesn't exists, we can count the delete as success
          if(spotResponse.res.statusCode === 404) {
            console.log("The balancer doesn't exist, set the delete as success.");
            util.done(null, event, context, "The balancer doesn't exist");
          }
          else {
            util.done(`${spotResponse.resource}  ${spotResponse.action} failed`,
              event,
              context);
          }
        }
      });
    });
    
  });
}

/* Do not change this function */
module.exports.handler = function(event, context) {
  handler.apply(this, [event, context, destroy]);
};

