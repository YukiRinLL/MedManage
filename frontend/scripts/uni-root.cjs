process.env.UNI_INPUT_DIR = '.'

const { execFileSync } = require('child_process')

// Reuse the configured Vite port instead of silently moving to another port.
if (!process.argv.includes('build') && process.platform === 'win32') {
  try {
    execFileSync('powershell.exe', [
      '-NoProfile',
      '-NonInteractive',
      '-Command',
      "$connections = Get-NetTCPConnection -State Listen -LocalPort 5173 -ErrorAction SilentlyContinue; $connections | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"
    ], { stdio: 'ignore' })
  } catch {
    // No process on the port is a normal first-start condition.
  }
}

require('../node_modules/@dcloudio/vite-plugin-uni/bin/uni.js')
