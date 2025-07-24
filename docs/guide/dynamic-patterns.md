# Dynamic Patterns

Dynamic patterns are translation keys that are generated programmatically at runtime, making them challenging to detect through static analysis. Angular Translation Checker includes intelligent pattern detection to help identify and handle these dynamic keys.

## What Are Dynamic Patterns?

Dynamic patterns occur when translation keys are constructed programmatically:

```typescript
// Dynamic key construction
const keyPrefix = 'user.profile';
const action = 'edit';
const dynamicKey = `${keyPrefix}.${action}`; // Results in 'user.profile.edit'
this.translate.get(dynamicKey);

// Variable-based keys
const status = user.status; // 'active', 'inactive', 'pending'
this.translate.get(`status.${status}`);

// Computed keys
const errorCode = response.errorCode;
this.translate.get(`errors.${errorCode}.message`);
```

## Detection Mechanisms

### Automatic Pattern Detection

Angular Translation Checker automatically detects common dynamic patterns:

```typescript
// Template literal patterns
translate.get(`prefix.${variable}`)
translate.get(`${base}.suffix`)
translate.get(`${prefix}.${middle}.${suffix}`)

// String concatenation
translate.get(baseKey + '.' + suffix)
translate.get('prefix.' + dynamicPart)

// Array join patterns
translate.get(['prefix', variable, 'suffix'].join('.'))
```

### Pattern Recognition Examples

The tool recognizes these dynamic constructions:

```typescript
// 1. Variable interpolation
const message = this.translate.get(`errors.${errorType}`);

// 2. Property access
const label = this.translate.get(`form.${field.name}.label`);

// 3. Conditional keys
const key = condition ? 'success.message' : 'error.message';
const text = this.translate.get(key);

// 4. Method-generated keys
const actionKey = this.getActionKey(user, action);
const translation = this.translate.get(actionKey);

// 5. Loop-generated keys
items.forEach(item => {
  const itemKey = `items.${item.type}.description`;
  this.translate.get(itemKey);
});
```

## Configuration Options

### Enable/Disable Dynamic Detection

```json
{
  "ignoreDynamicKeys": false,
  "detectDynamicPatterns": true
}
```

### Pattern Sensitivity

```json
{
  "dynamicPatternSensitivity": "medium",
  "dynamicPatternThreshold": 0.7
}
```

Options:
- `"low"` - Only obvious patterns
- `"medium"` - Balanced detection (default)
- `"high"` - Aggressive pattern detection

## Viewing Dynamic Patterns

### Command Line Output

```bash
# Show detected dynamic patterns
ng-i18n-check --output dynamicPatterns

# Show patterns with context
ng-i18n-check --output dynamicPatterns,usedKeys
```

### Sample Output

```
Dynamic Patterns Detected:
  Pattern: errors.${variable}
    Locations: src/services/error.service.ts:45, src/components/form.component.ts:128
    Confidence: 85%
    
  Pattern: user.${status}.message
    Locations: src/components/user-card.component.ts:67
    Confidence: 92%
    
  Pattern: ${module}.${action}.label
    Locations: src/shared/action-button.component.ts:34
    Confidence: 78%
```

## Handling Dynamic Patterns

### 1. Explicit Key Lists

Create explicit translation keys for all possible values:

```json
{
  "errors": {
    "validation": "Validation error",
    "network": "Network error",
    "auth": "Authentication error",
    "permission": "Permission denied"
  }
}
```

### 2. Pattern Documentation

Document dynamic patterns in your configuration:

```json
{
  "dynamicPatterns": [
    {
      "pattern": "errors.${errorType}",
      "description": "Error messages by type",
      "possibleValues": ["validation", "network", "auth", "permission"]
    }
  ]
}
```

### 3. Fallback Strategies

Implement fallback mechanisms in your code:

```typescript
// With fallback
getErrorMessage(errorType: string): string {
  const specificKey = `errors.${errorType}`;
  const fallbackKey = 'errors.generic';
  
  if (this.translate.instant(specificKey) !== specificKey) {
    return this.translate.instant(specificKey);
  }
  return this.translate.instant(fallbackKey);
}
```

## Best Practices

### 1. Minimize Dynamic Keys

Prefer static keys when possible:

```typescript
// Instead of this:
const statusMessage = this.translate.get(`user.${user.status}.message`);

// Consider this:
const statusMessages = {
  active: this.translate.get('user.active.message'),
  inactive: this.translate.get('user.inactive.message'),
  pending: this.translate.get('user.pending.message')
};
const statusMessage = statusMessages[user.status];
```

### 2. Use Enums for Dynamic Parts

```typescript
enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending'
}

// Type-safe dynamic keys
const key = `user.${UserStatus.ACTIVE}.message`;
```

### 3. Validate Dynamic Keys

```typescript
// Validate dynamic keys exist
validateTranslationKey(key: string): boolean {
  return this.translate.instant(key) !== key;
}

// Use with dynamic keys
const dynamicKey = `errors.${errorType}`;
if (this.validateTranslationKey(dynamicKey)) {
  return this.translate.get(dynamicKey);
}
return this.translate.get('errors.generic');
```

### 4. Document Patterns

```typescript
/**
 * Dynamic translation patterns used in this component:
 * - `user.${status}.message` where status: 'active' | 'inactive' | 'pending'
 * - `actions.${actionType}.label` where actionType: 'create' | 'edit' | 'delete'
 */
class UserComponent {
  // Implementation
}
```

## Advanced Pattern Scenarios

### Nested Dynamic Keys

```typescript
// Complex nested patterns
const moduleKey = `modules.${moduleName}`;
const actionKey = `${moduleKey}.actions.${actionType}`;
const labelKey = `${actionKey}.label`;

// Better approach - explicit mapping
const getActionLabel = (module: string, action: string): string => {
  const keyMap = {
    'user-create': 'modules.user.actions.create.label',
    'user-edit': 'modules.user.actions.edit.label',
    'user-delete': 'modules.user.actions.delete.label'
  };
  
  const key = `${module}-${action}`;
  return this.translate.get(keyMap[key] || 'actions.default.label');
};
```

### Conditional Dynamic Patterns

```typescript
// Context-aware dynamic keys
getContextualMessage(context: Context): string {
  const baseKey = 'messages';
  
  if (context.isError) {
    return this.translate.get(`${baseKey}.error.${context.errorType}`);
  }
  
  if (context.isSuccess) {
    return this.translate.get(`${baseKey}.success.${context.action}`);
  }
  
  return this.translate.get(`${baseKey}.info.default`);
}
```

## Testing Dynamic Patterns

### Unit Testing

```typescript
describe('Dynamic Translation Keys', () => {
  it('should handle all possible status values', () => {
    const statuses = ['active', 'inactive', 'pending'];
    
    statuses.forEach(status => {
      const key = `user.${status}.message`;
      const translation = translateService.instant(key);
      
      expect(translation).not.toBe(key); // Key should exist
      expect(translation).toBeTruthy();
    });
  });
});
```

### Integration Testing

```typescript
describe('Error Message Patterns', () => {
  it('should provide translations for all error types', () => {
    const errorTypes = Object.values(ErrorType);
    
    errorTypes.forEach(errorType => {
      const key = `errors.${errorType}`;
      const message = errorService.getErrorMessage(errorType);
      
      expect(message).toBeDefined();
      expect(message).not.toBe(key);
    });
  });
});
```

## Troubleshooting Dynamic Patterns

### Common Issues

1. **Pattern Not Detected**
   - Check if the pattern is too complex
   - Verify variable names are recognizable
   - Ensure pattern follows common conventions

2. **False Positives**
   - Adjust sensitivity settings
   - Add specific ignore patterns
   - Review pattern detection rules

3. **Missing Translations**
   - Document all possible dynamic values
   - Create comprehensive key sets
   - Implement fallback mechanisms

### Debugging Commands

```bash
# Show all detected patterns
ng-i18n-check --output dynamicPatterns

# Show patterns with their usage locations
ng-i18n-check --output dynamicPatterns,usedKeys --format json

# Focus on specific pattern types
ng-i18n-check --output dynamicPatterns --config high-sensitivity.json
```

## Configuration Examples

### Basic Configuration
```json
{
  "ignoreDynamicKeys": false,
  "dynamicPatternSensitivity": "medium"
}
```

### Advanced Configuration
```json
{
  "ignoreDynamicKeys": false,
  "dynamicPatternSensitivity": "high",
  "dynamicPatternThreshold": 0.8,
  "documentedPatterns": [
    {
      "pattern": "errors.${type}",
      "values": ["validation", "network", "auth"]
    },
    {
      "pattern": "user.${status}.message",
      "values": ["active", "inactive", "pending"]
    }
  ]
}
```

### Development vs Production
```json
{
  "development": {
    "ignoreDynamicKeys": false,
    "dynamicPatternSensitivity": "high"
  },
  "production": {
    "ignoreDynamicKeys": true,
    "requireExplicitKeys": true
  }
}
```

Dynamic patterns are powerful but require careful consideration. By understanding how they work and implementing proper strategies, you can maintain translation quality while leveraging the flexibility of dynamic key generation.

Need more help? Check our [examples](/examples/) or [troubleshooting guide](/guide/troubleshooting) for real-world scenarios.
