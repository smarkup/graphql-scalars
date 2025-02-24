'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.GraphQLBigInt = exports.GraphQLBigIntConfig = void 0;
/* eslint-disable @typescript-eslint/ban-types */
const graphql_1 = require('graphql');
const error_js_1 = require('../error.js');
const utilities_js_1 = require('./utilities.js');
exports.GraphQLBigIntConfig = {
  name: 'BigInt',
  description: 'The `BigInt` scalar type represents non-fractional signed whole numeric values.',
  serialize(outputValue) {
    const coercedValue = (0, utilities_js_1.serializeObject)(outputValue);
    let num = coercedValue;
    if (typeof coercedValue === 'object' && coercedValue != null && 'toString' in coercedValue) {
      num = BigInt(coercedValue.toString());
      if (num.toString() !== coercedValue.toString()) {
        throw (0, error_js_1.createGraphQLError)(`BigInt cannot represent non-integer value: ${coercedValue}`);
      }
    }
    if (typeof coercedValue === 'boolean') {
      num = BigInt(coercedValue);
    }
    if (typeof coercedValue === 'string' && coercedValue !== '') {
      num = BigInt(coercedValue);
      if (num.toString() !== coercedValue) {
        throw (0, error_js_1.createGraphQLError)(`BigInt cannot represent non-integer value: ${coercedValue}`);
      }
    }
    if (typeof coercedValue === 'number') {
      if (!Number.isInteger(coercedValue)) {
        throw (0, error_js_1.createGraphQLError)(`BigInt cannot represent non-integer value: ${coercedValue}`);
      }
      num = BigInt(coercedValue);
    }
    if (typeof num !== 'bigint') {
      throw (0, error_js_1.createGraphQLError)(`BigInt cannot represent non-integer value: ${coercedValue}`);
    }
    if ('toJSON' in BigInt.prototype) {
      return num;
    }
    return new Proxy(
      {},
      {
        has(_, prop) {
          if (prop === 'toJSON') {
            return true;
          }
          return prop in BigInt.prototype;
        },
        get(_, prop) {
          if (prop === 'toJSON') {
            return function toJSON() {
              if (num > Number.MAX_SAFE_INTEGER) {
                return num.toString();
              }
              return Number(num);
            };
          }
          if (prop === Symbol.toStringTag) {
            return num.toString();
          }
          if (prop in BigInt.prototype) {
            return BigInt.prototype[prop].bind(num);
          }
          return undefined;
        },
      }
    );
  },
  parseValue(inputValue) {
    const num = BigInt(inputValue.toString());
    if (inputValue.toString() !== num.toString()) {
      throw (0, error_js_1.createGraphQLError)(`BigInt cannot represent value: ${inputValue}`);
    }
    return num;
  },
  parseLiteral(valueNode) {
    if (valueNode.kind !== graphql_1.Kind.INT) {
      throw (0, error_js_1.createGraphQLError)(
        `BigInt cannot represent non-integer value: ${(0, graphql_1.print)(valueNode)}`,
        { nodes: valueNode }
      );
    }
    const num = BigInt(valueNode.value);
    if (num.toString() !== valueNode.value) {
      throw (0, error_js_1.createGraphQLError)(`BigInt cannot represent value: ${valueNode.value}`, {
        nodes: valueNode,
      });
    }
    return num;
  },
  extensions: {
    codegenScalarType: 'bigint',
    jsonSchema: {
      type: 'integer',
      format: 'int64',
    },
  },
};
exports.GraphQLBigInt = new graphql_1.GraphQLScalarType(exports.GraphQLBigIntConfig);
