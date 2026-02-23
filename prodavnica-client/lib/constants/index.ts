// Re-export constants from shared library
export * from '@prodavnica/lib/lib/constants';

// Client-specific constants
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
