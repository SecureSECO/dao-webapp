# SecureSECO DAO web-app

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

## Packages

### Web3 packages

#### Aragon SDK

[Documentation](https://devs.aragon.org/docs/sdk/)

Primarily used for: interacting with Aragon smart contracts
Aragon SDK is used for interacting with the smart contracts from Aragon. We've been extending the base smart contracts with our own plugins, so for those, we use the custom Plopmens SDK to interact with our custom plugins.

#### Ethers

[Documentation](https://docs.ethers.io/v5/)

Primarily used for: interacting with Ethereum blockchain.
Ethers is a library for interacting with the Ethereum blockchain. We might move to [Viem](https://viem.sh/) when it goes out of beta and Wagmi starts using it. We use Ethers v5, since wagmi currently required ethers<6, but this will change when wagmi moves to viem.

#### Plopmens SDK

[Documentation](https://github.com/SecureSECODAO/diamond-governance)

Primarily used for: interacting with our custom smart contracts
Made by our own Plopmens to interact with our custom smart contracts. Check out the github repo [here](https://github.com/SecureSECODAO/diamond-governance)

#### React Jazzicon

[Documentation](https://github.com/marcusmolchany/react-jazzicon#readme)

Primarily used for: generating SVG icons based on user addresses
React Jazzicon is used for transforming a user's address (public key hash) into a beautiful SVG. Built into our `<Address/>` component as well.

#### Wagmi

[Documentation](https://wagmi.sh/react/getting-started)

Primarily used for: interacting with wallet connectors
We use Wagmi's React hooks to interact with the wallet connector, such as checking if the user is connected and requesting transactions, signatures, and more through the wallet provider.

#### WalletConnect + Web3Modal

[Documentation](https://docs.walletconnect.com/2.0/web3modal/react/installation)

Primarily used for: wallet connection on the site
We use WalletConnect and Web3Modal for wallet connection on the site. They make it easy to connect and interact with different wallets.

### Normal Dependencies

#### Class Variance Authority

[Documentation] (https://cva.style/docs)

Primarily used for: components and variants, naming convention
Used for components and variants,

##### naming convention

TODO

#### Clsx + Tailwind-Merge

[Clsx Documentation](https://github.com/lukeed/clsx#readme) / [Tailwind-Merge Documentation](https://github.com/dcastil/tailwind-merge)

Primarily used for: conditional CSS class application
Clsx and Tailwind-Merge are used together to create the `cn()` function, which makes it easier to conditionally apply Tailwind CSS classes. Defined in [lib/utils.ts](/src/lib/utils.ts). This function is inspired by the shadcn: https://ui.shadcn.com/docs

#### ESLint

[Documentation](https://eslint.org/docs/latest/)

Primarily used for: linting JavaScript and TypeScript code

ESLint is used to enforce code quality and consistency. Make sure to install the Visual Studio Code extension [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

We are using some plugins for eslint to make it work for [tailwind](https://github.com/francoismassart/eslint-plugin-tailwindcss) (eslint-plugin-tailwindcss"), [storybook](https://github.com/storybookjs/eslint-plugin-storybook#readme) (eslint-plugin-storybook) and [react](https://github.com/jsx-eslint/eslint-plugin-react) (eslint-plugin-react).

#### Jest

[Documentation](https://jestjs.io/docs/getting-started)

Primarily used for: testing JavaScript and TypeScript code
Jest is a testing framework for JavaScript and TypeScript code. It helps to ensure the quality and correctness of our codebase.

#### Prettier

[Documentation](https://prettier.io/docs/en/index.html)

Primarily used for: code formatting
Prettier is a code formatter that enforces a consistent coding style across the project. We also use a prettier plugin called [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss#readme) that enforces tailwinds recommended class order.

Make sure to install the Visual Studio Code extension [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

#### Radix UI

[Documentation](https://www.radix-ui.com/docs/primitives)

Primarily used for: building UI components
Radix UI is a collection of highly customizable, accessible, and unstyled UI components. We use it as the foundation for our

own components. Radix UI is highly inspired by the shadcn components: https://ui.shadcn.com/docs

#### React + Vite

[React Documentation](https://react.dev/reference/react) / [Vite Documentation](https://vitejs.dev/guide/)

Primarily used for: building and developing the web application

We use React as the main UI library and Vite as the build tool and development server. We didn't go for Next.js, since the Aragon SDK had problems using SSR.

#### React DOM

[Documentation](https://reactjs.org/docs/react-dom.html)

Primarily used for: rendering React components to the DOM
React DOM is used for rendering our React components to the browser's DOM. It's a standard dependency for React applications.

#### React Hook Form

[Documentation](https://react-hook-form.com/get-started)

Primarily used for: handling form elements

React Hook Form is used for form elements, mainly in voting and the creation of new proposals. Sometimes it is needed to use the `<Controller/>` around the component, since some components are Radix UI components and not default HTML components. Please look in the repository for how the component is being used.

#### React Router (DOM)

[Documentation](https://reactrouter.com/en/main)

Primarily used for: client-side routing
React Router is a powerful and flexible client-side routing library for React applications. It helps us manage navigation and rendering of components based on the current URL.

React Router DOM is a set of bindings to use React Router with web applications. It provides the necessary components and hooks for managing navigation and rendering components based on the current URL in a web environment.

#### Storybook

[Documentation](https://storybook.js.org/docs/react/get-started/install/)

Storybook is a frontend workshop for building UI components and pages in isolation.
To run the storybook, use the following command:
`npm run storybook`

The storybook can also be build, using:
`npm run build-storybook`

#### Tiptap

[Documentation](https://tiptap.dev/)

Primarily used for: creating rich text editors
Tiptap is a powerful, extensible, and customizable rich text editor for the web. We use it for the `<TextareaWYSIWYG/>` component for writing styled markdown text.

#### Tailwind CSS

[Documentation](https://tailwindcss.com/docs)

Primarily used for: styling the application
Tailwind CSS is a utility-first CSS framework for rapidly building custom designs. We use it for styling the entire app and components. When possible, use `@apply` in CSS files for better maintainability.

#### TypeScript

[Documentation](https://www.typescriptlang.org/docs/)

Primarily used for: adding types to JavaScript code
TypeScript is a superset of JavaScript that adds optional static types. It helps us catch errors early in the development process and improves the overall code quality.

## Testing

Although most UI testing will have to occur manually (through the aid of storybook), there is support for automatic testing.
The automatic Storybook tests (defined using _play_ functions) can be run using: `npm run test-storybook`.
There is also support for tests written using _Jest_, mostly used for testing logic.
These tests can be run using `npm test` (or optionally `npm run test`).

## Style guide

### Code style

The code should be formatted as dictated by the automatic formatting tools.
Code that gives an error upon linting (using `npm run lint`) should not be committed.
It is also advised to turn on the `Format On Save` option in settings if you are using VS Code. Alternatively, you can run `npm run format` to format **_all_** files in the project, however, it is preferable to format only the files that you change.

### Colors

Colors are defined using CSS variables in [index.css](/src/index.css) based on the approach taken by [shadcn](https://ui.shadcn.com/docs/theming). Each color has variants for light and dark mode, making it easy to change a color, without having to change the code everywhere that color is used.
The colors defined in this CSS file correspond to those defined in [tailwind.config.cjs](tailwind.config.cjs), and when adding a new color to the css file, the tailwind config should be updated accordingly.

The approach of shadcn uses a `background` and `foreground` convention, where the `background` variable is used for the background color of the component and the `foreground` variable is used for the text color. Usually, the `background` suffix is omitted in the variable, if the color only needs a background and foreground color. For example, in the [Button](/src/components/ui/Button.tsx) component, there is a `primary` variant that uses the tailwind class `bg-primary` to make the button's background color our primary color, and `text-primary-foreground` to give the text the corresponding foreground color. Note that the foreground variant of a color should always be properly readable on top of the corresponding background variant.

Hover effects for buttons etc. are given by appylying the normal background color with a lower opacity, usually 80% opacity of the original.

The following is a list of the colors currently being used:

Default background color of `<body />` etc.

```

```

Some specific cases:

- Links (`<a>` tags) usually get the following styling: `text-primary-highlight underline transition-colors duration-200 hover:text-primary-highlight/80`

### License

This repository is [MIT licensed](./LICENSE).
