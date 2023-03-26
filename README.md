# dao-webapp

## Initial setup

### Environment variables

Some default env variables are provided by [Vite](https://vitejs.dev/guide/env-and-mode.html) in the `import.meta.env` object. Custom variables should be prefixed with `VITE_` to expose them to the code.

Note on `.env` files:

- `.env.production` for production-specific variables
- `.env.development` for development-specific variables
- `.env` for all other environment variables

### Installing dependencies and setting up environment variables

1. Copy the .env.example file to .env and fill in the values
2. Optional: Install the _Prettier_ and _ESlint_ plugin in vscode (or your editor of choice), might have to restart your editor.
3. In case you haven't already: Install _npm_
4. run: `npm i`

## Running the webapp
Use the following command to locally run the webapp for development:
`npm run dev`

Use the following command to build the webapp for deployment:
`npm run build`

After building the webapp, it is possible to locally run the built webapp using:
`npm run preview`

## Storybook
Storybook is a frontend workshop for building UI components and pages in isolation.
To run the storybook, use the following command:
`npm run storybook`

The storybook can also be build, using:
`npm run build-storybook`

## Testing
Although most UI testing will have to occur manually (through the aid of storybook), there is support for automatic testing.
The automatic Storybook tests (defined using _play_ functions) can be run using: `npm run test-storybook`.
There is also support for tests written using _Jest_, mostly used for testing logic.
These tests can be run using `npm test` (or optionally `npm run test`).


## Style guide
### Code style
The code should be formatted as dictated by the automatic formatting tools.
Code that gives an error upon linting (using `npm run lint`) should not be committed.

### Colors

Below is a list of colors used for specific elements, both for light mode and dark mode. Colors are represented as tailwind classes here. The corresponding hex codes can be found in the [tailwind.config.cjs](tailwind.config.cjs) file.

  #### Light mode:
  ```
  - Background colors:
    - default: bg-slate-50
    - highlight: bg-white
    - subhighlight: bg-slate-100
    - warning: bg-red-500/80
  - Text colors:
    - default: text-slate-700
    - subtext: text-slate-500
  - Highlight color: text-primary
  ```

  #### Dark mode:

  ```
  - Background colors:
    - default: bg-slate-950
    - highlight: bg-slate-800
    - subhighlight: bg-slate-700/50
    - warning: bg-red-500/80
  - Text colors:
    - default: text-slate-300
    - subtext: text-slate-400
  - Highlight color: text-primary-500
  ```