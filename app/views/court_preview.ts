import type { CourtStatus } from '#services/court_status_service'
import type Court from '#models/court'

const STATUS_LABELS: Record<string, string> = {
  empty: 'Empty',
  moderate: 'Moderate',
  packed: 'Packed',
  unknown: 'No recent data',
}

const STATUS_COLORS: Record<string, string> = {
  empty: '#16a34a',
  moderate: '#ca8a04',
  packed: '#dc2626',
  unknown: '#9ca3af',
}

const STATUS_BG: Record<string, string> = {
  empty: '#f0fdf4',
  moderate: '#fefce8',
  packed: '#fef2f2',
  unknown: '#f9fafb',
}

type CourtPreviewOptions = {
  court: Court
  status: CourtStatus
  appUrl: string
  appScheme: string
  iosBundleId?: string
  iosStoreUrl?: string
  androidStoreUrl?: string
}

export function renderCourtPreview({
  court,
  status,
  appUrl,
  appScheme,
  iosBundleId,
  iosStoreUrl,
  androidStoreUrl,
}: CourtPreviewOptions): string {
  const pageUrl = `${appUrl}/courts/${court.slug}`
  const appDeepLink = `${appScheme}://court/${court.id}`
  const statusLabel = STATUS_LABELS[status.status] ?? 'Unknown'
  const statusColor = STATUS_COLORS[status.status] ?? '#9ca3af'
  const statusBg = STATUS_BG[status.status] ?? '#f9fafb'
  const lastUpdatedText = status.lastUpdatedRelative
    ? `Updated ${status.lastUpdatedRelative}`
    : 'No recent check-ins'
  const checkInText =
    status.checkInCount > 0
      ? ` · ${status.checkInCount} check-in${status.checkInCount !== 1 ? 's' : ''}`
      : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${court.name} — CourtCheck</title>

  <!-- Open Graph / social preview -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:title" content="${court.name} — CourtCheck" />
  <meta property="og:description" content="Court is currently ${statusLabel.toLowerCase()}. ${lastUpdatedText}. Check real-time tennis court availability." />
  <meta property="og:image" content="${court.photoUrl ?? `${appUrl}/og-default.png`}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${court.name} — CourtCheck" />
  <meta name="twitter:description" content="Court is currently ${statusLabel.toLowerCase()}. ${lastUpdatedText}." />

  ${iosBundleId ? `<!-- iOS Smart App Banner -->
  <meta name="apple-itunes-app" content="app-id=${iosBundleId}, app-argument=${appDeepLink}" />` : ''}

  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #f9fafb;
      color: #111827;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .header {
      background: #fff;
      border-bottom: 1px solid #e5e7eb;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .logo { font-size: 22px; }
    .logo-text { font-size: 17px; font-weight: 700; color: #1d4ed8; }
    .container {
      max-width: 480px;
      margin: 0 auto;
      padding: 24px 20px;
      flex: 1;
      width: 100%;
    }
    .hero {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 16px;
      margin-bottom: 16px;
    }
    .card {
      background: #fff;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      margin-bottom: 16px;
    }
    .court-name { font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 6px; }
    .court-address { font-size: 14px; color: #6b7280; margin-bottom: 20px; }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: ${statusBg};
      border-radius: 10px;
      padding: 10px 16px;
      margin-bottom: 10px;
    }
    .status-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: ${statusColor};
      flex-shrink: 0;
    }
    .status-label { font-size: 20px; font-weight: 700; color: ${statusColor}; }
    .status-meta { font-size: 13px; color: #6b7280; margin-top: 6px; }
    .open-btn {
      display: block;
      background: #2563EB;
      color: #fff;
      text-decoration: none;
      text-align: center;
      padding: 16px;
      border-radius: 14px;
      font-size: 17px;
      font-weight: 700;
      margin-bottom: 12px;
    }
    .open-btn:hover { background: #1d4ed8; }
    .store-row { display: flex; gap: 12px; }
    .store-btn {
      flex: 1;
      display: block;
      background: #111827;
      color: #fff;
      text-decoration: none;
      text-align: center;
      padding: 12px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
    }
    .store-btn:hover { background: #374151; }
    .footer { text-align: center; font-size: 12px; color: #9ca3af; padding: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <span class="logo">🎾</span>
    <span class="logo-text">CourtCheck</span>
  </div>

  <div class="container">
    ${court.photoUrl ? `<img class="hero" src="${court.photoUrl}" alt="${court.name}" />` : ''}

    <div class="card">
      <div class="court-name">${court.name}</div>
      ${court.address ? `<div class="court-address">📍 ${court.address}</div>` : ''}
      <div class="status-badge">
        <span class="status-dot"></span>
        <span class="status-label">${statusLabel}</span>
      </div>
      <div class="status-meta">${lastUpdatedText}${checkInText}</div>
    </div>

    <a class="open-btn" href="${appDeepLink}">Open in CourtCheck App</a>

    ${iosStoreUrl || androidStoreUrl ? `
    <div class="store-row">
      ${iosStoreUrl ? `<a class="store-btn" href="${iosStoreUrl}">⬇ App Store</a>` : ''}
      ${androidStoreUrl ? `<a class="store-btn" href="${androidStoreUrl}">⬇ Google Play</a>` : ''}
    </div>` : ''}
  </div>

  <div class="footer">Real-time tennis court availability in Toronto</div>
</body>
</html>`
}
