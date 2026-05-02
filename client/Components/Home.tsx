"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import Uploder from './Uploder'
import Downloader from './Downloader'
import { Upload, Download, Info } from 'lucide-react'

const Home = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'download'>('upload')

  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-br from-slate-900 to-slate-800'>
      {/* Navigation Tabs */}
      <div className='sticky top-0 z-50 bg-slate-800 border-b border-slate-700'>
        <div className='max-w-4xl mx-auto px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4'>
          <h1 className='font-bold text-white text-sm sm:text-base'>URL Share</h1>
          <div className='flex gap-2'>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                activeTab === 'upload'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Upload className='w-4 h-4 sm:w-5 sm:h-5' />
              Upload
            </button>
            <button
              onClick={() => setActiveTab('download')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                activeTab === 'download'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Download className='w-4 h-4 sm:w-5 sm:h-5' />
              Download
            </button>
            <Link
              href='/about'
              className='flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 rounded-lg font-semibold text-sm sm:text-base bg-slate-700 text-slate-300 hover:bg-slate-600 transition-all'
            >
              <Info className='w-4 h-4 sm:w-5 sm:h-5' />
              <span className='hidden sm:inline'>About</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='flex-1'>
        {activeTab === 'upload' && <Uploder />}
        {activeTab === 'download' && <Downloader />}
      </div>

      {/* Footer */}
      <footer className='bg-slate-800 border-t border-slate-700 py-8'>
        <div className='max-w-4xl mx-auto px-4 sm:px-8'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-8'>
            <div>
              <h3 className='text-white font-semibold mb-3'>About</h3>
              <p className='text-slate-400 text-sm'>
                UrlShare makes file sharing simple, fast, and free for everyone.
              </p>
            </div>
            <div>
              <h3 className='text-white font-semibold mb-3'>Quick Links</h3>
              <ul className='space-y-2 text-sm'>
                <li>
                  <Link
                    href='/'
                    className='text-slate-400 hover:text-blue-400 transition-colors'
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href='/about'
                    className='text-slate-400 hover:text-blue-400 transition-colors'
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='text-white font-semibold mb-3'>Contact</h3>
              <p className='text-slate-400 text-sm'>
                Email:{' '}
                <a
                  href='mailto:mail@sushanka.com.np'
                  className='text-blue-400 hover:text-blue-300 transition-colors'
                >
                  mail@sushanka.com.np
                </a>
              </p>
            </div>
          </div>
          <div className='border-t border-slate-700 pt-8 text-center'>
            <p className='text-slate-400 text-sm'>
              Made by{' '}
              <a
                href='https://sushanka.com.np'
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-400 hover:text-blue-300 font-semibold transition-colors'
              >
                Sushank
              </a>
            </p>
            <p className='text-slate-400 text-sm mt-2'>&copy; 2026 UrlShare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home