const swagmock = require('swagmock');
const path = require('path');

const apiPath = path.resolve(__dirname, '<%=apiConfigPath.replace(/\\/g,'/')%>');
const mockgen = swagmock(apiPath);

module.exports = function mockGenerator() {
  /**
   * Cached mock generator
   */
  return mockgen;
};
