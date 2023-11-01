import Provider from 'oidc-provider';
import express from 'express'
import jwks from './jwks.json' assert { type: 'json' }

const corsProp = 'urn:custom:client:allowed-cors-origins';
const configuration = {
  jwks, // Used https://mkjwk.org/
  scopes: [
    'openid',
    'profile',
    'lorem'
  ],
  features: {
    clientCredentials: {
        enabled: true
    },
    introspection: {
      enabled: true
    },
    resourceIndicators: {
      enabled: true,
      getResourceServerInfo(ctx, resourceIndicator) {
          if (resourceIndicator ==='urn:api') {
              return {
                  scope: 'read',
                  audience: 'urn:api',
                  accessTokenTTL: 1 * 60 * 60, // 1 hour
                  accessTokenFormat: 'jwt'
              }
          }
  
          throw new Error();
      }
    }
  },
  extraClientMetadata: {
    properties: [corsProp],
    validator(ctx, key, value, metadata) {
      if (key === corsProp) {
        // set default (no CORS)
        if (value === undefined) {
          metadata[corsProp] = [];
          return;
        }
        // validate an array of Origin strings
        if (!Array.isArray(value) || !value.every(isOrigin)) {
          throw new errors.InvalidClientMetadata(`${corsProp} must be an array of origins`);
        }
      }
    },
  },
  clientBasedCORS(ctx, origin, client) {
    // ctx.oidc.route can be used to exclude endpoints from this behaviour, in that case just return
    // true to always allow CORS on them, false to deny
    // you may also allow some known internal origins if you want to
    return true // client[corsProp].includes(origin);
  },
	clients: [{
    client_id: 'app',
    client_secret: 'a_secret',
    grant_types: ['client_credentials'],
    redirect_uris: [],
    response_types: []
  },  {
    client_id: 'oidc_client',
    client_secret: 'a_different_secret',
    grant_types: ['authorization_code'],
    response_types: ['code'],
    redirect_uris: ['http://localhost:5173/redirect']
  }]
}

const oidc = new Provider('http://localhost:3000', configuration);

const app = express();
app.use('/oidc', oidc.callback());
app.listen(3000);
