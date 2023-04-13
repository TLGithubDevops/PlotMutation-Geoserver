const base64 = require('base-64');
const AUTH = {
    user: process.env.GEOSERVER_USER || 'admin',
    pass: process.env.GEOSERVER_PASS || 'geoserver'
};

const config = (method) => ({
  method,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Basic ${base64.encode(`${AUTH.user}:${AUTH.pass}`)}`,
  }
});

module.exports = config;