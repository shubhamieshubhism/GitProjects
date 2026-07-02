# # #!/usr/bin/env python3
# # """
# # ZAP Active Scan Script
# # Performs an active scan against a target URL and generates an HTML report.
# # """

# # import argparse
# # import time
# # import json
# # from zapv2 import ZAPv2
# # from requests.exceptions import ConnectionError

# # def main(target, api_key=None):
# #     # ZAP API endpoint (default: localhost:8090)
# #     zap = ZAPv2(apikey=api_key, proxies={'http': 'http://localhost:8090', 'https': 'http://localhost:8090'})

# #     try:
# #         # Access the target to spider it first
# #         print(f'Accessing target {target}')
# #         zap.urlopen(target)
# #         time.sleep(2)

# #         # Spider the target
# #         print('Spidering...')
# #         spider_scan_id = zap.spider.scan(target)
# #         time.sleep(5)
# #         while int(zap.spider.status(spider_scan_id)) < 100:
# #             print(f'Spider progress: {zap.spider.status(spider_scan_id)}%')
# #             time.sleep(5)

# #         print('Spider complete. Starting active scan...')
# #         scan_id = zap.ascan.scan(target)
# #         while int(zap.ascan.status(scan_id)) < 100:
# #             print(f'Active scan progress: {zap.ascan.status(scan_id)}%')
# #             time.sleep(10)

# #         print('Scan complete.')

# #         # Generate report
# #         report = zap.core.htmlreport()
# #         with open('reports/zap_report.html', 'w') as f:
# #             f.write(report)

# #         # Also generate JSON for programmatic use
# #         alerts = zap.core.alerts(baseurl=target)
# #         with open('reports/zap_alerts.json', 'w') as f:
# #             json.dump(alerts, f, indent=2)

# #         print(f'Report saved to reports/zap_report.html and alerts to reports/zap_alerts.json')

# #         # Check for high-risk issues
# #         high_risk = [a for a in alerts if a.get('risk') == 'High']
# #         if high_risk:
# #             print(f'⚠️ Found {len(high_risk)} high-risk vulnerabilities!')
# #             for alert in high_risk:
# #                 print(f'  - {alert["alert"]} at {alert["url"]}')
# #         else:
# #             print('✅ No high-risk issues detected.')

# #     except ConnectionError:
# #         print('Error: Could not connect to ZAP. Is it running and accessible on port 8090?')
# #         print('Try: docker-compose up -d')

# # if __name__ == '__main__':
# #     parser = argparse.ArgumentParser(description='Run ZAP active scan on a target URL.')
# #     parser.add_argument('--target', required=True, help='Target URL to scan (e.g., http://localhost:8080/WebGoat)')
# #     parser.add_argument('--api-key', help='ZAP API key (if set in config)')
# #     args = parser.parse_args()
# #     main(args.target, args.api_key)

# #!/usr/bin/env python3
# """
# ZAP Active Scan Script using raw HTTP requests to ZAP API.
# """

# import argparse
# import time
# import json
# import requests

# ZAP_URL = "http://localhost:8090"
# API_KEY = ""  # set if you enabled an API key

# def zap_request(endpoint, params=None):
#     """Make a GET request to ZAP API and return JSON response."""
#     url = f"{ZAP_URL}/JSON/{endpoint}"
#     if API_KEY:
#         params = params or {}
#         params['apikey'] = API_KEY
#     response = requests.get(url, params=params)
#     response.raise_for_status()
#     return response.json()

# def main(target):
#     # 1. Access the target
#     print(f'Accessing target {target}')
#     zap_request('core/action/accessUrl', {'url': target})
#     time.sleep(2)

#     # 2. Spider the target
#     print('Spidering...')
#     spider_res = zap_request('spider/action/scan', {'url': target})
#     spider_id = spider_res.get('scan')
#     while True:
#         status_res = zap_request('spider/view/status', {'scanId': spider_id})
#         status = int(status_res.get('status', 0))
#         print(f'Spider progress: {status}%')
#         if status >= 100:
#             break
#         time.sleep(5)

#     print('Spider complete. Starting active scan...')
#     scan_res = zap_request('ascan/action/scan', {'url': target})
#     scan_id = scan_res.get('scan')
#     while True:
#         status_res = zap_request('ascan/view/status', {'scanId': scan_id})
#         status = int(status_res.get('status', 0))
#         print(f'Active scan progress: {status}%')
#         if status >= 100:
#             break
#         time.sleep(10)

#     print('Scan complete.')

#     # 3. Generate HTML report
#     html_report = zap_request('core/other/htmlreport')
#     # The htmlreport returns plain HTML, not JSON.
#     # We'll get it via raw request.
#     html_url = f"{ZAP_URL}/OTHER/core/other/htmlreport/"
#     html_response = requests.get(html_url, params={'apikey': API_KEY} if API_KEY else {})
#     with open('reports/zap_report.html', 'w') as f:
#         f.write(html_response.text)

#     # 4. Get alerts in JSON
#     alerts = zap_request('core/view/alerts', {'baseurl': target})
#     with open('reports/zap_alerts.json', 'w') as f:
#         json.dump(alerts, f, indent=2)

#     print('Report saved to reports/zap_report.html and alerts to reports/zap_alerts.json')

#     # 5. Check high-risk issues
#     high_risk = [a for a in alerts.get('alerts', []) if a.get('risk') == 'High']
#     if high_risk:
#         print(f'⚠️ Found {len(high_risk)} high-risk vulnerabilities!')
#         for alert in high_risk:
#             print(f'  - {alert["alert"]} at {alert["url"]}')
#     else:
#         print('✅ No high-risk issues detected.')

# if __name__ == '__main__':
#     parser = argparse.ArgumentParser(description='Run ZAP active scan on a target URL.')
#     parser.add_argument('--target', required=True, help='Target URL to scan')
#     args = parser.parse_args()
#     main(args.target)

#!/usr/bin/env python3
"""
ZAP Active Scan Script using raw HTTP requests to ZAP API.
"""

import argparse
import time
import json
import os
import requests

ZAP_URL = "http://localhost:8090"
API_KEY = ""  # set if you enabled an API key

    # Active scan with timeout
max_polls = 60  # poll 60 times (10 sec each = 10 minutes max)
poll_count = 0

while poll_count < max_polls:
        try:
            status_res = zap_request('ascan/view/status', {'scanId': scan_id})
            status = int(status_res.get('status', 0))
            print(f'Active scan progress: {status}%')
            if status >= 100:
                break
            poll_count += 1
            time.sleep(10)
        except Exception as e:
            print(f'Polling error: {e}')
            # If ZAP is down, try to reconnect or break
            break

    # Even if not 100%, get alerts now
print('Scan stopped. Fetching alerts...')

def zap_request(endpoint, params=None):
    """Make a GET request to ZAP API and return JSON response."""
    url = f"{ZAP_URL}/JSON/{endpoint}"
    if API_KEY:
        params = params or {}
        params['apikey'] = API_KEY
    #response = requests.get(url, params=params)
    response = requests.get(url, params=params, timeout=120)  # 2 minutes timeout
    response.raise_for_status()
    return response.json()

def wait_for_zap(timeout=30):
    """Wait until ZAP API is ready."""
    start = time.time()
    while time.time() - start < timeout:
        try:
            response = requests.get(f"{ZAP_URL}/JSON/core/view/version")
            if response.status_code == 200:
                print("ZAP is ready.")
                return True
        except:
            pass
        time.sleep(2)
    print("ZAP did not become ready within timeout.")
    return False

def main(target):
    if not wait_for_zap():
        print("Exiting.")
        return

    # 1. Access the target
    print(f'Accessing target {target}')
    zap_request('core/action/accessUrl', {'url': target})
    time.sleep(2)

    # 2. Spider the target
    print('Spidering...')
    spider_res = zap_request('spider/action/scan', {'url': target})
    spider_id = spider_res.get('scan')
    while True:
        status_res = zap_request('spider/view/status', {'scanId': spider_id})
        status = int(status_res.get('status', 0))
        print(f'Spider progress: {status}%')
        if status >= 100:
            break
        time.sleep(5)

    print('Spider complete. Starting active scan...')
    scan_res = zap_request('ascan/action/scan', {'url': target})
    scan_id = scan_res.get('scan')
    while True:
        status_res = zap_request('ascan/view/status', {'scanId': scan_id})
        status = int(status_res.get('status', 0))
        print(f'Active scan progress: {status}%')
        if status >= 100:
            break
        time.sleep(10)

    print('Scan complete.')

    # 3. Generate HTML report (this endpoint returns HTML, not JSON)
    print('Generating HTML report...')
    html_url = f"{ZAP_URL}/OTHER/core/other/htmlreport/"
    os.makedirs('reports', exist_ok=True)
    try:
        html_response = requests.get(html_url, params={'apikey': API_KEY} if API_KEY else {})
        html_response.raise_for_status()
        with open('reports/zap_report.html', 'w') as f:
            f.write(html_response.text)
        print('HTML report saved to reports/zap_report.html')
    except Exception as e:
        print(f'Error generating HTML report: {e}')

    # 4. Get alerts in JSON
    try:
        alerts = zap_request('core/view/alerts', {'baseurl': target})
        with open('reports/zap_alerts.json', 'w') as f:
            json.dump(alerts, f, indent=2)
        print('Alerts JSON saved to reports/zap_alerts.json')
    except Exception as e:
        print(f'Error retrieving alerts: {e}')
        alerts = {'alerts': []}

    # 5. Check high-risk issues
    high_risk = [a for a in alerts.get('alerts', []) if a.get('risk') == 'High']
    if high_risk:
        print(f'⚠️ Found {len(high_risk)} high-risk vulnerabilities!')
        for alert in high_risk:
            print(f'  - {alert["alert"]} at {alert["url"]}')
    else:
        print('✅ No high-risk issues detected.')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Run ZAP active scan on a target URL.')
    parser.add_argument('--target', required=True, help='Target URL to scan')
    args = parser.parse_args()
    main(args.target)