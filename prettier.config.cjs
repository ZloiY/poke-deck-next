/** @type {import("prettier").Config} */
module.exports = {
  plugins: [require.resolve("prettier-plugin-tailwindcss"), require.resolve("@trivago/prettier-plugin-sort-imports")],
  "printWidth": 80,
  "tabWidth": 2,
  "trailingComma": "all",
  "singleQuote": false,
  "semi": true,
  "importOrder": ["^@icons/(.*)$", "^[./]"],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true
};
