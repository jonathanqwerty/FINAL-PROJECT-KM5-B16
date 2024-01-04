const definition = require("./definition.json");
const documentation1 = require("./documentation1.json");
const documentation2 = require("./documentation2.json");
const documentation3 = require("./documentation3.json");
const documentation4 = require("./documentation4.json");
// const documentation5 = require('./test.json')
const swagger = {
  ...definition,
  tags: [
    ...documentation1.tags,
    ...documentation2.tags,
    ...documentation3.tags,
    ...documentation4.tags,
  ],
  paths: {
    ...documentation1.paths,
    ...documentation2.paths,
    ...documentation3.paths,
    ...documentation4.paths,
    // ...documentation5.paths
  },
  components: documentation2.components,
};

module.exports = swagger;
