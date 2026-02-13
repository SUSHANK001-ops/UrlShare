import apiClient from './api'

interface ShareFileInfo {
  id: string
  originalName: string
  fileSize: number
}

interface ShareDetails {
  id: string
  shortCode: string
  downloadCount: number
  expiresAt: string
  totalSize: number
  fileCount: number
  files: ShareFileInfo[]
}

export const getShareInfo = async (shortCode: string): Promise<ShareDetails> => {
  const response = await apiClient.get<ShareDetails>(`/download/${shortCode}`)
  return response.data
}

export const downloadFileFromShare = async (shortCode: string, fileId: string, fileName: string) => {
  try {
    const response = await apiClient.get(`/download/${shortCode}/file/${fileId}`, {
      responseType: 'blob',
      timeout: 120000, // 2 minutes for large files
    })

    // Create a blob URL and trigger download
    const blobUrl = window.URL.createObjectURL(response.data)
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(blobUrl)
  } catch (error) {
    console.error('Download failed:', error)
    throw new Error('Failed to download file')
  }
}

