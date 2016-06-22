'use strict';

/**
 * Operations on <%=path%>
 */
module.exports = {
    <%operations.forEach(function (operation, i) {%>
    /**
     * summary: <%=operation.summary%>
     * description: <%=operation.description%>
     * parameters: <%=operation.parameters%>
     * produces: <%=operation.produces%>
     * responses: <%=operation.responses.join(', ')%>
     */
    <%=operation.method%>: function <%=operation.name%>(req, reply, next) {
        <%if (operation.responses.length > 0) {
            var resp = operation.responses[0];
            var statusStr = (resp === 'default') ? 200 : resp%>
        /**
         * Get the data for response <%=resp%>
         * For response `default` status 200 is used.
         */
        var status = <%=statusStr%>;
        var provider = dataProvider['<%=operation.method%>']['<%=resp%>'];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data);
            reply(data).code(status);
        });
        <%} else {%>
        var status = 501;
        var data = {};
        reply(data).code(status);
        <%}%>
    }<%if (i < operations.length - 1) {%>, <%}%>
    <%})%>
};
