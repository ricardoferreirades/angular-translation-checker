#!/usr/bin/env node

const fs = require('fs');

// Simple test of the regex patterns
const testContent = `
  private setFields(): void {
    this.fields = Object.entries(this.accessRightTrademakFields).map(([key, value]) => ({
      key: this.translateService.instant(
        \`ACCESS_RIGHTS_CONFIRMATION.INFO.\${toScreamingSnakeCase(key)}\`,
      ),
      value: value
    }));
  }
`;

console.log('🔍 Testing regex patterns on content:');
console.log(testContent);
console.log('\n📝 Testing different regex patterns:');

// Test the current pattern
const tsTemplateRegex = /(?:translate|translateService)\.(get|instant)\(\s*[`]([\w._-]*(?:\$\{[^}]+\}[\w._-]*)*)[`]\s*\)/g;
let match;
console.log('\n1. Current tsTemplateRegex:');
while ((match = tsTemplateRegex.exec(testContent)) !== null) {
  console.log(`   Match found: ${match[0]}`);
  console.log(`   Full pattern: "${match[2]}"`);
  const wildcardPattern = match[2].replace(/\$\{[^}]+\}/g, '*');
  console.log(`   Wildcard pattern: "${wildcardPattern}"`);
}

// Test simpler pattern
const simpleRegex = /translateService\.instant\(\s*`([^`]+)`\s*\)/g;
console.log('\n2. Simple translateService.instant regex:');
while ((match = simpleRegex.exec(testContent)) !== null) {
  console.log(`   Match found: ${match[0]}`);
  console.log(`   Full pattern: "${match[1]}"`);
  const wildcardPattern = match[1].replace(/\$\{[^}]+\}/g, '*');
  console.log(`   Wildcard pattern: "${wildcardPattern}"`);
}

// Test multiline handling
const multilineRegex = /translateService\.instant\(\s*`([^`]+)`/gs;
console.log('\n3. Multiline translateService.instant regex:');
while ((match = multilineRegex.exec(testContent)) !== null) {
  console.log(`   Match found: ${match[0]}`);
  console.log(`   Full pattern: "${match[1]}"`);
  const wildcardPattern = match[1].replace(/\$\{[^}]+\}/g, '*');
  console.log(`   Wildcard pattern: "${wildcardPattern}"`);
}
