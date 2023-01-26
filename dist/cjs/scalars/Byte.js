'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.GraphQLByte = exports.GraphQLByteConfig = void 0;
const graphql_1 = require('graphql');
const error_js_1 = require('../error.js');
function validate(value, ast) {
  if (typeof value !== 'string' && !(value instanceof global.Buffer)) {
    throw (0, error_js_1.createGraphQLError)(
      `Value is not an instance of Buffer: ${JSON.stringify(value)}`,
      ast
        ? {
            nodes: ast,
          }
        : undefined
    );
  }
  if (typeof value === 'string') {
    return value;
  }
  return value;
}
function parseObject(ast) {
  const key = ast.fields[0].value;
  const value = ast.fields[1].value;
  if (
    ast.fields.length === 2 &&
    key.kind === graphql_1.Kind.STRING &&
    key.value === 'Buffer' &&
    value.kind === graphql_1.Kind.LIST
  ) {
    return global.Buffer.from(value.values.map(astValue => parseInt(astValue.value)));
  }
  throw (0, error_js_1.createGraphQLError)(
    `Value is not a JSON representation of Buffer: ${(0, graphql_1.print)(ast)}`,
    {
      nodes: [ast],
    }
  );
}
exports.GraphQLByteConfig = {
  name: 'Byte',
  description: 'The `Byte` scalar type represents byte value as a Buffer',
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  serialize: validate,
  parseValue: validate,
  parseLiteral(ast) {
    switch (ast.kind) {
      case graphql_1.Kind.STRING:
        return validate(ast.value, ast);
      case graphql_1.Kind.OBJECT:
        return parseObject(ast);
      default:
        throw (0, error_js_1.createGraphQLError)(
          `Can only parse base64 or hex encoded strings as Byte, but got a: ${ast.kind}`,
          {
            nodes: [ast],
          }
        );
    }
  },
  extensions: {
    codegenScalarType: 'Buffer | string',
    jsonSchema: {
      type: 'string',
      format: 'byte',
    },
  },
};
exports.GraphQLByte = new graphql_1.GraphQLScalarType(exports.GraphQLByteConfig);
