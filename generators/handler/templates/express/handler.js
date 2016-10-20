'use strict';
const dataProvider = require('<%=dataPath.replace(/\\/g,'/')%>');
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
        const provider = dataProvider['<%=operation.method%>']['<%=resp%>'];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data && data.responses);
        });<%} else {%>
        const status = 501;
        const data = {};
        res.status(status).send(data);
        <%}%>
    }<%if (i < operations.length - 1) {%>,
    <%}%><%});%>
};
