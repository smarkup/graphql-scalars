'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.GraphQLCountryCode = void 0;
const graphql_1 = require('graphql');
const error_js_1 = require('../error.js');
const COUNTRY_CODE_REGEX =
  /^(AD|AE|AF|AG|AI|AL|AM|AO|AQ|AR|AS|AT|AU|AW|AX|AZ|BA|BB|BD|BE|BF|BG|BH|BI|BJ|BL|BM|BN|BO|BQ|BR|BS|BT|BV|BW|BY|BZ|CA|CC|CD|CF|CG|CH|CI|CK|CL|CM|CN|CO|CR|CU|CV|CW|CX|CY|CZ|DE|DJ|DK|DM|DO|DZ|EC|EE|EG|EH|ER|ES|ET|FI|FJ|FK|FM|FO|FR|GA|GB|GD|GE|GF|GG|GH|GI|GL|GM|GN|GP|GQ|GR|GS|GT|GU|GW|GY|HK|HM|HN|HR|HT|HU|ID|IE|IL|IM|IN|IO|IQ|IR|IS|IT|JE|JM|JO|JP|KE|KG|KH|KI|KM|KN|KP|KR|KW|KY|KZ|LA|LB|LC|LI|LK|LR|LS|LT|LU|LV|LY|MA|MC|MD|ME|MF|MG|MH|MK|ML|MM|MN|MO|MP|MQ|MR|MS|MT|MU|MV|MW|MX|MY|MZ|NA|NC|NE|NF|NG|NI|NL|NO|NP|NR|NU|NZ|OM|PA|PE|PF|PG|PH|PK|PL|PM|PN|PR|PS|PT|PW|PY|QA|RE|RO|RS|RU|RW|SA|SB|SC|SD|SE|SG|SH|SI|SJ|SK|SL|SM|SN|SO|SR|SS|ST|SV|SX|SY|SZ|TC|TD|TF|TG|TH|TJ|TK|TL|TM|TN|TO|TR|TT|TV|TW|TZ|UA|UG|UM|US|UY|UZ|VA|VC|VE|VG|VI|VN|VU|WF|WS|YE|YT|ZA|ZM|ZW)$/i;
const validate = (value, ast) => {
  if (typeof value !== 'string') {
    throw (0, error_js_1.createGraphQLError)(
      `Value is not string: ${value}`,
      ast
        ? {
            nodes: ast,
          }
        : undefined
    );
  }
  if (!COUNTRY_CODE_REGEX.test(value)) {
    throw (0, error_js_1.createGraphQLError)(
      `Value is not a valid country code: ${value}`,
      ast
        ? {
            nodes: ast,
          }
        : undefined
    );
  }
  return value;
};
exports.GraphQLCountryCode = new graphql_1.GraphQLScalarType({
  name: 'CountryCode',
  description: 'A country code as defined by ISO 3166-1 alpha-2',
  serialize(value) {
    return validate(value);
  },
  parseValue(value) {
    return validate(value);
  },
  parseLiteral(ast) {
    if (ast.kind !== graphql_1.Kind.STRING) {
      throw (0, error_js_1.createGraphQLError)(`Can only validate strings as country codes but got a: ${ast.kind}`, {
        nodes: [ast],
      });
    }
    return validate(ast.value, ast);
  },
  extensions: {
    codegenScalarType: 'string',
    jsonSchema: {
      title: 'CountryCode',
      type: 'string',
      pattern: COUNTRY_CODE_REGEX.source,
    },
  },
});
