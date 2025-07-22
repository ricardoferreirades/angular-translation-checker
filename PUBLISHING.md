# Publishing Guide for Angular Translation Checker

## 📦 NPM Package Publishing Steps

### 1. Prerequisites

Before publishing, ensure you have:

- [x] NPM account: [https://www.npmjs.com/signup](https://www.npmjs.com/signup)
- [x] NPM CLI installed: `npm install -g npm`
- [x] Logged into NPM: `npm login`

### 2. Pre-Publishing Checklist

```bash
cd angular-translation-checker

# 1. Verify package.json
cat package.json

# 2. Run tests
npm test

# 3. Test CLI locally
node bin/ng-i18n-check.js --help

# 4. Check package contents
npm pack --dry-run

# 5. Verify files that will be published
npm files
```

### 3. Update Package Information

Edit `package.json`:

```json
{
  "name": "angular-translation-checker",
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/angular-translation-checker.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/angular-translation-checker/issues"
  },
  "homepage": "https://github.com/yourusername/angular-translation-checker#readme"
}
```

### 4. Version Management

```bash
# For patches (bug fixes)
npm version patch

# For minor changes (new features)
npm version minor

# For major changes (breaking changes)
npm version major
```

### 5. Publishing Commands

```bash
# Test publish (dry run)
npm publish --dry-run

# Publish to NPM
npm publish

# Publish beta version
npm publish --tag beta
```

### 6. Post-Publishing Steps

```bash
# Verify publication
npm view angular-translation-checker

# Test global installation
npm install -g angular-translation-checker
ng-i18n-check --version

# Test in a sample project
cd /path/to/test/project
ng-i18n-check
```

## 🚀 Alternative Publishing Options

### GitHub Packages

```bash
# Configure for GitHub Packages
npm config set @yourusername:registry https://npm.pkg.github.com
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> ~/.npmrc

# Publish to GitHub Packages
npm publish
```

### Private Registry

```bash
# Configure private registry
npm config set registry https://your-private-registry.com

# Publish to private registry
npm publish
```

## 📋 Maintenance Checklist

### Regular Maintenance

- [ ] Update dependencies regularly
- [ ] Monitor for security vulnerabilities
- [ ] Update documentation
- [ ] Respond to issues and pull requests
- [ ] Maintain changelog

### Version Release Process

1. Update `CHANGELOG.md`
2. Run tests: `npm test`
3. Update version: `npm version [patch|minor|major]`
4. Publish: `npm publish`
5. Create GitHub release with tag
6. Update documentation if needed

## 🔧 Local Development Setup

### For Contributors

```bash
# Clone the repository
git clone https://github.com/yourusername/angular-translation-checker.git
cd angular-translation-checker

# Install dependencies (none for this project)
npm install

# Run tests
npm test

# Test CLI locally
node bin/ng-i18n-check.js --help

# Link for local development
npm link

# Test in another project
cd /path/to/test/project
ng-i18n-check
```

### Testing Changes

```bash
# Create test package
npm pack

# Install in test project
cd /path/to/test/project
npm install /path/to/angular-translation-checker-1.0.0.tgz

# Test functionality
npx ng-i18n-check
```

## 📊 Package Metrics

After publishing, monitor:

- Download statistics: [https://npm-stat.com/charts.html?package=angular-translation-checker](https://npm-stat.com/charts.html?package=angular-translation-checker)
- GitHub stars and issues
- User feedback and feature requests

## 🔒 Security Best Practices

### Before Publishing

- [ ] No sensitive information in code
- [ ] All dependencies are trusted
- [ ] Code review completed
- [ ] Security audit: `npm audit`

### Package Security

- [ ] Use `npm publish --access public` explicitly
- [ ] Enable 2FA on NPM account
- [ ] Use scoped packages if needed: `@yourorg/angular-translation-checker`
- [ ] Monitor security advisories

## 📝 Documentation Updates

After publishing:

- [ ] Update main project README with installation instructions
- [ ] Create usage examples
- [ ] Update any tutorial or blog posts
- [ ] Announce on relevant platforms (Twitter, Reddit, etc.)

## 🎯 Success Metrics

Track these metrics after publishing:

- Weekly downloads
- GitHub stars/forks
- Issues reported vs resolved
- Community contributions
- User feedback and testimonials

## 🔗 Useful Commands

```bash
# Check package info
npm view angular-translation-checker

# Check download stats
npm view angular-translation-checker --json

# List all versions
npm view angular-translation-checker versions --json

# Deprecate a version
npm deprecate angular-translation-checker@1.0.0 "Please use version 1.0.1"

# Unpublish (only within 72 hours)
npm unpublish angular-translation-checker@1.0.0
```

Remember: Once published to NPM, packages are public and permanent. Always test thoroughly before publishing!
