module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    'no-console': 'off',
    'no-undef': 'warn'
  },
  globals: {
    io: 'readonly',
    socket: 'readonly',
    PLAYER_DATABASE: 'readonly',
    PLAYER_IMAGE_MAP: 'readonly',
    NORMALIZED_IMAGE_MAP: 'readonly'
  }
};
