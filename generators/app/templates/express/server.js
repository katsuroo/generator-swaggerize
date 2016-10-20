'use strict';

const app        = require('express')();
const BodyParser = require('body-parser');
const Swaggerize = require('swaggerize-express');
const Path       = require('path');
const os         = require('os');

const port = 8000;
const host = os.hostname();

app.use(BodyParser.json());

app.use(BodyParser.urlencoded({
    extended: true
}));

app.use(Swaggerize({
        api     : Path.resolve('<%=apiPathRel.replace(/\\/g,' / ')%>'),
        handlers: Path.resolve('<%=handlerPath.replace(/\\/g,' / ')%>') < %if (security) {%>,
            security: Path.resolve('<%=securityPath.replace(/\\/g,' / ')%>') < %
        } % >
}))
;

app.listen(port, function () {
    app.swagger.api.host = os.hostname() + ':' + port;
    /* eslint-disable no-console */
    console.log('App running on %s:%d', host, port);
    /* eslint-disable no-console */
});
