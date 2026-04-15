import apiClient from './api'

interface UploadedFileInfo {
  fileName: string
  size: number
}

interface UploadResponse {
  shareUrl: string
  shortCode: string
  fileCount: number
  totalSize: number
  uploadedFiles: UploadedFileInfo[]
  failedFiles: Array<{ fileName: string; error: string }>
  expiresAt: string
  message: string
}

export const uploadFiles = async (
  files: File[],
  deleteTimeHours: number = 0.167, // default ~10 minutes
  password: string = '',
  onUploadProgress?: (progressEvent: any) => void
): Promise<UploadResponse> => {
  const formData = new FormData()

  // Append all files
  files.forEach((file) => {
    formData.append('file', file)
  })

  // Convert hours to milliseconds
  const deleteTimeMs = deleteTimeHours * 60 * 60 * 1000
  formData.append('deleteTime', deleteTimeMs.toString())

  if (password.trim()) {
    formData.append('password', password.trim())
  }

  const response = await apiClient.post<UploadResponse>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
    timeout: 120000, // 2 minutes for large uploads
  })
  return response.data
}
