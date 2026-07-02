# Device Matrix Guide

A device matrix helps you decide which devices to test on, based on market usage, OS version, and screen size. The risk‑based approach prioritises devices that your users actually use.

## Usage
Run the generator:
```bash
npm run matrix
```

You can customise the device list in `utils/device-matrix.js` with real market data.

## Example Output
| Device | OS | Market Share | Risk Score |
|--------|----|--------------|------------|
| iPhone 13 | iOS 15 | 22% | 75 |
| Samsung Galaxy S21 | Android 11 | 18% | 65 |
| Google Pixel 6 | Android 12 | 12% | 55 |

Add new devices and update scores as your user base changes.
