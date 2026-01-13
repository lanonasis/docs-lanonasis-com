import {
  pathToRegexp,
  compile,
  match,
  parse,
  tokensToFunction,
  tokensToRegexp,
  regexpToFunction,
} from 'path-to-regexp/dist/index.js';

// Normalize the export shape for react-router v5 (expects a default export).
const defaultExport = pathToRegexp;

export default defaultExport;
export {
  pathToRegexp,
  compile,
  match,
  parse,
  tokensToFunction,
  tokensToRegexp,
  regexpToFunction,
};
