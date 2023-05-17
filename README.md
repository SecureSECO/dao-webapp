<p align="center">
  <a
    href="https://github.com/SecureSECODAO/dao-webapp/blob/master/LICENSE"
    alt="License"
  >
    <img src="https://img.shields.io/github/license/SecureSECODAO/dao-webapp" />
  </a>
  <a
    href="https://github.com/SecureSECODAO/dao-webapp/graphs/contributors"
    alt="Contributors"
  >
    <img src="https://img.shields.io/github/contributors/SecureSECODAO/dao-webapp" />
  </a>
  <a
    href="https://github.com/SecureSECODAO/dao-webapp/pulse"
    alt="Activity"
  >
    <img src="https://img.shields.io/github/commit-activity/m/SecureSECODAO/dao-webapp" />
  </a>
  <a
    href="https://github.com/SecureSECODAO/dao-webapp/actions"
    alt="Actions"
  >
    <img src="https://github.com/SecureSECODAO/dao-webapp/actions/workflows/test.yml/badge.svg?branch=master" />
  </a>
  <a
    href="https://dao-webapp-securesecodao.vercel.app/"
    alt="Vercel deployment"
  >
    <img src="https://img.shields.io/github/deployments/SecureSECODAO/dao-webapp/production?label=vercel&logo=vercel" />
  </a>
</p>

# SecureSECO DAO web-app

This is the repository for the web-app to interact with the DAO for the [SecureSECO](https://secureseco.org/) project.
It has been built using React together with Vite.

## Initial setup

### Environment variables

Some default env variables are provided by [Vite](https://vitejs.dev/guide/env-and-mode.html) in the `import.meta.env` object. Custom variables should be prefixed with `VITE_` to expose them to the client-sided code.
All custom defined env variables are normally defined in a `.env` file in the root directory of the project. The [`.env.example`](/.env.example) file serves as an example of the env variables that you need to define in your own `.env` file.

There is support for IntelliSense on the `import.meta.env` for custom defined env variables, provided by the [`env.d.ts`](/src/env.d.ts) file. A note of warning on the use of types in this declaration file: the env varialbes are always strings, so declaring it as any other type in `env.d.ts` may cause unintentional artifacts (such as the code thinking the variable is a `number`, while really its)

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

```
npm run dev
```

Use the following command to build the webapp for deployment:

```
npm run build
```

After building the webapp, it is possible to locally run the built webapp using:

```
npm run preview
```

## Contributing

Contributions to the web-app are welcome. Below are some guidelines to follow when contributing.

### Branch organization

Development is done on the `dev` branch. When adding a new feature, bug fix, or anything else, a new branch should be created based on the `dev` branch (using kebeb case for its name). When the branch is done and no more changes will be pushed to it, a pull request can be opened to the `dev` branch.

The main production branch is `master`, which is the branch that the live production deployment is based on. The `master` branch should be updated only be way of a pull request from the `dev` branch.

Both the `dev` branch as well as the `master` branch are protected, and can only be changed by pull requests that pass the test workflow.

### Development workflow

After developing a feature or bug fix on a separate branch, the following commands can be run to ensure the project still builds and all tests pass before opening a pull request to the `dev` branch:

- `npm run build` to make sure the project builds without errors
- `npm run lint` to check the code style
- `npm run format` to format the code using prettier
- `npm run test` to run the Jest tests for logic functions
- `npm run storybook` followed by `npm run test-storybook` to run the visual UI tests

### Storybook

For component where it makes sense (most components) to be able to view it in Storybook, a story should be written. For example, if you create a component in the file `Example.tsx`, you should write a story in the file `Example.stories.tsx`.
You can refer to [this page](https://storybook.js.org/docs/react/writing-stories/introduction) for further instructions on how to write a story, or have a look at one of the existing `.stories` files for reference. In particular, it is advised to add the property `tags: ['autodocs']` to the `meta` object of every story.

### Style guide

#### Code style

The code should be formatted as dictated by the automatic formatting tools.
It is advised to turn on the `Format On Save` option in settings if you are using VS Code. Alternatively, you can run `npm run format` to format **_all_** files in the project, however, it is preferable to format only the files that you change.

#### Page structure

The general page structure is set up as follows:

- `<HeaderCard />` component at the top, with the title of the page, and optionally a button or some other content on the right side (using the `aside` prop)
- `<MainCard />` or regular `<Card />` components for the content of the page, with `1.5rem` of spacing in between the cards (tailwind class is `gap-6`)
- `<Card />` with prop `variant='light'` for items inside of the main cards

#### Icons

The project uses [react-icons](https://react-icons.github.io/react-icons/) for most of the icons. In particular, we aim to use [Heroicons v2](https://heroicons.com/), wherever necessary. As react-icons includes both v1 and v2 of Heroicons, it's important to make sure the the imports from the react-icons library are importing v2 (so make sure the icon is imported from `react-icons/hi2` rather than `react-icons/hi`). If there's something you'd like to use that is not included in Heroicons, you can try [Font Awesome](https://fontawesome.com/) instead. Font Awesome is especially useful for logos of various companies, such as Github. If Heroicons, nor Font Awesome, has what you're looking for, there's a heap of other icon libraries included in react-icons.

If none of the icon libraries in react-icons are satisfactory, you may add a custom icon based on an svg to the [icons](/src/components/icons/) folder. Have a look at one of the other files already in that folder for an example on how to go about doing so. In the past, this approach has been used to add icons from [Lucide](https://lucide.dev/), which is an icon library that is not included in react-icons.

#### Headers

Headers, like `<h1 />`, `<h2 />` etc., should not be used directly. Instead, use the [Header](/src/components/ui/Header.tsx) component, and pass it a prop `level` corresponding to the component of choice. For example, when you need an `<h1 />`, you should instead use `<Header level={1}/>`.

#### Inputs & Labels

Similar to the headers, inputs and labels should not be used plainly like `<input />` or `<label />`. Instead, use the provided `<Input />` and `<Label />` components.

#### Loading states

When a component that requires some dynamic data to show its content is loading, it should show a loading state in the form of a pulsing placeholder.

For top-level Card components (usually MainCard or HeaderCard), the `loading` prop should be used, which will show the card pulsing when the boolean variable passed to the prop is true. It also applies a minimum height depending on the `size` prop passed to the Card component, to make it clearly visible despite it not having any content yet (since the content is loading).

When you need loading placeholders for a collection of items, or really any other component that is not a Card, there is a `<Skeleton />` component, which has styles for a pulsing animation and background color. Sizing should be done manually by passing the `className` prop. For example, the following would show two loading placeholders with a height of 80px, taking up the full width of the container:

```jsx
<div className="space-y-4">
  <Skeleton className="h-20 w-full" />
  <Skeleton className="h-20 w-full" />
</div>
```

#### Colors

Colors are defined using CSS variables in [index.css](/src/index.css) based on the approach taken by [shadcn](https://ui.shadcn.com/docs/theming). Each color has variants for light and dark mode, making it easy to change a color, without having to change the code everywhere that color is used.
The colors defined in this CSS file correspond to those defined in [tailwind.config.cjs](tailwind.config.cjs), and when adding a new color to the css file, the tailwind config should be updated accordingly.

The approach of shadcn uses a `background` and `foreground` convention, where the `background` variable is used for the background color of the component and the `foreground` variable is used for the text color. Usually, the `background` suffix is omitted in the variable, if the color only needs a background and foreground color. For example, in the [Button](/src/components/ui/Button.tsx) component, there is a `primary` variant that uses the tailwind class `bg-primary` to make the button's background color our primary color, and `text-primary-foreground` to give the text the corresponding foreground color. Note that the foreground variant of a color should always be properly readable on top of the corresponding background variant.

Hover effects for buttons etc. are given by appylying the normal background color with a lower opacity, usually 80% opacity of the original.

The following is a list of the colors currently being used (light mode):

- Default background color and corresponding text color of `<body />` etc.

```

--background: 210 40% 98%;
--foreground: 215 25% 27%;

```

- Muted backgrounds for things like loading skeletons and background of `<Progress />`

```

--muted: 214 32% 91%;
--muted-foreground: 215 25% 27%;

```

- Colors for top-level cards (first card on top of the background of the page), such as `<MainCard />`

```

--highlight: 0 0% 100%;
--highlight-foreground: 215 25% 27%;

```

- Colors for second-level cards, such as the `light` variant of the `<Card />` component

```

--popover: 210 40% 98%;
--popover-foreground: 215 25% 27%;

```

- Primary colors, where highlight is a lighter version of the main color, used in various places, such as `<Button />`

```

--primary: 215 54% 34%;
--primary-foreground: 210 40% 98%;
--primary-highlight: 213 52% 60%;

```

- Colors used for accents, such as the `subtle` variant of the `<Button />` component, certain hover effects, and separator lines such as the one in `<CategoryList />`

```

--accent: 210 40% 94%;
--accent-foreground: 222 47% 11%;

```

- Green colors, used for things like successful toasts in `<Toast />` (note that the default color here is for green text, and the variable with the `-background` suffix is specifically meant for components with a green background)

```

--success: 142 69% 58%;
--success-background: 120 100% 90%;
--success-foreground: 216 34% 17%;

```

- Red colors, used for things like failed toasts, or showing form input errors in `<ErrorWrapper />` (note that the default color here is for red text, and the variable with the `-background` suffix is specifically meant for components with a red background)

```

--destructive: 0 91% 71%;
--destructive-background: 0 96% 89%;
--destructive-foreground: 216 34% 17%;

```

- Default border color

```

--border: 214 32% 91%;

```

- Border color for inputs, such as `<Input />`, `<Select />`, `<Textarea />` etc.

```

--input: 214 32% 91%;

```

- Color for the ring shown around certain focused components, such as `<Dialog />` (a lot of components, like `<Button />` use other ring colors)

```

--ring: 215 20% 65%;

```

Some specific examples of how to use the color classes:

- Component with a highlight background: `bg-highlight text-highlight-foreground`
- Subtext inside of a `light` variant `<Card />` component: `text-popover-foreground/80`
- Even more subtle text inside of a `light` variant `<Card />` component: `text-popover-foreground/60`
- Links (`<a>` tags) usually get the following styling: `text-primary-highlight underline transition-colors duration-200 hover:text-primary-highlight/80 ring-ring ring-offset-2 ring-offset-background focus:outline-none focus:ring-1 rounded-sm`

### Adding proposal actions

Proposal actions are essentially smart contract calls that can be executed upon a proposal being passed by the DAO. To add support for a new proposal, assuming it has already been added to the DAO in smart contracts, you should add the following files (when adding an action called `example`):

- `ExampleAction.tsx` to the [components/proposal/actions](/src/components/proposal/actions) folder. This should be a component to view the action on the view-proposal-page, and the final step of the new proposal flow. You can refer to the other components for the existing actions for examples of the expected style. Don't forget to write a story for this component. This file should also include an interface `ProposalExampleAction` that extends the `Action` interface, which is defined in the diamond governance SDK npm package.
- `ExampleInput.tsx` to the [components/newProposal/actions](/src/components/newProposal/actions) folder. This should be a component that can be used as part of a form to add an action in the new proposal flow. Again, refer to the files already in the folder for examples. This file should also include an interface `ProposalFormExampleData` that extends the `ProposalFormAction` interface, which is defined in the diamond governance SDK npm package.

Additionally, you should update the file [actions.tsx](/src/lib/constants/actions.tsx) should be updated in the following places (all located at the top of the file):

- Add the type `ProposalFormExampleData` that you added in your new file to the `ProposalFormActionData` type, similar to those that are already there
- Add a property to the type `Actions`, with the key `example` with the following type: `ActionData<ProposalExampleAction, ProposalFormExampleData>`, again similar to those that are already there
- Add an entry to the `ACTIONS` object with they key `example`, with all the required data (an explanation of each property can be found in that same file at the type definition for `ActionData`)

It is also worth mentioning that it is highly encouraged to write stories for the new components that you add, and to add a dummy object for the action to the [useProposal.ts](/src/hooks/useProposal.ts) file, which can then be used in stories for other components ([ProposalActions](/src/components/proposal/ProposalActions.stories.tsx) and [ProposalCard](/src/components/governance/ProposalCard.stories.tsx)). The existing actions also have a story in [ProposalTag.stories.tsx](/src/components/governance/ProposalTag.stories.tsx) each, so be sure to also a story for the new action there.

## Dependencies

### Web3 packages

#### Aragon SDK

[Documentation](https://devs.aragon.org/docs/sdk/)

Primarily used for: interacting with default Aragon smart contracts
Aragon SDK is used for interacting with the smart contracts from Aragon. We've been extending the base smart contracts with our own plugins, so for those, we use the custom Plopmens SDK to interact with our custom plugins. Because of our own SDK implementation that supports our plugin, the aragon sdk might become unused.

#### Ethers

[Documentation](https://docs.ethers.io/v5/)

Primarily used for: interacting with Ethereum blockchain and wallet connection/wagmi hooks.
Ethers is a library for interacting with the Ethereum blockchain. We might move to [Viem](https://viem.sh/) when it goes out of beta and Wagmi starts using it. We use Ethers v5, since wagmi currently required ethers<6, but this will change when wagmi moves to viem.

#### Secure Seco DAO SDK

[Documentation](https://github.com/SecureSECODAO/diamond-governance)

Primarily used for: interacting with our custom smart contracts and plugins. See [hooks](/src/hooks/)
Made by our own Plopmens to interact with our custom smart contracts. Check out the github repo [here](https://github.com/SecureSECODAO/diamond-governance)

#### React Jazzicon

[Documentation](https://github.com/marcusmolchany/react-jazzicon#readme)

Primarily used for: generating SVG icons based on user addresses. See [<Address/>](/src/components/ui/Address.tsx) and [<ConnectButton/>](/src/components/layout/ConnectButton.tsx)
React Jazzicon is used for transforming a user's address (public key hash) into a beautiful SVG. Built into our `<Address/>` component as well.

#### Wagmi

[Documentation](https://wagmi.sh/react/getting-started)

Primarily used for: interacting with wallet connectors.
We use Wagmi's React hooks to interact with the wallet connector, such as checking if the user is connected and requesting transactions, signatures, and more through the wallet provider.

#### WalletConnect + Web3Modal

[Documentation](https://docs.walletconnect.com/2.0/web3modal/react/installation)

Primarily used for: wallet connection on the site
We use WalletConnect and Web3Modal for wallet connection on the site. They make it easy to connect and interact with different wallets.

### Regular Dependencies

#### Class Variance Authority

[Documentation](https://cva.style/docs)

Primarily used for: Almost all [components](/src/components/) and variants.
Refer to one of the existing components that uses variants to see how to use it. For example, see the [Button](/src/components/ui/Button.tsx) component.

#### Clsx + Tailwind-Merge

[Clsx Documentation](https://github.com/lukeed/clsx#readme) / [Tailwind-Merge Documentation](https://github.com/dcastil/tailwind-merge)

Primarily used for: conditional CSS class application
Clsx and Tailwind-Merge are used together to create the `cn()` function, which makes it easier to conditionally apply Tailwind CSS classes. Defined in [lib/utils.ts](/src/lib/utils.ts). This function is inspired by the shadcn: https://ui.shadcn.com/docs

#### ESLint

[Documentation](https://eslint.org/docs/latest/)
[Config](/.eslintrc.cjs)

Primarily used for: linting JavaScript and TypeScript code

ESLint is used to enforce code quality and consistency. Make sure to install the Visual Studio Code extension [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

We are using some plugins for eslint to make it work for [tailwind](https://github.com/francoismassart/eslint-plugin-tailwindcss) (eslint-plugin-tailwindcss"), [storybook](https://github.com/storybookjs/eslint-plugin-storybook#readme) (eslint-plugin-storybook) and [react](https://github.com/jsx-eslint/eslint-plugin-react) (eslint-plugin-react).

#### Jest

[Documentation](https://jestjs.io/docs/getting-started)
[Config](/jest.config.ts)

Primarily used for: testing JavaScript and TypeScript code
Jest is a testing framework for JavaScript and TypeScript code. It helps to ensure the quality and correctness of our codebase.

#### Prettier

[Documentation](https://prettier.io/docs/en/index.html)
[Config](/prettier.config.cjs)

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
[Config](/vite.config.ts)

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

Primarily used for: creating rich text editors, see [<TextareaWYSIWYG/>](/src/components/ui/TextareaWYSIWYG.tsx)
Tiptap is a powerful, extensible, and customizable rich text editor for the web. We use it for the [<TextareaWYSIWYG/>](/src/components/ui/TextareaWYSIWYG.tsx) component for writing styled markdown text.

#### Tailwind CSS

[Documentation](https://tailwindcss.com/docs)
[Config](/tailwind.config.cjs)

Primarily used for: styling the application
Tailwind CSS is a utility-first CSS framework for rapidly building custom designs. We use it for styling the entire app and components. When possible, use `@apply` in CSS files for better maintainability.

#### TypeScript

[Documentation](https://www.typescriptlang.org/docs/)
[Config](/tsconfig.json)

Primarily used for: adding types to JavaScript code
TypeScript is a superset of JavaScript that adds optional static types. It helps us catch errors early in the development process and improves the overall code quality.

## Testing

Although most UI testing will have to occur manually (through the aid of storybook), there is support for automatic testing.
The automatic Storybook tests (defined using _play_ functions) can be run using: `npm run test-storybook`.
There is also support for tests written using _Jest_, mostly used for testing logic.
These tests can be run using `npm test` (or optionally `npm run test`).

## License

This repository is [MIT licensed](./LICENSE).

```

```
