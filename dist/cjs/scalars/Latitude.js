'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.GraphQLLatitude = void 0;
// Inspired by Geolib: https://github.com/manuelbieh/geolib
const graphql_1 = require('graphql');
const error_js_1 = require('../error.js');
const utilities_js_1 = require('./utilities.js');
// Minimum latitude
const MIN_LAT = -90.0;
// Maximum latitude
const MAX_LAT = 90.0;
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
    if (decimalValue < MIN_LAT || decimalValue > MAX_LAT) {
      throw (0, error_js_1.createGraphQLError)(
        `Value must be between ${MIN_LAT} and ${MAX_LAT}: ${value}`,
        ast ? { nodes: ast } : undefined
      );
    }
    return Number.parseFloat(decimalValue.toFixed(MAX_PRECISION));
  }
  if ((0, utilities_js_1.isSexagesimal)(value)) {
    return validate((0, utilities_js_1.sexagesimalToDecimal)(value));
  }
  throw (0, error_js_1.createGraphQLError)(`Value is not a valid latitude: ${value}`, ast ? { nodes: ast } : undefined);
};
exports.GraphQLLatitude = new graphql_1.GraphQLScalarType({
  name: `Latitude`,
  description: `A field whose value is a valid decimal degrees latitude number (53.471): https://en.wikipedia.org/wiki/Latitude`,
  serialize(value) {
    return validate(value);
  },
  parseValue(value) {
    return validate(value);
  },
  parseLiteral(ast) {
    if (ast.kind !== graphql_1.Kind.FLOAT && ast.kind !== graphql_1.Kind.STRING) {
      throw (0, error_js_1.createGraphQLError)(
        `Can only validate floats or strings as latitude but got a: ${ast.kind}`,
        {
          nodes: [ast],
        }
      );
    }
    return validate(ast.value, ast);
  },
  extensions: {
    codegenScalarType: 'string',
    jsonSchema: {
      title: 'Latitude',
      type: 'number',
      minimum: MIN_LAT,
      maximum: MAX_LAT,
    },
  },
});
