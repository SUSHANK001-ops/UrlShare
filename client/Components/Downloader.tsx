'use client';

import { Download, X, AlertCircle, CheckCircle, FileText } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { getShareInfo, downloadFileFromShare } from '../services/downloadService'

interface ShareFileInfo {
  id: string;
  originalName: string;
  fileSize: number;
}

interface ShareInfo {
  shortCode: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  downloadCount?: number;
  expiresAt?: string;
  totalSize?: number;
  fileCount?: number;
  files?: ShareFileInfo[];
  error?: string;
}

const Downloader = () => {
  const [input, setInput] = useState('')
  const [shareInfo, setShareInfo] = useState<ShareInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null)
  const [needsPassword, setNeedsPassword] = useState(false)
  const [password, setPassword] = useState('')

  const extractShortCode = (input: string): string => {
    const urlMatch = input.match(/\/d\/([a-z0-9]+)/i)
    if (urlMatch) return urlMatch[1]
    return input.trim()
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1024 / 1024).toFixed(2) + ' MB'
  }

  const handleFetchShare = async () => {
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
    setNeedsPassword(false)
    setShareInfo({ shortCode, status: 'loading' })

    try {
      const response = await getShareInfo(shortCode, password)
      setPassword('')
      setNeedsPassword(false)
      setShareInfo({
        shortCode,
        status: 'success',
        downloadCount: response.downloadCount,
        expiresAt: response.expiresAt,
        totalSize: response.totalSize,
        fileCount: response.fileCount,
        files: response.files,
      })
    } catch (error: any) {
      if (error.response?.status === 401) {
        setNeedsPassword(true)
        setShareInfo(null)
        return
      }
      setShareInfo({
        shortCode,
        status: 'error',
        error: error.response?.data?.error || 'Share not found or has expired',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const triggerDownload = async (file: ShareFileInfo) => {
    if (!shareInfo?.shortCode) return
    setDownloadingFileId(file.id)
    try {
      await downloadFileFromShare(shareInfo.shortCode, file.id, file.originalName, password)
      toast.success(`Downloading ${file.originalName}`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to download file')
    } finally {
      setDownloadingFileId(null)
    }
  }

  const downloadAll = async () => {
    if (!shareInfo?.files) return
    for (const file of shareInfo.files) {
      await triggerDownload(file)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleFetchShare()
  }

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString()

  const clearDownload = () => {
    setShareInfo(null)
    setInput('')
  }

  return (
    <div className='w-full bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-6 sm:p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-2xl sm:text-4xl font-bold text-white mb-6 sm:mb-8 text-center'>Download Files</h1>

        {/* Input Area */}
        <div className='bg-slate-700 rounded-lg p-4 sm:p-8 mb-6 sm:mb-8'>
          <div className='space-y-4'>
            <div>
              <label className='block text-white font-semibold mb-3 text-sm sm:text-base'>Enter Share Code or URL</label>
              <div className='flex flex-col sm:flex-row gap-2'>
                <input
                  type='text'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  placeholder='e.g., abc123ef or share URL'
                  className='flex-1 px-4 py-3 rounded-lg bg-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm'
                />
                <button
                  onClick={handleFetchShare}
                  disabled={isLoading || !input.trim() || (needsPassword && !password.trim())}
                  className='px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap'
                >
                  <Download className='w-5 h-5' />
                    {isLoading ? (needsPassword ? 'Unlocking...' : 'Fetching...') : (needsPassword ? 'Unlock' : 'Fetch Files')}
                </button>
              </div>
              <p className='text-slate-400 text-sm mt-2'>
                Enter the 8-character code from your share link to download files
              </p>
            </div>
          </div>

            {needsPassword && !shareInfo && (
              <div className='bg-slate-600 rounded-lg p-6 sm:p-8 mb-8'>
                <p className='text-white font-semibold text-base sm:text-lg mb-3'>This share is password protected.</p>
                <p className='text-slate-300 text-sm mb-4'>Enter the password to unlock the files.</p>
                <div className='flex flex-col sm:flex-row gap-2'>
                  <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    placeholder='Enter password'
                    className='flex-1 px-4 py-3 rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm'
                  />
                  <button
                    onClick={handleFetchShare}
                    disabled={isLoading || !password.trim()}
                    className='px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-all duration-300'
                  >
                    {isLoading ? 'Unlocking...' : 'Unlock'}
                  </button>
                </div>
              </div>
            )}

            {/* Share Info */}
            {shareInfo && (
            <div className={`mt-8 p-6 rounded-lg ${
              shareInfo.status === 'success' ? 'bg-slate-600' : shareInfo.status === 'error' ? 'bg-red-900/30' : 'bg-slate-600'
            }`}>
              <div className='flex items-start justify-between mb-4'>
                <div className='flex items-start gap-3 flex-1'>
                  {shareInfo.status === 'success' ? (
                    <CheckCircle className='w-6 h-6 text-green-400 mt-1 shrink-0' />
                  ) : shareInfo.status === 'loading' ? (
                    <div className='w-6 h-6 rounded-full border-2 border-blue-400 border-t-transparent animate-spin mt-1 shrink-0'></div>
                  ) : (
                    <AlertCircle className='w-6 h-6 text-red-400 mt-1 shrink-0' />
                  )}
                  <div className='flex-1 min-w-0'>
                    {shareInfo.status === 'loading' && (
                      <p className='text-white font-semibold'>Fetching share...</p>
                    )}
                    {shareInfo.status === 'success' && (
                      <>
                        <p className='text-white font-semibold text-base sm:text-lg mb-1'>
                          {shareInfo.fileCount} File{(shareInfo.fileCount || 0) > 1 ? 's' : ''} Available
                        </p>
                        <div className='flex flex-col sm:flex-row gap-1 sm:gap-4 text-slate-300 text-xs sm:text-sm'>
                          <span>Total: {formatSize(shareInfo.totalSize || 0)}</span>
                          <span>Downloads: {shareInfo.downloadCount}</span>
                          <span>Expires: {formatDate(shareInfo.expiresAt || '')}</span>
                        </div>
                      </>
                    )}
                    {shareInfo.status === 'error' && (
                      <p className='text-red-300 text-sm'>{shareInfo.error}</p>
                    )}
                  </div>
                </div>
                <button onClick={clearDownload} className='text-slate-400 hover:text-slate-300 shrink-0'>
                  <X className='w-6 h-6' />
                </button>
              </div>

              {/* File list with individual download buttons */}
              {shareInfo.status === 'success' && shareInfo.files && (
                <div className='space-y-3'>
                  <div className='space-y-2 max-h-64 overflow-y-auto'>
                    {shareInfo.files.map((file) => (
                      <div key={file.id} className='flex items-center justify-between bg-slate-700 p-3 rounded-lg'>
                        <div className='flex items-center gap-3 flex-1 min-w-0'>
                          <FileText className='w-5 h-5 text-blue-400 shrink-0' />
                          <div className='min-w-0'>
                            <p className='text-white text-sm truncate'>{file.originalName}</p>
                            <p className='text-slate-400 text-xs'>{formatSize(file.fileSize)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => triggerDownload(file)}
                          disabled={downloadingFileId === file.id}
                          className='ml-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm rounded-lg transition-all flex items-center gap-1 whitespace-nowrap'
                        >
                          <Download className='w-4 h-4' />
                          {downloadingFileId === file.id ? '...' : 'Download'}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Download All button if multiple files */}
                  {(shareInfo.files.length > 1) && (
                    <button
                      onClick={downloadAll}
                      disabled={downloadingFileId !== null}
                      className='w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2'
                    >
                      <Download className='w-5 h-5' />
                      Download All Files
                    </button>
                  )}

                  {shareInfo.files.length === 1 && (
                    <button
                      onClick={() => shareInfo.files && triggerDownload(shareInfo.files[0])}
                      disabled={downloadingFileId !== null}
                      className='w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2'
                    >
                      <Download className='w-5 h-5' />
                      {downloadingFileId ? 'Downloading...' : 'Download File'}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className='bg-slate-700 rounded-lg p-4 sm:p-8'>
          <h2 className='text-xl sm:text-2xl font-bold text-white mb-4'>How to Download</h2>
          <div className='space-y-3 text-slate-300'>
            <p className='flex items-start gap-3'>
              <span className='bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-sm font-bold mt-0.5'>1</span>
              <span>Copy the share link you received from the uploader</span>
            </p>
            <p className='flex items-start gap-3'>
              <span className='bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-sm font-bold mt-0.5'>2</span>
              <span>Paste the link or just the 8-character code above</span>
            </p>
            <p className='flex items-start gap-3'>
              <span className='bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-sm font-bold mt-0.5'>3</span>
              <span>Click &quot;Fetch Files&quot; to see all files in the share</span>
            </p>
            <p className='flex items-start gap-3'>
              <span className='bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-sm font-bold mt-0.5'>4</span>
              <span>Download files individually or all at once</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Downloader
