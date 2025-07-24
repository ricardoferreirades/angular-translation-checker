# Installation

Angular Translation Checker can be installed globally for command-line use or locally as a development dependency in your project.

## Global Installation

Install globally to use the `ng-i18n-check` command anywhere:

::: code-group

```bash [npm]
npm install -g angular-translation-checker
```

```bash [yarn]
yarn global add angular-translation-checker
```

```bash [pnpm]
pnpm add -g angular-translation-checker
```

:::

After global installation, verify it's working:

```bash
ng-i18n-check --version
# or
angular-translation-checker --version
```

## Local Installation

For project-specific installation, add it as a development dependency:

::: code-group

```bash [npm]
npm install --save-dev angular-translation-checker
```

```bash [yarn]
yarn add --dev angular-translation-checker
```

```bash [pnpm]
pnpm add -D angular-translation-checker
```

:::

Then run it using npm scripts or npx:

```bash
# Using npx
npx ng-i18n-check

# Or add to package.json scripts
{
  "scripts": {
    "check-translations": "ng-i18n-check"
  }
}
```

## Requirements

- **Node.js**: Version 14.0.0 or higher
- **Angular**: Version 12.0.0 or higher (peer dependency)
- **ngx-translate**: Any version (the tool analyzes the translation patterns)

## Verification

Test your installation by running a basic check:

```bash
# Global installation
ng-i18n-check --help

# Local installation  
npx ng-i18n-check --help
```

You should see the help output with all available options.

## Project Structure Detection

Angular Translation Checker automatically detects common Angular project structures:

```
src/
├── assets/
│   └── i18n/          # ✅ Default location
├── assets/
│   └── locales/       # ✅ Alternative location  
└── app/
    └── ...            # Source files to analyze
```

If your project uses a different structure, you can specify custom paths:

```bash
ng-i18n-check --locales-path ./custom/i18n --src-path ./custom/src
```

## Next Steps

Now that you have Angular Translation Checker installed, head over to the [Quick Start](/guide/quick-start) guide to run your first analysis, or learn about [Configuration](/guide/configuration) options to customize the tool for your project.
