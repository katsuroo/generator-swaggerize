const mockgen = require('<%=mockgenPath.replace(/\\/g,'/')%>');
const Promise = require('bluebird');

/**
 * Operations on <%=path%>
 */
module.exports = {
  <%operations.forEach(function (operation, i)
  {%>/**<%if (operation.summary) {%>
   * summary: <%=operation.summary%><%}%><%if (operation.description){%>
   * description: <%=operation.description%><%}%><%if (operation.parameters){%>
   * parameters: <%=operation.parameters%><%}%><%if (operation.produces){%>
   * produces: <%=operation.produces%>}<%}%><%if (operation.responses){%>
   * responses: <%=operation.responses.join(', ')%><%}%>
   */
  <%=operation.method%>: {
    <%operation.responses && operation.responses.forEach(function (response, i)
    {%><%=response%>: (req, res) => ( // eslint-disable-line no-unused-vars, func-names
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      
      new Promise((resolve, reject) => {
        mockgen().responses({
          path: '<%=path%>',
          operation: '<%=operation.method%>',
          response: '<%=response%>',
        }, (err, data) => {
          if (err) reject(err);
          if (data) resolve(data);
        });
      })
    ),
    <%})%>
  },
  <%});%>
};
