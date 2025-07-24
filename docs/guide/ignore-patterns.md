# Ignore Patterns

Sometimes you need to exclude certain translation keys from analysis. Angular Translation Checker provides flexible ignore patterns to help you filter out keys that shouldn't be considered during analysis.

## Configuration Options

### Basic Ignore Keys

Use the `ignoreKeys` array to specify exact keys or patterns to ignore:

```json
{
  "ignoreKeys": [
    "debug.log",
    "temp.data",
    "test.*"
  ]
}
```

### Wildcard Patterns

Ignore patterns support wildcards for flexible matching:

```json
{
  "ignoreKeys": [
    "errors.*",           // All keys starting with "errors."
    "*.temporary",        // All keys ending with ".temporary"
    "debug.*.*",          // All nested keys under "debug"
    "test.*.result"       // Specific pattern matching
  ]
}
```

## Pattern Types

### 1. Exact Match
```json
{
  "ignoreKeys": ["specific.key", "another.exact.key"]
}
```

### 2. Prefix Matching
```json
{
  "ignoreKeys": ["prefix.*"]
}
```
Matches: `prefix.anything`, `prefix.nested.key`, etc.

### 3. Suffix Matching
```json
{
  "ignoreKeys": ["*.suffix"]
}
```
Matches: `anything.suffix`, `nested.key.suffix`, etc.

### 4. Middle Wildcards
```json
{
  "ignoreKeys": ["start.*.end"]
}
```
Matches: `start.anything.end`, `start.multiple.words.end`, etc.

### 5. Multiple Wildcards
```json
{
  "ignoreKeys": ["*.temp.*", "debug.*.*.log"]
}
```

## Dynamic Key Handling

### Ignore Dynamic Keys
When you have dynamically generated keys, you can choose to ignore all dynamic patterns:

```json
{
  "ignoreDynamicKeys": true
}
```

### Selective Dynamic Ignoring
Or ignore specific dynamic patterns:

```json
{
  "ignoreKeys": [
    "dynamic.*",
    "generated.*",
    "runtime.*"
  ],
  "ignoreDynamicKeys": false
}
```

## Common Use Cases

### Development and Debug Keys
```json
{
  "ignoreKeys": [
    "debug.*",
    "dev.*",
    "console.*",
    "log.*"
  ]
}
```

### Test and Mock Data
```json
{
  "ignoreKeys": [
    "test.*",
    "mock.*",
    "fake.*",
    "sample.*",
    "*.test",
    "*.mock"
  ]
}
```

### Temporary or Placeholder Keys
```json
{
  "ignoreKeys": [
    "temp.*",
    "tmp.*",
    "placeholder.*",
    "*.temp",
    "*.tmp",
    "*.placeholder"
  ]
}
```

### Feature Flags or Experimental
```json
{
  "ignoreKeys": [
    "experimental.*",
    "beta.*",
    "alpha.*",
    "feature.*",
    "flag.*"
  ]
}
```

### Error Messages (if managed separately)
```json
{
  "ignoreKeys": [
    "errors.*",
    "error.*",
    "*.error",
    "*.errors",
    "validation.*"
  ]
}
```

## Environment-Specific Ignoring

### Development Environment
```json
{
  "ignoreKeys": [
    "debug.*",
    "dev.*",
    "local.*"
  ]
}
```

### Production Environment
```json
{
  "ignoreKeys": [
    "test.*",
    "mock.*",
    "debug.*"
  ]
}
```

### CI/CD Environment
```json
{
  "ignoreKeys": [
    "test.*",
    "debug.*",
    "dev.*",
    "local.*"
  ]
}
```

## Advanced Patterns

### Nested Namespace Ignoring
```json
{
  "ignoreKeys": [
    "app.debug.*.*",
    "components.*.test.*",
    "services.*.mock.*"
  ]
}
```

### Conditional Ignoring
```json
{
  "ignoreKeys": [
    "*.component.debug",
    "*.service.test",
    "*.module.mock"
  ]
}
```

## Validation and Testing

### Test Your Patterns
You can test your ignore patterns by running:

```bash
# See which keys are being ignored
ng-i18n-check --output ignored

# Verbose output to see pattern matching
ng-i18n-check --output ignored,dynamicPatterns
```

### Pattern Debugging
If patterns aren't working as expected:

1. Check the exact key names in your translation files
2. Verify the pattern syntax (wildcards, escaping)
3. Use the `ignored` output section to see what's being ignored
4. Test with simpler patterns first, then add complexity

## Best Practices

### 1. Start Simple
Begin with exact matches, then add wildcards as needed:
```json
{
  "ignoreKeys": ["debug.log"]
}
```

### 2. Use Consistent Naming
Establish naming conventions that work well with patterns:
```json
{
  "ignoreKeys": ["*.debug", "*.test", "*.temp"]
}
```

### 3. Document Your Patterns
Add comments explaining complex patterns:
```json
{
  "_comment": "Ignore all debug keys and test data",
  "ignoreKeys": [
    "debug.*",
    "test.*"
  ]
}
```

### 4. Regular Review
Periodically review and update ignore patterns as your project evolves.

### 5. Team Consistency
Ensure all team members understand and follow the same ignore patterns.

## Configuration Examples

### Minimal Configuration
```json
{
  "ignoreKeys": ["debug.*", "test.*"]
}
```

### Comprehensive Configuration
```json
{
  "ignoreKeys": [
    "debug.*",
    "test.*",
    "mock.*",
    "temp.*",
    "dev.*",
    "*.test",
    "*.mock",
    "*.debug",
    "experimental.*",
    "feature.flags.*"
  ],
  "ignoreDynamicKeys": false
}
```

### Environment-Specific
```json
{
  "development": {
    "ignoreKeys": ["debug.*"]
  },
  "production": {
    "ignoreKeys": ["debug.*", "test.*", "dev.*"]
  }
}
```

## Troubleshooting

### Pattern Not Working?
- Check for typos in key names
- Verify wildcard placement
- Test with exact matches first
- Use the `ignored` output to debug

### Too Many Keys Ignored?
- Make patterns more specific
- Remove overly broad wildcards
- Review pattern ordering

### Performance Issues?
- Avoid overly complex patterns
- Use specific patterns instead of broad wildcards
- Consider using exact matches for frequently used keys

Need more help? Check the [troubleshooting guide](/guide/troubleshooting) or see [examples](/examples/) for real-world usage patterns.
