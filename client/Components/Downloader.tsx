'use client';

import { Download, X, AlertCircle, CheckCircle } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { getFileInfo, downloadFileViaBackend } from '../services/downloadService'

interface FileInfo {
  shortCode: string;
  fileName: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  downloadUrl?: string;
  downloadCount?: number;
  expiresAt?: string;
  error?: string;
}

const Downloader = () => {
  const [input, setInput] = useState('')
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const extractShortCode = (input: string): string => {
    // Handle full URL like http://localhost:3000/d/abc123
    const urlMatch = input.match(/\/d\/([a-z0-9]+)/i)
    if (urlMatch) return urlMatch[1]
    
    // Handle just the code
    return input.trim()
  }

  const handleFetchFile = async () => {
    if (!input.trim()) {
      toast.error('Please enter a short code or share URL')
      return
    }

    const shortCode = extractShortCode(input)
    
    if (!shortCode || shortCode.length === 0) {
      toast.error('Invalid short code or URL format')
      return
    }

    setIsLoading(true)
    setFileInfo({
      shortCode,
      fileName: 'File',
      status: 'loading',
    })

    try {
      const response = await getFileInfo(shortCode)
      
      setFileInfo({
        shortCode,
        fileName: response.originalName,
        status: 'success',
        downloadUrl: response.cloudinaryUrl,
        downloadCount: response.downloadCount,
        expiresAt: response.expiresAt,
      })
    } catch (error: any) {
      setFileInfo({
        shortCode,
        fileName: 'File',
        status: 'error',
        error: error.response?.data?.error || 'Failed to fetch file',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const triggerDownload = async () => {
    if (fileInfo?.shortCode && fileInfo?.fileName) {
      setIsDownloading(true)
      try {
        await downloadFileViaBackend(fileInfo.shortCode, fileInfo.fileName)
        toast.success('Download started!')
      } catch (error: any) {
        toast.error(error.message || 'Failed to download file')
      } finally {
        setIsDownloading(false)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFetchFile()
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const clearDownload = () => {
    setFileInfo(null)
    setInput('')
  }

  return (
    <div className='min-h-screen w-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-4xl font-bold text-white mb-8 text-center'>Download Files</h1>

        {/* Input Area */}
        <div className='bg-slate-700 rounded-lg p-8 mb-8'>
          <div className='space-y-4'>
            <div>
              <label className='block text-white font-semibold mb-3'>Enter Share Code or URL</label>
              <div className='flex gap-2'>
                <input
                  type='text'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  placeholder='e.g., abc123ef or http://localhost:3000/d/abc123ef'
                  className='flex-1 px-4 py-3 rounded-lg bg-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
                />
                <button
                  onClick={handleFetchFile}
                  disabled={isLoading || !input.trim()}
                  className='px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 whitespace-nowrap'
                >
                  <Download className='w-5 h-5' />
                  {isLoading ? 'Fetching...' : 'Fetch File'}
                </button>
              </div>
              <p className='text-slate-400 text-sm mt-2'>
                Enter the 8-character code from your share link to download the file
              </p>
            </div>
          </div>

          {/* File Info */}
          {fileInfo && (
            <div className={`mt-8 p-6 rounded-lg ${
              fileInfo.status === 'success' ? 'bg-slate-600' : 'bg-red-900/30'
            }`}>
              <div className='flex items-start justify-between mb-4'>
                <div className='flex items-start gap-3 flex-1'>
                  {fileInfo.status === 'success' ? (
                    <CheckCircle className='w-6 h-6 text-green-400 mt-1 flex-shrink-0' />
                  ) : fileInfo.status === 'loading' ? (
                    <div className='w-6 h-6 rounded-full border-2 border-blue-400 border-t-transparent animate-spin mt-1 flex-shrink-0'></div>
                  ) : (
                    <AlertCircle className='w-6 h-6 text-red-400 mt-1 flex-shrink-0' />
                  )}
                  <div className='flex-1 min-w-0'>
                    <p className='text-white font-semibold'>
                      {fileInfo.status === 'loading' ? 'Fetching file...' : fileInfo.fileName}
                    </p>
                    {fileInfo.status === 'success' && (
                      <div className='mt-3 space-y-2'>
                        <p className='text-slate-300 text-sm'>
                          <span className='font-semibold'>Downloads:</span> {fileInfo.downloadCount}
                        </p>
                        <p className='text-slate-300 text-sm'>
                          <span className='font-semibold'>Expires:</span> {formatDate(fileInfo.expiresAt || '')}
                        </p>
                      </div>
                    )}
                    {fileInfo.status === 'error' && (
                      <p className='text-red-300 text-sm mt-2'>{fileInfo.error}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={clearDownload}
                  className='text-slate-400 hover:text-slate-300 flex-shrink-0'
                >
                  <X className='w-6 h-6' />
                </button>
              </div>

              {fileInfo.status === 'success' && (
                <button
                  onClick={triggerDownload}
                  disabled={isDownloading}
                  className='w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2'
                >
                  <Download className='w-5 h-5' />
                  {isDownloading ? 'Downloading...' : 'Download File'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className='bg-slate-700 rounded-lg p-8'>
          <h2 className='text-2xl font-bold text-white mb-4'>How to Download</h2>
          <div className='space-y-3 text-slate-300'>
            <p className='flex items-start gap-3'>
              <span className='bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5'>1</span>
              <span>Copy the share link you received from the uploader</span>
            </p>
            <p className='flex items-start gap-3'>
              <span className='bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5'>2</span>
              <span>Paste the link or just the 8-character code above</span>
            </p>
            <p className='flex items-start gap-3'>
              <span className='bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5'>3</span>
              <span>Click "Fetch File" to retrieve the file details</span>
            </p>
            <p className='flex items-start gap-3'>
              <span className='bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5'>4</span>
              <span>Click "Download File" to save it to your device</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Downloader
