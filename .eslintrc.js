module.exports = {
  root: true,
  extends: 'airbnb',
  rules: {
    'no-var': 0,
    'no-console': 0,
    'object-shorthand': 0,
    'max-len': [1, 160, 4, {"ignoreUrls": true}],
    'no-multi-spaces': [2, { exceptions: { "ImportDeclaration": true } }],
    'no-param-reassign': [2, { props: false }],
    'no-unused-vars': [2, { args: 'none' }],
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,
  },
};
