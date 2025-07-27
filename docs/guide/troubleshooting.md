# Troubleshooting

Having issues with Angular Translation Checker? This guide covers common problems and their solutions.

## Common Issues

### **No Translation Files Found**

**Problem**: The tool reports that no translation files were found.

**Symptoms**:
```bash
Error: No translation files found in ./src/assets/i18n
```

**Solutions**:
1. Verify the `translationsPath` in your configuration:
   ```json
   {
     "translationsPath": "./src/assets/i18n"
   }
   ```

2. Check that translation files exist and follow naming convention:
   ```
   src/assets/i18n/
   ├── en.json
   ├── es.json
   └── fr.json
   ```

3. Ensure file permissions allow reading:
   ```bash
   ls -la src/assets/i18n/
   ```

---

### **Source Files Not Found**

**Problem**: The tool can't find your source code files.

**Symptoms**:
```bash
Warning: No source files found matching patterns
```

**Solutions**:
1. Check your `srcPath` configuration:
   ```json
   {
     "srcPath": "./src"
   }
   ```

2. Verify file patterns match your project structure:
   ```json
   {
     "patterns": {
       "typescript": ["**/*.ts", "**/*.tsx"],
       "html": ["**/*.html"]
     }
   }
   ```

3. Use absolute paths if relative paths aren't working:
   ```json
   {
     "srcPath": "/full/path/to/your/src"
   }
   ```

---

### **Configuration File Not Found**

**Problem**: Custom configuration file can't be loaded.

**Symptoms**:
```bash
Error: Configuration file not found: ./my-config.json
```

**Solutions**:
1. Verify the file path is correct:
   ```bash
   ls -la ./my-config.json
   ```

2. Use absolute path:
   ```bash
   ng-i18n-check --config /full/path/to/config.json
   ```

3. Check JSON syntax:
   ```bash
   node -e "console.log(JSON.parse(require('fs').readFileSync('./my-config.json', 'utf8')))"
   ```

---

### **False Positives in Unused Keys**

**Problem**: Keys are reported as unused but they are actually used.

**Common Causes**:
- Dynamic key construction
- Keys in external libraries
- Conditional usage patterns

**Solutions**:
1. Add dynamic patterns to ignore list:
   ```json
   {
     "ignoreKeys": [
       "errors.*",
       "dynamic.*",
       "computed.*"
     ]
   }
   ```

2. Enable dynamic key detection:
   ```json
   {
     "ignoreDynamicKeys": true
   }
   ```

3. Use more specific patterns:
   ```json
   {
     "patterns": {
       "typescript": ["src/**/*.ts", "!src/**/*.spec.ts"]
     }
   }
   ```

---

### **Memory Issues with Large Projects**

**Problem**: Tool runs out of memory on large codebases.

**Symptoms**:
```bash
<--- Last few GCs --->
[pid] JavaScript heap out of memory
```

**Solutions**:
1. Increase Node.js memory limit:
   ```bash
   node --max-old-space-size=4096 ./node_modules/.bin/ng-i18n-check
   ```

2. Add more specific file patterns to reduce scope:
   ```json
   {
     "patterns": {
       "typescript": ["src/app/**/*.ts", "!src/app/**/*.spec.ts"],
       "html": ["src/app/**/*.html"]
     }
   }
   ```

3. Process languages separately:
   ```bash
   ng-i18n-check --config config-en.json
   ng-i18n-check --config config-es.json
   ```

---

### **CI/CD Pipeline Failures**

**Problem**: Tool fails in continuous integration environments.

**Common Issues**:
- File permission problems
- Missing dependencies
- Different working directories

**Solutions**:
1. Install dependencies explicitly:
   ```yaml
   # GitHub Actions example
   - name: Install dependencies
     run: npm ci
   
   - name: Check translations
     run: npx ng-i18n-check --exit-on-issues
   ```

2. Use absolute paths in CI configuration:
   ```json
   {
     "srcPath": "${GITHUB_WORKSPACE}/src",
     "translationsPath": "${GITHUB_WORKSPACE}/src/assets/i18n"
   }
   ```

3. Set proper working directory:
   ```yaml
   - name: Check translations
     working-directory: ./my-app
     run: ng-i18n-check
   ```

---

## Performance Issues

### **Slow Analysis**

**Problem**: Tool takes too long to analyze your project.

**Optimization Strategies**:

1. **Limit file patterns**:
   ```json
   {
     "patterns": {
       "typescript": ["src/**/*.component.ts", "src/**/*.service.ts"],
       "html": ["src/**/*.component.html"]
     }
   }
   ```

2. **Exclude unnecessary directories**:
   ```json
   {
     "patterns": {
       "typescript": ["src/**/*.ts", "!src/**/node_modules/**", "!src/**/*.spec.ts"]
     }
   }
   ```

3. **Use specific output sections**:
   ```bash
   ng-i18n-check --output summary,missing
   ```

---

## Configuration Issues

### **JSON Configuration Errors**

**Problem**: Configuration file has syntax errors.

**Validation Steps**:
1. Validate JSON syntax:
   ```bash
   cat config.json | json_pp
   ```

2. Use a JSON linter:
   ```bash
   npm install -g jsonlint
   jsonlint config.json
   ```

3. Common JSON mistakes:
   ```json
   {
     "languages": ["en", "es"], // Error: Trailing comma
     "project": "my-app"
   }
   ```
   
   ```json
   {
     "languages": ["en", "es"],
     "project": "my-app"        // Correct: No trailing comma
   }
   ```

---

### **Pattern Matching Issues**

**Problem**: File patterns don't match expected files.

**Debugging Steps**:
1. Test patterns separately:
   ```bash
   # Test what files match your pattern
   find src -name "*.ts" | head -10
   ```

2. Use more specific patterns:
   ```json
   {
     "patterns": {
       "typescript": [
         "src/app/**/*.ts",
         "src/shared/**/*.ts",
         "!**/*.spec.ts",
         "!**/*.test.ts"
       ]
     }
   }
   ```

3. Enable debug output (if available):
   ```bash
   DEBUG=true ng-i18n-check
   ```

---

## Output Issues

### **Formatting Problems**

**Problem**: Output format is not as expected.

**Solutions**:
1. Specify format explicitly:
   ```bash
   ng-i18n-check --format json
   ng-i18n-check --format csv
   ng-i18n-check --format console
   ```

2. Redirect output to file:
   ```bash
   ng-i18n-check --format json > results.json
   ng-i18n-check --format csv > results.csv
   ```

3. Use specific output sections:
   ```bash
   ng-i18n-check --output summary,missing --format json
   ```

---

## Getting Help

### **When to Seek Support**

If you've tried the solutions above and still have issues:

1. **Check existing issues**: [GitHub Issues](https://github.com/ricardoferreira/angular-translation-checker/issues)

2. **Create a bug report** with:
   - Node.js version: `node --version`
   - Tool version: `ng-i18n-check --version`
   - Configuration file (sanitized)
   - Error messages
   - Steps to reproduce

3. **Provide context**:
   - Project structure
   - Translation file examples
   - Command used
   - Expected vs actual behavior

### **Debug Information**

When reporting issues, include this information:

```bash
# System information
node --version
npm --version
ng-i18n-check --version

# Project structure
tree -I 'node_modules' -L 3

# Configuration
cat your-config.json

# Sample translation file
head -20 src/assets/i18n/en.json
```

### **Community Resources**

- [GitHub Discussions](https://github.com/ricardoferreira/angular-translation-checker/discussions)
- [Stack Overflow Tag](https://stackoverflow.com/questions/tagged/angular-translation-checker)
- [Documentation Examples](/examples/)

---

## Frequently Asked Questions

### **Q: Can I use this with Angular Universal?**
A: Yes, the tool analyzes source code and translation files regardless of the rendering strategy.

### **Q: Does it work with lazy-loaded modules?**
A: Yes, as long as the source files are included in your `srcPath` and patterns.

### **Q: Can I exclude certain components or modules?**
A: Yes, use negative patterns in your configuration:
```json
{
  "patterns": {
    "typescript": ["src/**/*.ts", "!src/legacy/**/*.ts"]
  }
}
```

### **Q: How do I handle translation keys with variables?**
A: Use the `ignoreKeys` pattern matching:
```json
{
  "ignoreKeys": ["messages.user.*", "errors.{userId}.*"]
}
```

Still having issues? Don't hesitate to [open an issue](https://github.com/ricardoferreira/angular-translation-checker/issues/new) on GitHub!
