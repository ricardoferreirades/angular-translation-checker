#!/bin/bash

# Quick Validation Script
# Run this to verify all configuration examples are working

echo "🚀 Angular Translation Checker - Quick Configuration Validation"
echo "============================================================="

# Check if the local ng-i18n-check is available
if [ ! -f "../bin/ng-i18n-check.js" ]; then
    echo "❌ ng-i18n-check.js not found. Please run this script from the example directory."
    echo "   Make sure you're in the example/ folder of angular-translation-checker"
    exit 1
fi

echo "✅ angular-translation-checker found"
echo ""

# Function to run a quick test
quick_test() {
    local config_name="$1"
    local config_file="$2"
    
    echo "🔍 Testing: $config_name"
    echo "📁 Config: $config_file"
    
    if [ -f "$config_file" ]; then
        # Run the analysis and capture output
        if ../bin/ng-i18n-check.js --config "$config_file" > /dev/null 2>&1; then
            echo "✅ PASS: $config_name configuration works correctly"
        else
            echo "❌ FAIL: $config_name configuration has issues" 
        fi
    else
        echo "⚠️  SKIP: $config_file not found"
    fi
    echo ""
}

# Test all configuration files
quick_test "Basic Configuration" "configs/basic.config.json"
quick_test "Advanced Configuration" "configs/advanced.config.json" 
quick_test "TypeScript Only" "configs/typescript-only.config.json"
quick_test "HTML Only" "configs/html-only.config.json"
quick_test "Ignore Files" "configs/ignore-files.config.json"

# Test different output formats
echo "🎨 Testing Output Formats..."
echo ""

echo "📄 Console Format:"
../bin/ng-i18n-check.js --format console --config configs/basic.config.json | head -10
echo ""

echo "📊 JSON Format (first few lines):"
../bin/ng-i18n-check.js --format json --config configs/basic.config.json | head -5
echo ""

echo "📈 CSV Format (header):"
../bin/ng-i18n-check.js --format csv --config configs/basic.config.json | head -3
echo ""

echo "🎉 Configuration validation completed!"
echo ""
echo "💡 Next steps:"
echo "   • Run './test-all-configs.sh' for detailed testing"
echo "   • Check 'results/' directory for output files"
echo "   • Modify configs/ files to test your scenarios"
echo "   • Run 'npm run demo:all-configs' for comprehensive demo"
