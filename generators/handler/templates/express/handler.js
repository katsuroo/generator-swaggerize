const dataProvider = require('<%=dataPath.replace(/\\/g,'/')%>');
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
  <%=operation.method%>: function <%=operation.name%>(req, res, next) {
    <%if (operation.responses.length > 0) {
      const resp = operation.responses[0];
      const statusStr = (resp === 'default') ? 200 : resp;
    %>/**
     * Get the data for response <%=resp%>
     * For response `default` status 200 is used.
     */
    const status = <%=statusStr%>;
    const provider = dataProvider.<%=operation.method%>['<%=resp%>'];
    
    provider(req, res)
      .then(data => res.status(status).send(data && data.responses))
      .catch(err => next(err));<%} else {%>
    const status = 501;
    const data = {};
        
    res.status(status).send(data);
    <%}%>
  },
  <%});%>
};
