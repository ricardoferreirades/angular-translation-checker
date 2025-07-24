# Output Formats

Examples of different output formats available in Angular Translation Checker.

## Console Output (Default)

```bash
ng-i18n-check
```

Output:
```
🔍 Angular Translation Checker v1.3.5

📊 Translation Summary
Total Keys: 156
Used Keys: 142
Unused Keys: 14
Missing Keys: 3

🔍 Dynamic Patterns Detected
No dynamic patterns found

🚫 Ignored Keys
debug.* (3 keys)
test.* (5 keys)

❌ Unused Keys
- feature.old.button
- feature.deprecated.message
- common.unused.label

⚠️  Missing Keys
- user.profile.bio
- settings.new.option
- common.required.field
```

## JSON Output

```bash
ng-i18n-check --format json
```

```json
{
  "summary": {
    "totalKeys": 156,
    "usedKeys": 142,
    "unusedKeys": 14,
    "missingKeys": 3
  },
  "dynamicPatterns": [],
  "ignored": ["debug.*", "test.*"],
  "unused": ["feature.old.button", "feature.deprecated.message", "common.unused.label"],
  "missing": ["user.profile.bio", "settings.new.option", "common.required.field"]
}
```

## CSV Output

```bash
ng-i18n-check --format csv
```

```csv
Type,Key,Status
unused,feature.old.button,unused
unused,feature.deprecated.message,unused
unused,common.unused.label,unused
missing,user.profile.bio,missing
missing,settings.new.option,missing
missing,common.required.field,missing
```

For more details, see the [Output Formats Guide](/guide/output-formats).
