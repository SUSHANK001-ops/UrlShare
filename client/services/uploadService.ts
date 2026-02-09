import apiClient from './api'

interface UploadResponse {
  files: Array<{
    fileName: string
    shareUrl?: string
    fileId?: string
    error?: string
    status?: string
  }>
  message: string
}

export const uploadFiles = async (
  files: File[],
  deleteTimeHours: number = 0.167, // default ~10 minutes
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

  try {
    const response = await apiClient.post<UploadResponse>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    })
    return response.data
  } catch (error: any) {
    // If the response contains files data, return it even if status is error
    if (error.response?.data?.files) {
      return error.response.data
    }
    // Otherwise re-throw the error
    throw error
  }
}

