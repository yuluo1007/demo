import { Html, Head, Main, NextScript } from 'next/document';
import type { LinkHTMLAttributes } from 'react';

const FONT_AWESOME_HREF =
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';

const preloadStyleProps = {
  rel: 'preload',
  as: 'style',
  href: FONT_AWESOME_HREF,
  onLoad: "this.onload=null;this.rel='stylesheet'",
} as unknown as LinkHTMLAttributes<HTMLLinkElement>;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="AgentScope - A Multi-Agent Platform for Everyone" />
        <meta name="keywords" content="AgentScope, multi-agent, AI, LLM, framework" />
        <link rel="icon" href="/favicon.ico" />

        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />

        <link {...preloadStyleProps} />
        <noscript>
          <link rel="stylesheet" href={FONT_AWESOME_HREF} />
        </noscript>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
