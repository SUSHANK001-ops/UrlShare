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
