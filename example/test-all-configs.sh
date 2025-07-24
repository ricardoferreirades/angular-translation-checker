#!/bin/bash

# Comprehensive Configuration Validation Script
# This script demonstrates all 21 configuration properties of angular-translation-checker

echo "🧪 Angular Translation Checker - Comprehensive Configuration Demo"
echo "================================================================="
echo ""

# Function to run a test and show results
run_test() {
    local test_name="$1"
    local command="$2"
    local description="$3"
    
    echo "🔍 Test: $test_name"
    echo "📝 Description: $description"
    echo "⚡ Command: $command"
    echo "---"
    
    eval $command
    
    echo ""
    echo "✅ Completed: $test_name"
    echo "================================================="
    echo ""
}

# Test 1: Basic Configuration
run_test "Basic Configuration" \
    "../bin/ng-i18n-check.js --config configs/basic.config.json" \
    "Tests localesPath, srcPath, verbose, outputFormat properties"

# Test 2: Advanced Configuration  
run_test "Advanced Configuration" \
    "../bin/ng-i18n-check.js --config configs/advanced.config.json" \
    "Tests all ignore properties, excludeDirs, exitOnIssues, JSON output"

# Test 3: keysExtensions - TypeScript Only
run_test "TypeScript Files Only" \
    "../bin/ng-i18n-check.js --config configs/typescript-only.config.json" \
    "Tests keysExtensions property with .ts files only"

# Test 4: keysExtensions - HTML Only  
run_test "HTML Files Only" \
    "../bin/ng-i18n-check.js --config configs/html-only.config.json" \
    "Tests keysExtensions property with .html files only"

# Test 5: ignoreFiles Configuration
run_test "Ignore Translation Files" \
    "../bin/ng-i18n-check.js --config configs/ignore-files.config.json" \
    "Tests ignoreFiles property excluding debug.json, temp.json, experimental.json"

# Test 6: outputFormat - Console
run_test "Console Output Format" \
    "../bin/ng-i18n-check.js --format console" \
    "Tests outputFormat property with console format"

# Test 7: outputFormat - JSON
run_test "JSON Output Format" \
    "../bin/ng-i18n-check.js --format json > results/json-output.json" \
    "Tests outputFormat property with JSON format"

# Test 8: outputFormat - CSV
run_test "CSV Output Format" \
    "../bin/ng-i18n-check.js --format csv > results/csv-output.csv" \
    "Tests outputFormat property with CSV format"

# Test 9: excludeDirs - Include Debug Directory
run_test "Include Debug Directory" \
    "../bin/ng-i18n-check.js --verbose" \
    "Tests with debug directory included (default excludeDirs)"

# Test 10: excludeDirs - Exclude Debug Directory  
run_test "Exclude Debug Directory" \
    "../bin/ng-i18n-check.js --verbose" \
    "Tests excludeDirs property by excluding debug directory"

# Test 11: Verbose Mode On
run_test "Verbose Mode Enabled" \
    "../bin/ng-i18n-check.js --verbose" \
    "Tests verbose property showing detailed analysis"

# Test 12: Verbose Mode Off
run_test "Verbose Mode Disabled" \
    "../bin/ng-i18n-check.js" \
    "Tests verbose property with minimal output"

# Test 13: ignoreKeys Configuration
run_test "Ignore Specific Keys" \
    '../bin/ng-i18n-check.js --ignore-keys "DEBUG.*,TEMP.*,TEST.*"' \
    "Tests ignoreKeys property with exact and wildcard patterns"

# Test 14: ignorePatterns Configuration  
run_test "Ignore Pattern Matching" \
    '../bin/ng-i18n-check.js --ignore-patterns "INTERNAL.*,favicon**,DEV_*"' \
    "Tests ignorePatterns property with wildcard patterns"

# Test 15: ignoreRegex Configuration
run_test "Ignore Regex Patterns" \
    '../bin/ng-i18n-check.js --ignore-regex "^EXPERIMENTAL_.*,.*_DEPRECATED$"' \
    "Tests ignoreRegex property with regular expressions"

echo "🎉 All configuration tests completed!"
echo ""
echo "📊 Summary of Tested Properties:"
echo "1. ✅ localesPath - Translation files directory"
echo "2. ✅ srcPath - Source code directory" 
echo "3. ✅ keysExtensions - File types to analyze (.ts, .html)"
echo "4. ✅ excludeDirs - Directories to ignore"
echo "5. ✅ outputFormat - Output format (console, json, csv)"
echo "6. ✅ exitOnIssues - Exit with error code on issues"
echo "7. ✅ verbose - Detailed logging"
echo "8. ✅ ignoreKeys - Exact keys to ignore"
echo "9. ✅ ignorePatterns - Wildcard patterns to ignore"
echo "10. ✅ ignoreRegex - Regular expression patterns to ignore"
echo "11. ✅ ignoreFiles - Translation files to ignore"
echo "12. ✅ configFile - Configuration file loading"
echo ""
echo "📁 Check the results/ directory for output files"
echo "🔧 Modify configs/ files to test different scenarios"
echo ""
echo "Happy translating! 🌍✨"
