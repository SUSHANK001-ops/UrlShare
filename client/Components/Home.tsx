"use client"
import React, { useState } from 'react'
import Uploder from './Uploder'
import Downloader from './Downloader'
import { Upload, Download } from 'lucide-react'

const Home = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'download'>('upload')

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 to-slate-800'>
      {/* Navigation Tabs */}
      <div className='sticky top-0 z-50 bg-slate-800 border-b border-slate-700'>
        
        <div className='max-w-4xl mx-auto px-8 py-4 flex items-center justify-between gap-4'>
          <h1 className='font-bold '>URL Share </h1>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'upload'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >

            <Upload className='w-5 h-5' />
            Upload
          </button>
          <button
            onClick={() => setActiveTab('download')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'download'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Download className='w-5 h-5' />
            Download
          </button>
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'upload' && <Uploder />}
        {activeTab === 'download' && <Downloader />}
      </div>
    </div>
  )
}

export default Home