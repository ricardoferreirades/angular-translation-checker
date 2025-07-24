# Configuration Examples

This page provides practical configuration examples for different project setups and use cases.

## Basic Configuration

```json
{
  "localesPath": "./src/assets/i18n",
  "srcPath": "./src",
  "outputSections": ["summary", "unused", "missing"]
}
```

## Advanced Configuration

```json
{
  "localesPath": "./src/assets/i18n",
  "srcPath": "./src",
  "keysExtensions": [".ts", ".html"],
  "excludeDirs": ["node_modules", "dist", ".git"],
  "ignoreKeys": ["debug.*", "test.*"],
  "ignorePatterns": ["*.temp", "*.mock"],
  "outputFormat": "console",
  "outputSections": ["summary", "dynamicPatterns", "ignored", "unused", "missing"],
  "exitOnIssues": false,
  "verbose": false
}
```

## Configuration with Ignore Patterns

```json
{
  "localesPath": "./src/assets/i18n",
  "srcPath": "./src",
  "ignoreKeys": [
    "debug.*",
    "test.*",
    "mock.*",
    "*.temp"
  ],
  "ignorePatterns": [
    "debug\\..*",
    ".*\\.test$",
    "temp_.*"
  ],
  "outputSections": ["summary", "unused", "missing"]
}
```

For more configuration options, see the [Configuration Guide](/guide/configuration).
