#!/usr/bin/env python3
"""
JWT Vulnerability Tester
Checks for common JWT issues: weak secret, none algorithm, expiration, etc.
"""

import argparse
import jwt
import time
from jwt.exceptions import InvalidTokenError

def test_jwt(token):
    # 1. Try to decode without verification (to inspect payload)
    try:
        unverified = jwt.decode(token, options={'verify_signature': False})
        print(f'Token payload (unverified): {unverified}')
    except Exception as e:
        print(f'Error decoding token: {e}')
        return

    # 2. Test 'none' algorithm
    try:
        # The 'none' algorithm does not require a secret
        none_token = jwt.decode(token, algorithms=['none'], options={'verify_signature': False})
        print('⚠️  Vulnerability: Token accepts "none" algorithm (signature not verified)!')
        # Reconstruct a token with none algorithm (for education)
        parts = token.split('.')
        if len(parts) == 3:
            header = parts[0]
            payload = parts[1]
            forged_token = header + '.' + payload + '.'
            print(f'Forged token (none alg): {forged_token}')
    except Exception:
        pass

    # 3. Check expiration (exp claim)
    try:
        payload = jwt.decode(token, algorithms=['HS256'], options={'verify_exp': False})
        exp = payload.get('exp')
        if exp:
            current = time.time()
            if current > exp:
                print('❌ Token has expired.')
            else:
                print(f'✅ Token expires at {time.ctime(exp)}')
        else:
            print('⚠️  Token has no expiration claim (exp).')
    except Exception as e:
        print(f'Error checking expiration: {e}')

    # 4. Weak secret test (brute‑force using common secrets)
    # This is a simulation: we try a list of known weak secrets.
    weak_secrets = ['secret', 'password', '123456', 'admin', 'changeme', 'test', 'key', 'jwtsecret']
    print('\nTesting weak secrets...')
    found = False
    for secret in weak_secrets:
        try:
            decoded = jwt.decode(token, secret, algorithms=['HS256'])
            print(f'✅ Token successfully decoded with secret: "{secret}"')
            found = True
            break
        except InvalidTokenError:
            continue
    if not found:
        print('No weak secret found from common list. The secret may be strong or not in our wordlist.')

def main():
    parser = argparse.ArgumentParser(description='Test JWT for common vulnerabilities.')
    parser.add_argument('--token', required=True, help='JWT token to test')
    args = parser.parse_args()
    test_jwt(args.token)

if __name__ == '__main__':
    main()