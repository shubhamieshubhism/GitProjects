# OWASP Top 10 Vulnerabilities – Cheatsheet

The OWASP Top 10 is a list of the most critical web application security risks. This document provides a quick reference.

| #  | Risk                               | Description                                                                 | Example |
|----|------------------------------------|-----------------------------------------------------------------------------|---------|
| A01| Broken Access Control              | Improper enforcement of user permissions.                                   | Users accessing admin panels via URL manipulation. |
| A02| Cryptographic Failures             | Weak encryption, plaintext transmission, or missing encryption.             | Using HTTP instead of HTTPS; storing passwords in plaintext. |
| A03| Injection                          | Attackers send untrusted data that gets interpreted as commands (SQL, OS). | `' OR '1'='1` in a login form. |
| A04| Insecure Design                    | Flaws in architectural design that cannot be fixed without redesign.        | Lack of rate limiting on login endpoints. |
| A05| Security Misconfiguration          | Default settings, exposed cloud storage, verbose error messages.            | Leaving default passwords or directory listing enabled. |
| A06| Vulnerable and Outdated Components | Using old libraries with known vulnerabilities.                             | Using jQuery 1.x with XSS vulnerabilities. |
| A07| Identification and Authentication Failures | Weak session management, brute‑force attacks, credential stuffing.    | No account lockout after multiple failed logins. |
| A08| Software and Data Integrity Failures | Using untrusted sources for dependencies or updates.                      | Pulling code from a public repo without verification. |
| A09| Security Logging and Monitoring Failures | Insufficient logging to detect breaches.                                  | No logs of failed login attempts. |
| A10| Server‑Side Request Forgery (SSRF) | Attacker tricks the server into making requests to internal resources.      | Using user‑supplied URL to fetch internal network data. |

**How to detect:** Use ZAP's active scans (it checks for many of these). For JWT, see the dedicated doc.

**Remediation:** Always validate input, use parameterised queries, enforce access control, keep dependencies up‑to‑date, enable logging, and conduct regular security audits.