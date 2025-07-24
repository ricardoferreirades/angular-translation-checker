#!/bin/bash

# Configuration Template Generator
# Generate custom configuration files for different scenarios

generate_config() {
    local scenario="$1"
    local filename="$2"
    
    echo "🔧 Generating: $filename"
    
    case $scenario in
        "development")
            cat > "configs/$filename" << EOF
{
  "localesPath": "./src/assets/i18n",
  "srcPath": "./src",
  "keysExtensions": [".ts", ".html"],
  "excludeDirs": ["node_modules", "dist", ".git", ".angular", "coverage"],
  "outputFormat": "console",
  "exitOnIssues": false,
  "verbose": true,
  "ignoreKeys": ["DEBUG.*", "TEMP.*", "LOCAL.*"],
  "ignorePatterns": ["DEV_*", "TEST_*"],
  "ignoreRegex": ["^EXPERIMENTAL_.*"]
}
EOF
            ;;
        "production")
            cat > "configs/$filename" << EOF
{
  "localesPath": "./src/assets/i18n", 
  "srcPath": "./src",
  "keysExtensions": [".ts", ".html"],
  "excludeDirs": ["node_modules", "dist", ".git", ".angular", "coverage", "debug", "test"],
  "outputFormat": "json",
  "exitOnIssues": true,
  "verbose": false,
  "ignoreKeys": ["DEBUG.*", "TEMP.*", "TEST.*", "DEV.*"],
  "ignorePatterns": ["INTERNAL.*", "DEV_*", "TEST_*"],
  "ignoreRegex": ["^(DEBUG|TEMP|TEST)_.*", ".*_(DEBUG|TEMP|TEST)$"],
  "ignoreFiles": ["debug.json", "temp.json", "test.json"]
}
EOF
            ;;
        "ci-cd")
            cat > "configs/$filename" << EOF
{
  "localesPath": "./src/assets/i18n",
  "srcPath": "./src", 
  "keysExtensions": [".ts", ".html"],
  "excludeDirs": ["node_modules", "dist", ".git", ".angular", "coverage", "debug"],
  "outputFormat": "json",
  "exitOnIssues": true,
  "verbose": false,
  "ignoreKeys": ["DEBUG.*", "TEMP.*"],
  "ignorePatterns": ["INTERNAL.*"],
  "ignoreFiles": ["debug.json"]
}
EOF
            ;;
        "minimal")
            cat > "configs/$filename" << EOF
{
  "localesPath": "./src/assets/i18n",
  "srcPath": "./src"
}
EOF
            ;;
        "comprehensive")
            cat > "configs/$filename" << EOF
{
  "localesPath": "./src/assets/i18n",
  "srcPath": "./src",
  "keysExtensions": [".ts", ".html", ".component.ts", ".service.ts"],
  "excludeDirs": ["node_modules", "dist", ".git", ".angular", "coverage", "debug", "temp"],
  "outputFormat": "json",
  "exitOnIssues": false,
  "verbose": true,
  "ignoreKeys": [
    "DEBUG.*",
    "TEMP.*", 
    "TEST.*",
    "DEV.*",
    "INTERNAL.*",
    "favicon.ico"
  ],
  "ignorePatterns": [
    "INTERNAL.*",
    "DEV_*",
    "TEST_*", 
    "favicon**",
    "*_DEBUG",
    "*_TEMP"
  ],
  "ignoreRegex": [
    "^EXPERIMENTAL_.*",
    ".*_DEPRECATED$",
    "^(DEBUG|TEMP|TEST)_.*",
    ".*_(DEBUG|TEMP|TEST)$"
  ],
  "ignoreFiles": [
    "debug.json",
    "temp.json", 
    "experimental.json",
    "test.json"
  ]
}
EOF
            ;;
    esac
    
    echo "✅ Generated: configs/$filename"
}

echo "🏗️  Configuration Template Generator"
echo "===================================="
echo ""

# Create configs directory if it doesn't exist
mkdir -p configs

# Generate different scenario configurations
generate_config "development" "development.config.json"
generate_config "production" "production.config.json"  
generate_config "ci-cd" "ci-cd.config.json"
generate_config "minimal" "minimal.config.json"
generate_config "comprehensive" "comprehensive.config.json"

echo ""
echo "🎉 All configuration templates generated!"
echo ""
echo "📋 Available Configurations:"
echo "   • development.config.json - Dev environment with debug info"
echo "   • production.config.json - Production-ready strict config"
echo "   • ci-cd.config.json - CI/CD pipeline optimized"
echo "   • minimal.config.json - Bare minimum configuration"
echo "   • comprehensive.config.json - All features enabled"
echo ""
echo "🎯 Usage Examples:"
echo "   ng-i18n-check --config configs/development.config.json"
echo "   ng-i18n-check --config configs/production.config.json"
echo "   ng-i18n-check --config configs/ci-cd.config.json"
echo ""
echo "💡 Customize these templates for your specific needs!"
