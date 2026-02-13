"use client"
import React, { useState } from 'react'
import Uploder from './Uploder'
import Downloader from './Downloader'
import { Upload, Download } from 'lucide-react'

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
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='flex-1'>
        {activeTab === 'upload' && <Uploder />}
        {activeTab === 'download' && <Downloader />}
      </div>

      {/* Footer */}
      <footer className='bg-slate-800 border-t border-slate-700 py-4 text-center'>
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
      </footer>
    </div>
  )
}

export default Home