'use strict';
const Mockgen = require('<%=mockgenPath.replace(/\\/g,'/')%>');
const Promise = require('bluebird');

/**
 * Operations on <%=path%>
 */
module.exports = {
    <%operations.forEach(function (operation, i)
    {%>/**
     * summary: <%=operation.summary%>
     * description: <%=operation.description%>
     * parameters: <%=operation.parameters%>
     * produces: <%=operation.produces%>
     * responses: <%=operation.responses.join(', ')%>
     * operationId: <%=operation.name%>
     */
    <%=operation.method%>: {
        <%operation.responses && operation.responses.forEach(function (response, i)
        {%><%=response%>: function (req, res) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            
            return new Promise((reject, resolve) => {
                Mockgen().responses({
                    path: '<%=path%>',
                    operation: '<%=operation.method%>',
                    response: '<%=response%>'
                }, (err, data) => {
                    if (err) reject(err);
                    if (data) resolve(data);
                });
            });
        }<%if (i < operation.responses.length - 1) {%>,
        <%}%><%})%>
    }<%if (i < operations.length - 1) {%>,
    <%}%><%});%>
};
