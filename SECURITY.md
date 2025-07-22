# Security Policy

## Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please follow these steps:

1. **Do not open a public issue** for security vulnerabilities
2. Send an email to [security@yourdomain.com] with:
   - Description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact assessment
   - Suggested fix (if available)

3. We will acknowledge receipt within 48 hours
4. We will provide an initial assessment within 7 days
5. We will work on a fix and coordinate disclosure

## Security Considerations

This tool:
- Does not send any data to external servers
- Only reads local files in your project directory
- Does not execute any external commands
- Has zero runtime dependencies to minimize attack surface

## Best Practices

When using this tool:
- Review configuration files before committing
- Use in trusted development environments
- Keep the tool updated to the latest version
- Report any suspicious behavior immediately
