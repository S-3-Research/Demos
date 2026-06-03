/**
 * Proxy for SiteCrawler API Gateway.
 * Forwards all /api/site-crawler/* requests to AWS, keeping x-api-key server-side.
 * This avoids CORS issues since the fetch happens server→server, not browser→AWS.
 */

import { NextRequest, NextResponse } from 'next/server'

const API_BASE = 'https://evs5bt2cm7.execute-api.us-west-2.amazonaws.com/v1'
const API_KEY = process.env.SITE_CRAWLER_API_KEY ?? ''

async function handler(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const upstreamPath = path.join('/')

  // Preserve query string
  const { search } = new URL(req.url)
  const upstreamUrl = `${API_BASE}/${upstreamPath}${search}`

  const upstreamHeaders: HeadersInit = {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json',
  }

  const body = req.method !== 'GET' && req.method !== 'HEAD' ? await req.text() : undefined

  const upstream = await fetch(upstreamUrl, {
    method: req.method,
    headers: upstreamHeaders,
    body,
  })

  const text = await upstream.text()
  return new NextResponse(text || null, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json',
    },
  })
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const DELETE = handler
export const OPTIONS = handler
