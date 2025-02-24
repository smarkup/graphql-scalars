'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.GraphQLLongitude = void 0;
// Inspired by Geolib: https://github.com/manuelbieh/geolib
const graphql_1 = require('graphql');
const utilities_js_1 = require('./utilities.js');
const error_js_1 = require('../error.js');
// Minimum longitude
const MIN_LON = -180.0;
// Maximum longitude
const MAX_LON = 180.0;
// See https://en.wikipedia.org/wiki/Decimal_degrees#Precision
const MAX_PRECISION = 8;
const validate = (value, ast) => {
  // Check if value is a string or a number
  if (
    (typeof value !== 'string' && typeof value !== 'number') ||
    value === null ||
    typeof value === 'undefined' ||
    Number.isNaN(value)
  ) {
    throw (0, error_js_1.createGraphQLError)(
      `Value is neither a number nor a string: ${value}`,
      ast ? { nodes: ast } : undefined
    );
  }
  if ((0, utilities_js_1.isDecimal)(value)) {
    const decimalValue = typeof value === 'string' ? Number.parseFloat(value) : value;
    if (decimalValue < MIN_LON || decimalValue > MAX_LON) {
      throw (0, error_js_1.createGraphQLError)(
        `Value must be between ${MIN_LON} and ${MAX_LON}: ${value}`,
        ast ? { nodes: ast } : undefined
      );
    }
    return Number.parseFloat(decimalValue.toFixed(MAX_PRECISION));
  }
  if ((0, utilities_js_1.isSexagesimal)(value)) {
    return validate((0, utilities_js_1.sexagesimalToDecimal)(value));
  }
  throw (0, error_js_1.createGraphQLError)(
    `Value is not a valid longitude: ${value}`,
    ast ? { nodes: ast } : undefined
  );
};
exports.GraphQLLongitude = new graphql_1.GraphQLScalarType({
  name: `Longitude`,
  description: `A field whose value is a valid decimal degrees longitude number (53.471): https://en.wikipedia.org/wiki/Longitude`,
  serialize(value) {
    return validate(value);
  },
  parseValue(value) {
    return validate(value);
  },
  parseLiteral(ast) {
    if (ast.kind !== graphql_1.Kind.FLOAT && ast.kind !== graphql_1.Kind.STRING) {
      throw (0, error_js_1.createGraphQLError)(
        `Can only validate floats or strings as longitude but got a: ${ast.kind}`,
        {
          nodes: [ast],
        }
      );
    }
    return validate(ast.value, ast);
  },
  extensions: {
    codegenScalarType: 'string | number',
    jsonSchema: {
      type: 'number',
      minimum: MIN_LON,
      maximum: MAX_LON,
    },
  },
});
