# dao-webapp

### Environment variables

Some default env varialbes are provided by [Vite](https://vitejs.dev/guide/env-and-mode.html) in the `import.meta.env` object. Custom variables should be prefixed with `VITE_` to expose them to the code.

Note on `.env` files:

- `.env.production` for production-specific variables
- `.env.development` for development-specific variables
- `.env` for all other environment variables

# When first setting up

1. Copy the .env.example file to .env and fill in the values
2. Optional: Install the *Prettier* and *ESlint* plugin in vscode (or your editor of choice), might have to restart your editor.
3. In case you haven't alread: Install *npm*
4. run: `npm i`

### Colors
Below is a list of colors used for specific elements, both for light mode as well as dark mode. Colors are represented as tailwind classes here. The correpsonding hex codes can be found in the [tailwind.config.cjs](tailwind.config.cjs) file.

Light mode:
- Background colors:
    - default: bg-slate-50
    - highlight: bg-white
    - subhighlight: bg-slate-100
    - warning: bg-red-500/80
- Text colors:
    - default: text-slate-700
    - subtext: text-slate-500
- Highlight color: text-primary

Dark mode:
- Background colors:
    - default: bg-slate-950
    - highlight: bg-slate-800
    - subhighlight: bg-slate-700/50
    - warning: bg-red-500/80
- Text colors:
    - default: text-slate-300
    - subtext: text-slate-400
- Highlight color: text-primary-500
