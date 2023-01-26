import { GraphQLScalarType, Kind, print } from 'graphql';
import { createGraphQLError } from '../error.js';
function validate(value, ast) {
  if (typeof value !== 'string' && !(value instanceof global.Buffer)) {
    throw createGraphQLError(
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
  if (ast.fields.length === 2 && key.kind === Kind.STRING && key.value === 'Buffer' && value.kind === Kind.LIST) {
    return global.Buffer.from(value.values.map(astValue => parseInt(astValue.value)));
  }
  throw createGraphQLError(`Value is not a JSON representation of Buffer: ${print(ast)}`, {
    nodes: [ast],
  });
}
export const GraphQLByteConfig = /*#__PURE__*/ {
  name: 'Byte',
  description: 'The `Byte` scalar type represents byte value as a Buffer',
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  serialize: validate,
  parseValue: validate,
  parseLiteral(ast) {
    switch (ast.kind) {
      case Kind.STRING:
        return validate(ast.value, ast);
      case Kind.OBJECT:
        return parseObject(ast);
      default:
        throw createGraphQLError(`Can only parse base64 or hex encoded strings as Byte, but got a: ${ast.kind}`, {
          nodes: [ast],
        });
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
export const GraphQLByte = /*#__PURE__*/ new GraphQLScalarType(GraphQLByteConfig);
