'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.GraphQLSemVer = void 0;
const graphql_1 = require('graphql');
const error_js_1 = require('../error.js');
const SEMVER_REGEX =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
const validate = (value, ast) => {
  if (typeof value !== 'string') {
    throw (0, error_js_1.createGraphQLError)(`Value is not string: ${value}`, ast ? { nodes: ast } : undefined);
  }
  if (!SEMVER_REGEX.test(value)) {
    throw (0, error_js_1.createGraphQLError)(
      `Value is not a valid Semantic Version: ${value}`,
      ast ? { nodes: ast } : undefined
    );
  }
  return value;
};
exports.GraphQLSemVer = new graphql_1.GraphQLScalarType({
  name: `SemVer`,
  description: `A field whose value is a Semantic Version: https://semver.org`,
  serialize(value) {
    return validate(value);
  },
  parseValue(value) {
    return validate(value);
  },
  parseLiteral(ast) {
    if (ast.kind !== graphql_1.Kind.STRING) {
      throw (0, error_js_1.createGraphQLError)(`Can only validate strings as Semantic Version but got a: ${ast.kind}`, {
        nodes: ast,
      });
    }
    return validate(ast.value, ast);
  },
  extensions: {
    codegenScalarType: 'string',
    jsonSchema: {
      title: 'SemVer',
      type: 'string',
      pattern: SEMVER_REGEX.source,
    },
  },
});
