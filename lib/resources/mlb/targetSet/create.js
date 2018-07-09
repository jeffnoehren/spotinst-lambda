const handler  = require('lambda-formation').resource.create;
const util     = require('lambda-formation').util;
const request  = require('request');
const spotUtil = require('../../../util');
const _        = require('lodash');

function create(err, event, context) {
  if(err !== null) {
    return util.done(err);
  }
  
  spotUtil.getTokenAndConfig(event, function(err, tc) {
    if(err !== null) {
      return util.done(err, event, context);
    }
    
    let createOptions = {
      method:  'POST',
      url:     'https://api.spotinst.io/loadBalancer/targetSet',
      qs:      {
        accountId: spotUtil.getSpotinstAccountId(event),
      },
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${tc.token}`,
        'User-Agent':    spotUtil.getUserAgent()
      },
      json:    {
        targetSet: tc.config
      }
    };
    
    console.log(`Creating targetSet: ${JSON.stringify(tc.config, null, 2)}`);
    request(createOptions, function(err, res, body) {
      spotUtil.validateResponse({
        err:       err,
        res:       res,
        body:      body,
        event:     event,
        context:   context,
        resource:  'targetSet',
        action:    'create',
        successCb: function(spotResponse) {
          let options = {
            cfn_responder: {
              returnError: false,
              logLevel:    "debug"
            }
          };
          util.done(err, event, context, _.get(body, 'response.items[0]'),
            _.get(body, 'response.items[0].id'), options);
        },
        
      });
    });
  });
}

/* Do not change this function */
module.exports.handler = function(event, context) {
  handler.apply(this, [event, context, create]);
};

