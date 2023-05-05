/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-styling';
import '../src/index.css';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { wagmiClientDecorator } from '../src/lib/decorators/wagmiClientDecorator';
import { AragonSDKWrapper } from '../src/context/AragonSDK';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f8fafc', class: 'light' },
        { name: 'dark', value: '#0d1323', class: 'dark' },
      ],
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        // color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

/**
 * Add necessary contexts to the story, to properly render everything
 * @param Story The story to be rendered
 * @param context The context of the story
 */
const globalDecorator = (Story, context) => {
  // Set the background color for the light/dark mode
  const selectedTheme = context.globals['theme'] || '';
  const color = selectedTheme === 'dark' ? '#0d1323' : '#f8fafc';
  document.body.style.background = color;
  document.documentElement.style.background = color;

  return (
    <AragonSDKWrapper>
      {/* MemoryRouter mimics a BrowserRouter, but without actually changing the URL in the browser, for testing */}
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    </AragonSDKWrapper>
  );
};

export const decorators = [
  // Add light/dark mode themes to the settings bar of Storybook
  withThemeByClassName({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'light',
  }),
  globalDecorator,
  wagmiClientDecorator,
];

export default preview;
