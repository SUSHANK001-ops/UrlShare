'use client';

import { CloudUpload, X, CheckCircle, AlertCircle, Clock, Copy, Link } from 'lucide-react'
import React, { useState, useRef } from 'react'
import { toast } from 'react-toastify'
import { QRCodeSVG } from 'qrcode.react'
import { uploadFiles } from '../services/uploadService'

interface ShareResult {
  shareUrl: string;
  fileCount: number;
  totalSize: number;
  uploadedFiles: Array<{ fileName: string; size: number }>;
  failedFiles: Array<{ fileName: string; error: string }>;
  expiresAt: string;
}

const Uploder = () => {
  const [files, setFiles] = useState<File[]>([])
  const [shareResult, setShareResult] = useState<ShareResult | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [totalProgress, setTotalProgress] = useState(0)
  const [totalSize, setTotalSize] = useState(0)
  const [deleteTimeHours, setDeleteTimeHours] = useState(0.167) // ~10 minutes default
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const MAX_TOTAL_SIZE = 100 * 1024 * 1024 // 100MB total per share

  const getDeleteTimeLabel = (hours: number) => {
    if (hours === 0.167) return '10 minutes'
    if (hours === 0.5) return '30 minutes'
    if (hours === 1) return '1 hour'
    if (hours === 6) return '6 hours'
    if (hours === 12) return '12 hours'
    if (hours === 24) return '24 hours'
    return `${hours} hours`
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    
    let newTotalSize = totalSize
    const validFiles: File[] = []

    for (const file of selectedFiles) {
      newTotalSize += file.size
      if (newTotalSize > MAX_TOTAL_SIZE) {
        toast.error(`Total size exceeds 100MB limit. Remaining: ${Math.round((MAX_TOTAL_SIZE - totalSize) / 1024 / 1024)}MB`)
        break
      }
      
      validFiles.push(file)
    }

    setFiles([...files, ...validFiles])
    setTotalSize(newTotalSize)
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const uploadFilesHandler = async () => {
    if (files.length === 0) {
      toast.error('Please select files first')
      return
    }

    setIsUploading(true)
    setShareResult(null)

    try {
      const response = await uploadFiles(files, deleteTimeHours, (progressEvent) => {
        const progress = Math.round((progressEvent.loaded / progressEvent.total!) * 100)
        setTotalProgress(progress)
      })

      setShareResult({
        shareUrl: response.shareUrl,
        fileCount: response.fileCount,
        totalSize: response.totalSize,
        uploadedFiles: response.uploadedFiles,
        failedFiles: response.failedFiles,
        expiresAt: response.expiresAt,
      })

      toast.success(`Uploaded ${response.fileCount} file(s)! Share URL is ready.`)

      if (response.failedFiles.length > 0) {
        toast.warning(`${response.failedFiles.length} file(s) failed to upload.`)
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error('Upload failed: ' + (error.response?.data?.error || error.message || 'Unknown error'))
    }

    setFiles([])
    setTotalSize(0)
    setTotalProgress(0)
    setIsUploading(false)
  }

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    let newTotalSize = 0
    updatedFiles.forEach((f) => {
      newTotalSize += f.size
    })
    setFiles(updatedFiles)
    setTotalSize(newTotalSize)
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard!')
  }

  const clearResult = () => {
    setShareResult(null)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1024 / 1024).toFixed(2) + ' MB'
  }

  return (
    <div className='w-full bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-6 sm:p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-2xl sm:text-4xl font-bold text-white mb-6 sm:mb-8 text-center'>File Uploader</h1>

        {/* Upload Area */}
        <div className='bg-slate-700 rounded-lg p-4 sm:p-8 mb-6 sm:mb-8'>
          <div className='flex flex-col items-center justify-center mb-6'>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className='flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 w-28 h-28 sm:w-40 sm:h-40 rounded-full transition-all duration-300 transform hover:scale-105'
            >
              <CloudUpload className='w-10 h-10 sm:w-16 sm:h-16 text-white mb-2' />
              <span className='text-white font-semibold text-center text-sm'>Click to Upload</span>
            </button>
            <input
              ref={fileInputRef}
              type='file'
              multiple
              onChange={handleFileSelect}
              disabled={isUploading}
              className='hidden'
              accept='*/*'
            />
          </div>

          {/* Delete Time Selector */}
          <div className='mb-6 bg-slate-600 p-4 rounded-lg'>
            <label className='flex items-center gap-2 text-white font-semibold mb-3'>
              <Clock className='w-5 h-5' />
              Auto-delete files in:
            </label>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
              {[
                { value: 0.167, label: '10 min' },
                { value: 0.5, label: '30 min' },
                { value: 1, label: '1 hour' },
                { value: 6, label: '6 hours' },
                { value: 12, label: '12 hours' },
                { value: 24, label: '24 hours' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDeleteTimeHours(option.value)}
                  disabled={isUploading}
                  className={`py-2 px-3 rounded transition-all ${
                    deleteTimeHours === option.value
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-500 text-slate-100 hover:bg-slate-400'
                  } disabled:opacity-50`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className='text-slate-300 text-sm mt-3'>
              Selected: <span className='font-semibold text-white'>{getDeleteTimeLabel(deleteTimeHours)}</span>
            </p>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className='mb-6'>
              <h3 className='text-white font-semibold mb-3'>Selected Files ({files.length})</h3>
              <div className='space-y-2 max-h-48 overflow-y-auto'>
                {files.map((file, index) => (
                  <div key={index} className='flex items-center justify-between bg-slate-600 p-3 rounded'>
                    <span className='text-white text-sm truncate'>
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                    </span>
                    <button
                      onClick={() => removeFile(index)}
                      disabled={isUploading}
                      className='text-red-400 hover:text-red-300 disabled:opacity-50'
                    >
                      <X className='w-5 h-5' />
                    </button>
                  </div>
                ))}
              </div>
              <div className='mt-3 text-sm text-slate-300'>
                Total Size: {(totalSize / 1024 / 1024).toFixed(2)}MB / 100MB
              </div>
            </div>
          )}

          {/* Upload Button */}
          {files.length > 0 && (
            <div className='space-y-4'>
              {isUploading && (
                <div>
                  <div className='w-full bg-slate-600 rounded-full h-3 overflow-hidden'>
                    <div
                      className='bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-300'
                      style={{ width: `${totalProgress}%` }}
                    ></div>
                  </div>
                  <p className='text-white text-sm mt-2 text-center'>Uploading... {totalProgress}%</p>
                </div>
              )}
              <button
                onClick={uploadFilesHandler}
                disabled={isUploading}
                className='w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all duration-300'
              >
                {isUploading ? 'Uploading...' : `Upload ${files.length} File${files.length > 1 ? 's' : ''}`}
              </button>
            </div>
          )}
        </div>

        {/* Share Result */}
        {shareResult && (
          <div className='bg-slate-700 rounded-lg p-4 sm:p-8'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-bold text-white flex items-center gap-2'>
                <CheckCircle className='w-7 h-7 text-green-400' />
                Share Ready!
              </h2>
              <button
                onClick={clearResult}
                className='text-slate-400 hover:text-slate-300'
              >
                <X className='w-6 h-6' />
              </button>
            </div>

            {/* Share URL - The main thing */}
            <div className='bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-6 rounded-lg mb-6'>
              <div className='flex items-center gap-2 mb-3'>
                <Link className='w-5 h-5 text-blue-200' />
                <p className='text-blue-200 font-semibold text-sm'>Your Share Link</p>
              </div>
              <div className='flex flex-col sm:flex-row gap-2'>
                <input
                  type='text'
                  readOnly
                  value={shareResult.shareUrl}
                  className='flex-1 px-4 py-3 bg-blue-800/50 text-white rounded-lg focus:outline-none select-all text-xs sm:text-sm font-mono'
                />
                <button
                  onClick={() => copyToClipboard(shareResult.shareUrl)}
                  className='px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap'
                >
                  <Copy className='w-5 h-5' />
                  Copy
                </button>
              </div>
              <p className='text-blue-200 text-xs mt-3'>
                Anyone with this link can download all {shareResult.fileCount} file(s)
              </p>
            </div>

            {/* QR Code */}
            <div className='bg-slate-600 p-4 sm:p-6 rounded-lg mb-6 flex flex-col items-center'>
              <p className='text-white font-semibold mb-4 text-sm sm:text-base'>Scan QR Code to Download</p>
              <div className='bg-white p-3 sm:p-4 rounded-xl'>
                <QRCodeSVG
                  value={shareResult.shareUrl}
                  size={160}
                  level='H'
                  includeMargin={false}
                  className='w-[140px] h-[140px] sm:w-[200px] sm:h-[200px]'
                />
              </div>
              <p className='text-slate-400 text-xs mt-3'>Scan with your phone camera to open the download link</p>
            </div>

            {/* Files in this share */}
            <div className='mb-4'>
              <h3 className='text-white font-semibold mb-3'>
                Uploaded Files ({shareResult.fileCount})
              </h3>
              <div className='space-y-2 max-h-48 overflow-y-auto'>
                {shareResult.uploadedFiles.map((file, index) => (
                  <div key={index} className='flex items-center justify-between bg-slate-600 p-3 rounded'>
                    <div className='flex items-center gap-2'>
                      <CheckCircle className='w-4 h-4 text-green-400 flex-shrink-0' />
                      <span className='text-white text-sm truncate'>{file.fileName}</span>
                    </div>
                    <span className='text-slate-300 text-xs'>{formatSize(file.size)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Failed files */}
            {shareResult.failedFiles.length > 0 && (
              <div className='mb-4'>
                <h3 className='text-red-400 font-semibold mb-3'>
                  Failed ({shareResult.failedFiles.length})
                </h3>
                <div className='space-y-2'>
                  {shareResult.failedFiles.map((file, index) => (
                    <div key={index} className='flex items-center gap-2 bg-red-900/30 p-3 rounded'>
                      <AlertCircle className='w-4 h-4 text-red-400 flex-shrink-0' />
                      <span className='text-red-300 text-sm truncate'>{file.fileName}</span>
                      <span className='text-red-400 text-xs ml-auto'>{file.error}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className='grid grid-cols-2 gap-4 bg-slate-600 p-4 rounded-lg'>
              <div>
                <p className='text-slate-400 text-xs'>Total Size</p>
                <p className='text-white font-semibold'>{formatSize(shareResult.totalSize)}</p>
              </div>
              <div>
                <p className='text-slate-400 text-xs'>Auto-deletes in</p>
                <p className='text-white font-semibold'>{getDeleteTimeLabel(deleteTimeHours)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Uploder