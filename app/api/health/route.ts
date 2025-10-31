import { NextResponse } from 'next/server';

/**
 * Health check endpoint for Kubernetes liveness and readiness probes
 *
 * GET /api/health
 * Returns 200 OK if the application is healthy
 */
export async function GET() {
  try {
    // Basic health check - you can add more sophisticated checks here
    // For example: database connectivity, external service availability, etc.

    const healthCheck = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
    };

    return NextResponse.json(healthCheck, { status: 200 });
  } catch (error) {
    // If any error occurs, return unhealthy status
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
