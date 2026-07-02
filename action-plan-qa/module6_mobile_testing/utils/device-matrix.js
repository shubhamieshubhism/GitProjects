const deviceData = [
  { name: 'Google Pixel 6', os: 'Android 12', marketShare: 12, screenSize: 6.4 },
  { name: 'Samsung Galaxy S21', os: 'Android 11', marketShare: 18, screenSize: 6.2 },
  { name: 'OnePlus 9', os: 'Android 11', marketShare: 8, screenSize: 6.55 },
  { name: 'Xiaomi Mi 11', os: 'Android 11', marketShare: 10, screenSize: 6.81 },
  { name: 'iPhone 13', os: 'iOS 15', marketShare: 22, screenSize: 6.1 },
  { name: 'iPhone 12', os: 'iOS 14', marketShare: 15, screenSize: 6.1 },
  { name: 'iPhone SE', os: 'iOS 15', marketShare: 5, screenSize: 4.7 }
];

function calculateRisk(device) {
  let score = 0;
  if (device.marketShare > 15) score += 30;
  else if (device.marketShare > 10) score += 20;
  else score += 10;
  const osVer = parseInt(device.os.split(' ')[1]);
  if (osVer >= 15) score += 25;
  else if (osVer >= 14) score += 15;
  else score += 5;
  if (device.screenSize >= 6.0) score += 20;
  else if (device.screenSize >= 5.0) score += 10;
  else score += 5;
  return score;
}

const sorted = deviceData.map(d => ({
  ...d,
  riskScore: calculateRisk(d)
})).sort((a, b) => b.riskScore - a.riskScore);

console.table(sorted);
