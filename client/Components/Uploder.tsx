'use client';

import { CloudUpload, X, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import React, { useState, useRef } from 'react'
import { toast } from 'react-toastify'
import { uploadFiles } from '../services/uploadService'

interface UploadedFile {
  name: string;
  shareUrl: string;
  status: 'uploading' | 'completed' | 'failed';
  progress: number;
  error?: string;
}

const Uploder = () => {
  const [files, setFiles] = useState<File[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [totalProgress, setTotalProgress] = useState(0)
  const [totalSize, setTotalSize] = useState(0)
  const [deleteTimeHours, setDeleteTimeHours] = useState(0.167) // ~10 minutes default
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const MAX_TOTAL_SIZE = 100 * 1024 * 1024 // 100MB total
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB per file

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
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File "${file.name}" is too large. Max 10MB per file.`)
        continue
      }
      
      newTotalSize += file.size
      if (newTotalSize > MAX_TOTAL_SIZE) {
        toast.error(`Total size exceeds 100MB limit. Remaining quota: ${Math.round((MAX_TOTAL_SIZE - totalSize) / 1024 / 1024)}MB`)
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
    const uploadResults: UploadedFile[] = []

    try {
      const response = await uploadFiles(files, deleteTimeHours, (progressEvent) => {
        const progress = Math.round((progressEvent.loaded / progressEvent.total!) * 100)
        setTotalProgress(progress)
      })

      // Process results from response
      if (response.files) {
        response.files.forEach((file) => {
          if (file.shareUrl) {
            uploadResults.push({
              name: file.fileName,
              shareUrl: file.shareUrl,
              status: 'completed',
              progress: 100,
            })
          } else {
            uploadResults.push({
              name: file.fileName,
              shareUrl: '',
              status: 'failed',
              progress: 0,
              error: file.error || 'Upload failed',
            })
          }
        })
      }

      if (uploadResults.length === 0) {
        toast.error('No files were uploaded')
      } else {
        toast.success(`Successfully uploaded ${uploadResults.filter(r => r.status === 'completed').length} file(s)!`)
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error('Upload failed: ' + (error.response?.data?.error || error.message || 'Unknown error'))
    }

    setUploadedFiles(uploadResults)
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

  const clearCompleted = () => {
    setUploadedFiles([])
  }

  return (
    <div className='min-h-screen w-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-4xl font-bold text-white mb-8 text-center'>File Uploader</h1>

        {/* Upload Area */}
        <div className='bg-slate-700 rounded-lg p-8 mb-8'>
          <div className='flex flex-col items-center justify-center mb-6'>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className='flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 w-40 h-40 rounded-full transition-all duration-300 transform hover:scale-105'
            >
              <CloudUpload className='w-16 h-16 text-white mb-2' />
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

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className='bg-slate-700 rounded-lg p-8'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-bold text-white'>Uploaded Files</h2>
              <button
                onClick={clearCompleted}
                className='text-red-400 hover:text-red-300 text-sm'
              >
                Clear All
              </button>
            </div>

            <div className='space-y-4'>
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    file.status === 'completed' ? 'bg-slate-600' : 'bg-red-900/30'
                  }`}
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex items-start gap-3 flex-1'>
                      {file.status === 'completed' ? (
                        <CheckCircle className='w-6 h-6 text-green-400 mt-1 flex-shrink-0' />
                      ) : (
                        <AlertCircle className='w-6 h-6 text-red-400 mt-1 flex-shrink-0' />
                      )}
                      <div className='flex-1 min-w-0'>
                        <p className='text-white font-semibold truncate'>{file.name}</p>
                        {file.status === 'completed' && (
                          <p className='text-slate-300 text-sm break-all mt-2'>{file.shareUrl}</p>
                        )}
                        {file.status === 'failed' && (
                          <p className='text-red-300 text-sm mt-2'>{file.error}</p>
                        )}
                        {file.status === 'completed' && (
                          <p className='text-slate-400 text-xs mt-2'>Will auto-delete in {getDeleteTimeLabel(deleteTimeHours)}</p>
                        )}
                      </div>
                    </div>
                    {file.status === 'completed' && (
                      <button
                        onClick={() => copyToClipboard(file.shareUrl)}
                        className='ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm whitespace-nowrap'
                      >
                        Copy Link
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Uploder