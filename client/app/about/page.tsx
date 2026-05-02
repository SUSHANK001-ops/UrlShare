import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About UrlShare - Simple File Sharing Platform | UrlShare",
  description:
    "Learn about UrlShare, the fastest and easiest way to share files instantly with just a URL. No sign-ups, no hassles, just simple file sharing. Share up to 100MB files with auto-expiry.",
  keywords: [
    "about urlshare",
    "file sharing platform",
    "instant file sharing",
    "url sharing service",
    "secure file transfer",
    "free file sharing",
    "temporary file sharing",
    "urlshare",
  ],
  authors: [{ name: "UrlShare" }],
  openGraph: {
    title: "About UrlShare - Simple File Sharing Platform",
    description:
      "Learn about UrlShare, the fastest and easiest way to share files instantly with just a URL.",
    type: "website",
    url: "https://urlshare.sushanka.com.np/about",
    images: [
      {
        url: "https://urlshare.sushanka.com.np/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About UrlShare - Simple File Sharing Platform",
    description: "The fastest way to share files instantly with just a URL",
  },
  canonical: "https://urlshare.sushanka.com.np/about",
};

export default function About() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "UrlShare",
    url: "https://urlshare.sushanka.com.np",
    logo: "https://urlshare.sushanka.com.np/logo.png",
    description:
      "UrlShare is a simple, fast, and secure file sharing platform that allows users to share files instantly with just a URL.",
    sameAs: [
      "https://github.com/yourgithub",
      "https://twitter.com/yourtwitterhandle",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "support@urlshare.sushanka.com.np",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        {/* Breadcrumb Navigation */}
        <nav className="max-w-4xl mx-auto px-4 py-6 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hover:text-blue-400 transition-colors"
            >
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-300">About</span>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
              About <span className="text-blue-400">UrlShare</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              The simplest way to share files instantly with just a URL—no
              sign-ups, no complications, just effortless sharing.
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-12">
            {/* What is UrlShare */}
            <article className="bg-slate-800 rounded-lg p-8 border border-slate-700">
              <h2 className="text-3xl font-bold mb-4 text-white">
                What is UrlShare?
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                UrlShare is a modern file-sharing platform designed with
                simplicity and efficiency in mind. Whether you need to share a
                document, image, video, or any other file, UrlShare makes it
                incredibly easy. Simply upload your files, grab the generated
                link or QR code, and share it with anyone—instantly.
              </p>
              <p className="text-slate-300 leading-relaxed">
                Our mission is to eliminate the friction from file sharing. No
                complex registration, no subscription fees, no unnecessary
                features—just a clean, fast, and reliable service.
              </p>
            </article>

            {/* Why UrlShare */}
            <article className="bg-slate-800 rounded-lg p-8 border border-slate-700">
              <h2 className="text-3xl font-bold mb-6 text-white">
                Why Choose UrlShare?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-blue-400">
                    ⚡ Lightning Fast
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    Upload and share in seconds. Get your link instantly—no
                    waiting, no complications.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-blue-400">
                    🔒 Secure & Private
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    Your files are secured in the cloud and automatically deleted
                    after expiration.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-blue-400">
                    📱 Mobile Friendly
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    Fully responsive design works flawlessly on desktop, tablet,
                    and mobile devices.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-blue-400">
                    🎯 QR Code Ready
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    Every share comes with a QR code for easy scanning and
                    sharing.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-blue-400">
                    ✨ Zero Sign-up
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    No account needed. Start sharing immediately without any
                    registration.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-blue-400">
                    🗑️ Auto-Delete
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    Choose when your files expire—from 10 minutes to 24 hours.
                  </p>
                </div>
              </div>
            </article>

            {/* Key Features */}
            <article className="bg-slate-800 rounded-lg p-8 border border-slate-700">
              <h2 className="text-3xl font-bold mb-6 text-white">
                Key Features
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <span className="text-blue-400 text-xl flex-shrink-0">✓</span>
                  <div>
                    <h4 className="font-semibold text-white mb-1">
                      Multi-file Upload
                    </h4>
                    <p className="text-slate-300 text-sm">
                      Upload multiple files simultaneously, up to 100 MB per share.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-blue-400 text-xl flex-shrink-0">✓</span>
                  <div>
                    <h4 className="font-semibold text-white mb-1">
                      Short Share Links
                    </h4>
                    <p className="text-slate-300 text-sm">
                      Get an 8-character short code for easy and memorable sharing.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-blue-400 text-xl flex-shrink-0">✓</span>
                  <div>
                    <h4 className="font-semibold text-white mb-1">
                      QR Code Generation
                    </h4>
                    <p className="text-slate-300 text-sm">
                      Scannable QR codes generated automatically for every share.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-blue-400 text-xl flex-shrink-0">✓</span>
                  <div>
                    <h4 className="font-semibold text-white mb-1">
                      Flexible Expiry Options
                    </h4>
                    <p className="text-slate-300 text-sm">
                      Set auto-delete: 10 min, 30 min, 1 hour, 6 hours, 12 hours,
                      or 24 hours.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-blue-400 text-xl flex-shrink-0">✓</span>
                  <div>
                    <h4 className="font-semibold text-white mb-1">
                      Direct Download Page
                    </h4>
                    <p className="text-slate-300 text-sm">
                      Recipients can view all files and download individually or together.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-blue-400 text-xl flex-shrink-0">✓</span>
                  <div>
                    <h4 className="font-semibold text-white mb-1">
                      One-Click Copy
                    </h4>
                    <p className="text-slate-300 text-sm">
                      Instantly copy your share link to clipboard with a single click.
                    </p>
                  </div>
                </li>
              </ul>
            </article>

            {/* How It Works */}
            <article className="bg-slate-800 rounded-lg p-8 border border-slate-700">
              <h2 className="text-3xl font-bold mb-6 text-white">
                How UrlShare Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-400 text-slate-900 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    1
                  </div>
                  <h3 className="font-semibold text-white mb-2">Upload Files</h3>
                  <p className="text-slate-300 text-sm">
                    Select and upload your files. Multiple files are supported.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-400 text-slate-900 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    2
                  </div>
                  <h3 className="font-semibold text-white mb-2">Get Your Link</h3>
                  <p className="text-slate-300 text-sm">
                    Receive a short URL and QR code instantly.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-400 text-slate-900 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    3
                  </div>
                  <h3 className="font-semibold text-white mb-2">Share & Done</h3>
                  <p className="text-slate-300 text-sm">
                    Share the link. Files auto-delete after your chosen time.
                  </p>
                </div>
              </div>
            </article>

            {/* Tech Stack */}
            <article className="bg-slate-800 rounded-lg p-8 border border-slate-700">
              <h2 className="text-3xl font-bold mb-6 text-white">
                Built With Modern Technology
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-blue-400 mb-3">
                    Frontend
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Next.js 16, React 19, TypeScript, Tailwind CSS 4 for a
                    fast, responsive, and modern user interface.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-400 mb-3">
                    Backend
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Express 5 and Node.js for reliable, high-performance server
                    operations.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-400 mb-3">
                    Database
                  </h3>
                  <p className="text-slate-300 text-sm">
                    PostgreSQL with Sequelize ORM for secure and scalable data
                    management.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-400 mb-3">
                    Storage
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Cloudinary for reliable cloud-based file storage and
                    management.
                  </p>
                </div>
              </div>
            </article>

            {/* FAQ */}
            <article className="bg-slate-800 rounded-lg p-8 border border-slate-700">
              <h2 className="text-3xl font-bold mb-6 text-white">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-white mb-2">
                    Is UrlShare completely free?
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Yes! UrlShare is completely free. No hidden charges, no
                    premium plans—just free file sharing for everyone.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">
                    Do I need to create an account?
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    No sign-up required. Start sharing immediately without any
                    registration or login.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">
                    What's the maximum file size?
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    You can upload up to 100 MB per share. Multiple files are
                    supported as long as the total doesn't exceed the limit.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">
                    How long are files kept?
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    You choose! Pick from 10 minutes to 24 hours. Files are
                    automatically deleted after expiration.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">
                    Is my data secure?
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Yes. Files are stored securely in the cloud, and automatic
                    deletion ensures your data is never kept longer than needed.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">
                    Can I track downloads?
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    UrlShare focuses on simplicity. Once you share, recipients
                    can download freely without tracking.
                  </p>
                </div>
              </div>
            </article>

            {/* CTA */}
            <article className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Share Files Instantly?
              </h2>
              <p className="text-blue-100 mb-6">
                Start sharing now—no sign-up required. It's fast, free, and
                easy.
              </p>
              <Link
                href="/"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Go to UrlShare
              </Link>
            </article>
          </div>
        </section>

        {/* Footer Info */}
        <footer className="max-w-4xl mx-auto px-4 py-16 border-t border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-3">About</h3>
              <p className="text-slate-400 text-sm">
                UrlShare makes file sharing simple, fast, and free for everyone.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/"
                    className="text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Contact</h3>
              <p className="text-slate-400 text-sm">
                Questions? Reach out to us anytime.
              </p>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center">
            <p className="text-slate-400 text-sm">
              Made by{' '}
              <a
                href="https://sushanka.com.np"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                Sushank
              </a>
            </p>
            <p className="text-slate-400 text-sm mt-2">
              Email:{' '}
              <a
                href="mailto:mail@sushanka.com.np"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                mail@sushanka.com.np
              </a>
            </p>
            <p className="text-slate-400 text-sm mt-2">&copy; 2026 UrlShare. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </>
  );
}
