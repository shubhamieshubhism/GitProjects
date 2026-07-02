# JWT Vulnerabilities and Testing

JSON Web Tokens (JWT) are commonly used for authentication and session management. However, they can be vulnerable to several attacks.

## Common JWT Vulnerabilities

1. **Weak Secret** – If the signing secret is easy to guess, an attacker can forge tokens.
2. **None Algorithm** – Some libraries accept `alg: "none"`, which disables signature verification.
3. **No Expiration** – Tokens that never expire can be replayed indefinitely.
4. **Information Disclosure** – Tokens may contain sensitive data in the payload (e.g., passwords).
5. **Algorithm Confusion** – Using an asymmetric algorithm (like RS256) but verifying with symmetric key.

## How to Test with `jwt_tester.py`

Our script tries to:
- Decode the token without verifying (to inspect payload).
- Check if `none` algorithm is accepted.
- Check for the existence of `exp` (expiration) claim.
- Attempt to decode with a list of weak secrets.

## Example Vulnerable Token
eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTUxNjIzOTAyMn0.


The `alg` is `none`, so the signature is empty. This token can be used to impersonate any user.

## Remediation

- Use strong secrets (at least 256 bits).
- Never accept `none` algorithm.
- Always set an appropriate expiration (`exp`).
- Validate the token's signature with the correct algorithm.
- Keep token payload minimal (avoid storing PII).