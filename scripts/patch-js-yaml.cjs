// Polyfill js-yaml v4 to expose deprecated `safeLoad` expected by gray-matter.
const yaml = require('js-yaml');
yaml.safeLoad = yaml.load;
