# #!/usr/bin/env python3
# """
# Security Scanning Workflow
# Given a list of URLs, runs ZAP scans on each and produces a consolidated report.
# """

# import argparse
# import subprocess
# import json
# import time
# import os
# from datetime import datetime

# def run_scan(target):
#     print(f'Scanning {target}...')
#     # Reuse the zap_scan script, but we'll capture its JSON output.
#     # We'll use the ZAP API directly for a more integrated approach.
#     # For simplicity, we'll call the zap_scan.py script and read the JSON.
#     import sys
#     from zapv2 import ZAPv2
#     zap = ZAPv2(proxies={'http': 'http://localhost:8090', 'https': 'http://localhost:8090'})
#     # We'll do a minimal scan: spider + active scan
#     try:
#         zap.urlopen(target)
#         time.sleep(2)
#         spider_scan_id = zap.spider.scan(target)
#         while int(zap.spider.status(spider_scan_id)) < 100:
#             time.sleep(5)
#         scan_id = zap.ascan.scan(target)
#         while int(zap.ascan.status(scan_id)) < 100:
#             time.sleep(10)
#         alerts = zap.core.alerts(baseurl=target)
#         return alerts
#     except Exception as e:
#         print(f'Error scanning {target}: {e}')
#         return []

# def consolidate(alerts_per_target):
#     summary = {
#         'timestamp': datetime.now().isoformat(),
#         'total_targets': len(alerts_per_target),
#         'findings': {}
#     }
#     total_high = 0
#     for target, alerts in alerts_per_target.items():
#         high = [a for a in alerts if a.get('risk') == 'High']
#         medium = [a for a in alerts if a.get('risk') == 'Medium']
#         low = [a for a in alerts if a.get('risk') == 'Low']
#         total_high += len(high)
#         summary['findings'][target] = {
#             'high': len(high),
#             'medium': len(medium),
#             'low': len(low),
#             'alerts': alerts
#         }
#     summary['total_high'] = total_high
#     return summary

# def main():
#     parser = argparse.ArgumentParser(description='Scan multiple URLs with ZAP.')
#     parser.add_argument('--urls', nargs='+', required=True, help='List of URLs to scan')
#     parser.add_argument('--output', default='reports/workflow_summary.json', help='Output JSON file')
#     args = parser.parse_args()

#     os.makedirs('reports', exist_ok=True)

#     results = {}
#     for url in args.urls:
#         results[url] = run_scan(url)

#     summary = consolidate(results)
#     with open(args.output, 'w') as f:
#         json.dump(summary, f, indent=2)

#     print(f'Scan complete. Summary saved to {args.output}')
#     if summary['total_high'] > 0:
#         print(f'⚠️  Found {summary["total_high"]} high-risk findings across all targets.')
#     else:
#         print('✅ No high-risk issues found.')

# if __name__ == '__main__':
#     main()

#!/usr/bin/env python3
"""
Security Scanning Workflow – scans multiple URLs and consolidates results.
"""

import argparse
import json
import time
import os
from datetime import datetime
import requests

ZAP_URL = "http://localhost:8090"
API_KEY = ""

def zap_request(endpoint, params=None):
    url = f"{ZAP_URL}/JSON/{endpoint}"
    if API_KEY:
        params = params or {}
        params['apikey'] = API_KEY
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()

def scan_target(target):
    print(f'Scanning {target}...')
    try:
        # Access
        zap_request('core/action/accessUrl', {'url': target})
        time.sleep(2)
        # Spider
        spider_res = zap_request('spider/action/scan', {'url': target})
        spider_id = spider_res.get('scan')
        while True:
            status = int(zap_request('spider/view/status', {'scanId': spider_id}).get('status', 0))
            if status >= 100:
                break
            time.sleep(5)
        # Active scan
        scan_res = zap_request('ascan/action/scan', {'url': target})
        scan_id = scan_res.get('scan')
        while True:
            status = int(zap_request('ascan/view/status', {'scanId': scan_id}).get('status', 0))
            if status >= 100:
                break
            time.sleep(10)
        # Get alerts
        alerts = zap_request('core/view/alerts', {'baseurl': target})
        return alerts.get('alerts', [])
    except Exception as e:
        print(f'Error scanning {target}: {e}')
        return []

def consolidate(alerts_per_target):
    summary = {
        'timestamp': datetime.now().isoformat(),
        'total_targets': len(alerts_per_target),
        'findings': {}
    }
    total_high = 0
    for target, alerts in alerts_per_target.items():
        high = [a for a in alerts if a.get('risk') == 'High']
        medium = [a for a in alerts if a.get('risk') == 'Medium']
        low = [a for a in alerts if a.get('risk') == 'Low']
        total_high += len(high)
        summary['findings'][target] = {
            'high': len(high),
            'medium': len(medium),
            'low': len(low),
            'alerts': alerts
        }
    summary['total_high'] = total_high
    return summary

def main():
    parser = argparse.ArgumentParser(description='Scan multiple URLs with ZAP.')
    parser.add_argument('--urls', nargs='+', required=True, help='List of URLs to scan')
    parser.add_argument('--output', default='reports/workflow_summary.json', help='Output JSON file')
    args = parser.parse_args()

    os.makedirs('reports', exist_ok=True)

    results = {}
    for url in args.urls:
        results[url] = scan_target(url)

    summary = consolidate(results)
    with open(args.output, 'w') as f:
        json.dump(summary, f, indent=2)

    print(f'Scan complete. Summary saved to {args.output}')
    if summary['total_high'] > 0:
        print(f'⚠️ Found {summary["total_high"]} high-risk findings across all targets.')
    else:
        print('✅ No high-risk issues found.')

if __name__ == '__main__':
    main()