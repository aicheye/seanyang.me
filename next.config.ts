import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  redirects: async () => [
    {
      source: '/resume.pdf',
      destination: '/resume',
      permanent: true,
    },
    {
      source: '/transcript.pdf',
      destination: '/transcript',
      permanent: true,
    },
  ],
}

export default nextConfig
