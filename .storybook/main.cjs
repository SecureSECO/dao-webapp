// BUG: Storybook-test does not work if this file is a typescript file.
// FIX: We turned this file into a .cjs (commonJS) file.
// References: https://github.com/storybookjs/storybook/issues/11587, https://github.com/sveltejs/kit/discussions/2803

const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions', '@storybook/addon-styling', '@storybook/addon-mdx-gfm'],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  features: {
    storyStoreV7: true
  },
  docs: {
    autodocs: 'tag'
  },
  core: {
    disableTelemetry: true
  }
};
module.exports = config;