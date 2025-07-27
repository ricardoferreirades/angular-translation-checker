import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Angular Translation Checker',
  description: 'A comprehensive tool for analyzing translation keys in Angular projects using ngx-translate',
  
  // Clean URLs
  cleanUrls: true,
  
  // Base path for GitHub Pages (will be /angular-translation-checker/)
  base: '/angular-translation-checker/',
  
  // Theme configuration
  themeConfig: {
    // Navigation
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Examples', link: '/examples/' },
      { text: 'API', link: '/api/' },
      { text: 'GitHub', link: 'https://github.com/ricardoferreirades/angular-translation-checker' }
    ],

    // Sidebar navigation
    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' }
          ]
        },
        {
          text: 'Configuration',
          items: [
            { text: 'Basic Configuration', link: '/guide/configuration' },
            { text: 'Output Sections', link: '/guide/output-sections' },
            { text: 'Ignore Patterns', link: '/guide/ignore-patterns' }
          ]
        },
        {
          text: 'Advanced Usage',
          items: [
            { text: 'Dynamic Patterns', link: '/guide/dynamic-patterns' },
            { text: 'CI/CD Integration', link: '/guide/ci-cd' },
            { text: 'Multiple Formats', link: '/guide/output-formats' }
          ]
        },
        {
          text: 'Help & Support',
          items: [
            { text: 'Troubleshooting', link: '/guide/troubleshooting' }
          ]
        }
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Overview', link: '/examples/' },
            { text: 'FlightFinder Demo', link: '/examples/flightfinder' },
            { text: 'Basic Usage', link: '/examples/basic-usage' },
            { text: 'Configuration Examples', link: '/examples/configurations' },
            { text: 'Output Formats', link: '/examples/output-formats' },
            { text: 'CI/CD Integration', link: '/examples/ci-cd' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'CLI Commands', link: '/api/cli' },
            { text: 'Configuration Options', link: '/api/configuration' },
            { text: 'Node.js API', link: '/api/nodejs' }
          ]
        }
      ]
    },

    // Social links
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ricardoferreirades/angular-translation-checker' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/angular-translation-checker' }
    ],

    // Footer
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 Ricardo Ferreira'
    },

    // Search
    search: {
      provider: 'local'
    },

    // Edit link
    editLink: {
      pattern: 'https://github.com/ricardoferreirades/angular-translation-checker/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    // Last updated
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    }
  },

  // Markdown configuration
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true
  }
})
