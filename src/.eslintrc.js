module.exports = {
  root: true,
  extends: 'airbnb',
  rules: {
    'max-len': [1, 160, 4, {"ignoreUrls": true}],
    'no-console': 0,
    'no-multi-spaces': [2, { exceptions: { "ImportDeclaration": true } }],
    'no-param-reassign': [2, { props: false }],
    'no-unused-vars': [2, { args: 'none' }],
    'no-underscore-dangle': 0,
    'arrow-body-style': 0,
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,    
  },
  settings: {
    'import/resolver': 'webpack',
  },
};
