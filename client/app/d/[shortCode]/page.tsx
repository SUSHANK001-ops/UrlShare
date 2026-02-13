'use client';

import { useParams } from 'next/navigation';
import { Download, Copy, CheckCircle, AlertCircle, Clock, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getShareInfo, downloadFileFromShare } from '../../../services/downloadService';

interface ShareFileInfo {
  id: string;
  originalName: string;
  fileSize: number;
}

interface ShareData {
  shortCode: string;
  downloadCount: number;
  expiresAt: string;
  totalSize: number;
  fileCount: number;
  files: ShareFileInfo[];
}

export default function DownloadPage() {
  const params = useParams();
  const shortCode = params.shortCode as string;
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null);

  useEffect(() => {
    const fetchShare = async () => {
      try {
        setIsLoading(true);
        const data = await getShareInfo(shortCode);
        setShareData(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching share:', err);
        setError(err.response?.data?.error || 'Share not found or has expired');
        setShareData(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (shortCode) {
      fetchShare();
    }
  }, [shortCode]);

  const handleDownloadFile = async (file: ShareFileInfo) => {
    setDownloadingFileId(file.id);
    try {
      await downloadFileFromShare(shortCode, file.id, file.originalName);
      toast.success(`Downloading ${file.originalName}`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to start download');
    } finally {
      setDownloadingFileId(null);
    }
  };

  const handleDownloadAll = async () => {
    if (!shareData?.files) return;
    for (const file of shareData.files) {
      await handleDownloadFile(file);
    }
  };

  const handleCopyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
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
            <p className='text-white text-lg font-semibold'>Loading share information...</p>
          </div>
        )}

        {error && (
          <div className='bg-red-900/30 border border-red-600 rounded-lg p-8'>
            <div className='flex items-center gap-4 mb-4'>
              <AlertCircle className='w-12 h-12 text-red-400 shrink-0' />
              <div>
                <h2 className='text-2xl font-bold text-white mb-2'>Share Not Found</h2>
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

        {shareData && !error && (
          <div className='space-y-6'>
            {/* Share Header Card */}
            <div className='bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-8 text-white'>
              <div className='flex items-start gap-4 mb-6'>
                <Download className='w-16 h-16 shrink-0' />
                <div className='flex-1 min-w-0'>
                  <h1 className='text-3xl font-bold mb-2'>
                    {shareData.fileCount} File{shareData.fileCount > 1 ? 's' : ''} Shared
                  </h1>
                  <p className='text-blue-100'>Total size: {formatSize(shareData.totalSize)}</p>
                </div>
              </div>

              {/* Share Stats */}
              <div className='grid grid-cols-2 gap-4 mb-8 bg-blue-500/30 p-4 rounded-lg'>
                <div>
                  <p className='text-blue-100 text-sm'>Downloads</p>
                  <p className='text-2xl font-bold'>{shareData.downloadCount}</p>
                </div>
                <div>
                  <p className='text-blue-100 text-sm mb-1 flex items-center gap-1'>
                    <Clock className='w-4 h-4' />
                    Time Remaining
                  </p>
                  <p className='text-2xl font-bold'>{getRemainingTime(shareData.expiresAt)}</p>
                </div>
              </div>

              {/* Download All Button */}
              <button
                onClick={shareData.fileCount === 1 ? () => handleDownloadFile(shareData.files[0]) : handleDownloadAll}
                disabled={downloadingFileId !== null}
                className='w-full bg-white text-blue-600 hover:bg-blue-50 disabled:opacity-50 font-bold py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-3 text-lg'
              >
                <Download className='w-6 h-6' />
                {downloadingFileId ? 'Downloading...' : shareData.fileCount === 1 ? 'Download File' : 'Download All Files'}
              </button>
            </div>

            {/* Individual Files List */}
            <div className='bg-slate-700 rounded-lg p-6'>
              <h3 className='text-white font-semibold mb-4'>
                Files ({shareData.fileCount})
              </h3>
              <div className='space-y-2 max-h-72 overflow-y-auto'>
                {shareData.files.map((file) => (
                  <div key={file.id} className='flex items-center justify-between bg-slate-600 p-4 rounded-lg'>
                    <div className='flex items-center gap-3 flex-1 min-w-0'>
                      <FileText className='w-5 h-5 text-blue-400 shrink-0' />
                      <div className='min-w-0'>
                        <p className='text-white text-sm truncate'>{file.originalName}</p>
                        <p className='text-slate-400 text-xs'>{formatSize(file.fileSize)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownloadFile(file)}
                      disabled={downloadingFileId === file.id}
                      className='ml-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm rounded-lg transition-all flex items-center gap-1 whitespace-nowrap'
                    >
                      <Download className='w-4 h-4' />
                      {downloadingFileId === file.id ? '...' : 'Download'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Copy Link Card */}
            <div className='bg-slate-700 rounded-lg p-6'>
              <h3 className='text-white font-semibold mb-4'>Share This Link</h3>
              <div className='flex gap-2'>
                <input
                  type='text'
                  value={typeof window !== 'undefined' ? window.location.href : ''}
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
              <h3 className='text-white font-semibold mb-4'>Share Details</h3>
              <div className='space-y-3 text-slate-300'>
                <div className='flex justify-between items-center'>
                  <span>Total Files</span>
                  <span className='font-semibold text-white'>{shareData.fileCount}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span>Total Size</span>
                  <span className='font-semibold text-white'>{formatSize(shareData.totalSize)}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span>Times Downloaded</span>
                  <span className='font-semibold text-white'>{shareData.downloadCount}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span>Expires At</span>
                  <span className='font-semibold text-white text-sm'>{formatDate(shareData.expiresAt)}</span>
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
                &#x26A0;&#xFE0F; These files will be automatically deleted after the expiration time. Make sure to download them before they expire.
              </p>
            </div>

            {/* Back Button */}
            <div className='text-center'>
              <a
                href='/'
                className='text-slate-400 hover:text-slate-300 transition-colors'
              >
                &larr; Back to Home
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
