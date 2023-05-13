module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended',
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
    project: ['tsconfig.json'],
    extraFileExtensions: ['.vue'],
  },
  plugins: [
    'vue',
    '@typescript-eslint',
  ],
  rules: {
    /**
     * namespace 需要。
     */
    'no-inner-declarations': [0],
    /**
     * 使用 Nuxt 自动导入不会使用 `as OneModule` 这种语法，所以暂时使用 namespace 代替。
     */
    '@typescript-eslint/no-namespace': [0],
    /**
     * 在清楚副作用的情况下，非空断言很有用。
     */
    '@typescript-eslint/no-non-null-assertion': [0],
  },
};
