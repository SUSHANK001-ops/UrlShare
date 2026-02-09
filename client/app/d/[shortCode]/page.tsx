'use client';

import { useParams } from 'next/navigation';
import { Download, Copy, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getFileInfo } from '../../../services/downloadService';

interface FileInfo {
  originalName: string;
  downloadCount: number;
  expiresAt: string;
  cloudinaryUrl: string;
}

export default function DownloadPage() {
  const params = useParams();
  const shortCode = params.shortCode as string;
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        setIsLoading(true);
        const data = await getFileInfo(shortCode);
        setFileInfo(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching file:', err);
        setError(err.response?.data?.error || 'File not found or has expired');
        setFileInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (shortCode) {
      fetchFile();
    }
  }, [shortCode]);

  const handleDownload = async () => {
    if (shortCode && fileInfo) {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const serverBase = apiBase.replace('/api', '');
        const downloadUrl = `${serverBase}/d/download/${shortCode}`;
        
        // Create an anchor element and trigger download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileInfo.originalName || 'download';
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Download error:', error);
        alert('Failed to start download');
      }
    }
  };

  const handleCopyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getRemainingTime = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();

    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className='min-h-screen w-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-8'>
      <div className='max-w-2xl w-full'>
        {isLoading && (
          <div className='bg-slate-700 rounded-lg p-12 text-center'>
            <div className='w-16 h-16 rounded-full border-4 border-blue-400 border-t-transparent animate-spin mx-auto mb-4'></div>
            <p className='text-white text-lg font-semibold'>Loading file information...</p>
          </div>
        )}

        {error && (
          <div className='bg-red-900/30 border border-red-600 rounded-lg p-8'>
            <div className='flex items-center gap-4 mb-4'>
              <AlertCircle className='w-12 h-12 text-red-400 flex-shrink-0' />
              <div>
                <h2 className='text-2xl font-bold text-white mb-2'>File Not Found</h2>
                <p className='text-red-300'>{error}</p>
              </div>
            </div>
            <div className='mt-6'>
              <a
                href='/'
                className='inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all'
              >
                Back to Home
              </a>
            </div>
          </div>
        )}

        {fileInfo && !error && (
          <div className='space-y-6'>
            {/* File Card */}
            <div className='bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-8 text-white'>
              <div className='flex items-start gap-4 mb-6'>
                <Download className='w-16 h-16 flex-shrink-0' />
                <div className='flex-1 min-w-0'>
                  <h1 className='text-3xl font-bold mb-2 break-all'>{fileInfo.originalName}</h1>
                  <p className='text-blue-100'>Ready to download</p>
                </div>
              </div>

              {/* File Stats */}
              <div className='grid grid-cols-2 gap-4 mb-8 bg-blue-500/30 p-4 rounded-lg'>
                <div>
                  <p className='text-blue-100 text-sm'>Downloads</p>
                  <p className='text-2xl font-bold'>{fileInfo.downloadCount}</p>
                </div>
                <div>
                  <p className='text-blue-100 text-sm mb-1 flex items-center gap-1'>
                    <Clock className='w-4 h-4' />
                    Time Remaining
                  </p>
                  <p className='text-2xl font-bold'>{getRemainingTime(fileInfo.expiresAt)}</p>
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                className='w-full bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-3 text-lg'
              >
                <Download className='w-6 h-6' />
                Download File Now
              </button>
            </div>

            {/* Copy Link Card */}
            <div className='bg-slate-700 rounded-lg p-6'>
              <h3 className='text-white font-semibold mb-4'>Share This Link</h3>
              <div className='flex gap-2'>
                <input
                  type='text'
                  value={window.location.href}
                  readOnly
                  className='flex-1 px-4 py-3 bg-slate-600 text-white rounded-lg focus:outline-none select-all text-sm'
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                    copied
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <Copy className='w-5 h-5' />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* File Details Card */}
            <div className='bg-slate-700 rounded-lg p-6'>
              <h3 className='text-white font-semibold mb-4'>File Details</h3>
              <div className='space-y-3 text-slate-300'>
                <div className='flex justify-between items-center'>
                  <span>File Name</span>
                  <span className='font-semibold text-white break-all text-right ml-4'>{fileInfo.originalName}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span>Times Downloaded</span>
                  <span className='font-semibold text-white'>{fileInfo.downloadCount}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span>Expires At</span>
                  <span className='font-semibold text-white text-sm'>{formatDate(fileInfo.expiresAt)}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span>Share Code</span>
                  <span className='font-semibold text-white font-mono'>{shortCode}</span>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className='bg-yellow-900/30 border border-yellow-600 rounded-lg p-4'>
              <p className='text-yellow-200 text-sm'>
                ⚠️ This file will be automatically deleted after the expiration time. Make sure to download it before it expires.
              </p>
            </div>

            {/* Back Button */}
            <div className='text-center'>
              <a
                href='/'
                className='text-slate-400 hover:text-slate-300 transition-colors'
              >
                ← Back to Home
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
