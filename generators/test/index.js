'use strict';
const Generators = require('yeoman-generator');
const Path = require('path');
const Util = require('../../lib/util');
const Frameworks = Util.Frameworks;
const RouteGen = require('../../lib/routegen');
const Prompt = require('../prompt');

module.exports = Generators.Base.extend({
    constructor: function () {
        Generators.Base.apply(this, arguments);
        /*
         * Options :
         *  --framework
         *  --apiPath
         *  --handlerPath
         *  --testPath
         */
        this.option('framework');
        this.option('apiPath');
        this.option('handlerPath');
        this.option('testPath');
    },
    initializing: {
        //Validate the apiPath option in the beginning itself. Prompt for user input if the option is an invalid path.
        apiPath: function () {
            const done = this.async();
            this.apiPath = this.options.apiPath;
            this.api = this.options.api;
            this.refApi = this.options.refApi;
            if ((!this.api || !this.refApi) && this.apiPath) {
                //If API is not passed as an option and the apiPath is valid, then, validate the api Spec.
                Util.validateApi(this, done);
                return;
            }
            done();
        },
        setDefaults: function () {
            Util.setDefaults(this);
        }
    },
    prompting: function () {
        const done = this.async();
        this.prompt(Prompt('test', this), function (answers) {
            const self = this;
            Object.keys(answers).forEach(function (prop) {
                if (answers[prop] !== null && answers[prop] !== undefined) {
                    self[prop] = answers[prop];
                }
            });

            //parse and validate the Swagger API entered by the user.
            if (answers.apiPath) {
                Util.updateConfigPath(self);
                Util.validateApi(self, done);
            } else {
                done();
            }

        }.bind(this));
    },
    configuring: function () {
        const done = this.async();
        if (Frameworks.indexOf(this.framework) === -1) {
            done(new Error('Invalid framework ' + this.framework + '. Framework should be one of these : ' + Frameworks));
        } else {
            done();
        }
    },
    writing: {
        data: function () {
            this.composeWith('swaggerize:handler', {
                options: {
                    api: this.api,
                    refApi: this.refApi,
                    apiPath: this.apiPath,
                    handlerPath: this.handlerPath,
                    dataPath: this.dataPath,
                    apiConfigPath: this.apiConfigPath,
                    securityPath: this.securityPath,
                    framework: this.framework
                }
            }, {
                local: require.resolve('../handler')
            });
        },
        tests: function () {
            const self = this;
            const paths = this.api.paths;
            if (paths) {
                Object.keys(paths).forEach(function (path) {
                    const pathStr = path.replace(/^\/|\/$/g, '');
                    const testPath = Path.join(self.testPath, pathStr + '.js');
                    const pathObj = paths[path];
                    let route;
                    //Set the genFilePath path
                    self.genFilePath = self.destinationPath(testPath);
                    //Generate the route template obj.
                    route = RouteGen(self, path, pathObj);
                    if (route.operations && route.operations.length > 0) {
                        self.fs.copyTpl(
                            self.templatePath(Path.join(self.framework, 'test.js')),
                            self.genFilePath,
                            route
                        );
                    }
                });
            }
        }
    }
});
