import os from 'os';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const uptimeSeconds = os.uptime();
    const uptimeHours = (uptimeSeconds / 3600).toFixed(2);

    const system = {
      platform: os.platform(),
      arch: os.arch(),
      release: os.release(),
      uptime: `${uptimeHours} hours`,
    };

    return NextResponse.json({
      ok: true,
      version: process.version,
      system,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Healthcheck error:', error);
    return NextResponse.json({ ok: false, error: 'Server Error' }, { status: 500 });
  }
}
