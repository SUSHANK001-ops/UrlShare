import apiClient from './api'

interface FileDetails {
  id: string
  originalName: string
  cloudinaryUrl: string
  downloadCount: number
  expiresAt: string
  shortCode: string
}

export const getFileInfo = async (shortCode: string): Promise<FileDetails> => {
  const response = await apiClient.get<FileDetails>(`/download/${shortCode}`)
  return response.data
}

export const downloadFileViaBackend = async (shortCode: string, fileName: string) => {
  try {
    const response = await apiClient.get(`/download/${shortCode}/file`, {
      responseType: 'blob'
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

