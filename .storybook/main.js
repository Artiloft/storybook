

/** @type { import('@storybook/html-vite').StorybookConfig } */
const config = {
  "stories": [
    "../src/shared/**/*.mdx",
    "../src/shared/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-docs"
  ],
  "framework": {
    "name": "@storybook/html-vite",
    "options": {}
  }
};
export default config;