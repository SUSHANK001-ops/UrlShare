export async function GET() {
  const robots = `User-agent: *
Allow: /
Disallow: /api/*
Disallow: /*.json$
Allow: /sitemap.xml

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# Sitemap location
Sitemap: https://urlshare.sushanka.com.np/sitemap.xml

# Crawl delay
Crawl-delay: 1
Request-rate: 30/60

# Standard crawl-delay for other bots
User-agent: *
Crawl-delay: 2
`;

  return new Response(robots, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
