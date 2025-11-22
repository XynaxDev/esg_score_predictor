import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Attach JWT if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (import.meta.env.VITE_API_DEBUG === 'true') {
    // eslint-disable-next-line no-console
    console.log('[API] ->', config.method?.toUpperCase(), config.baseURL + config.url)
  }
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (import.meta.env.VITE_API_DEBUG === 'true') {
      // eslint-disable-next-line no-console
      console.error('[API ERROR] <-', error?.config?.url, error?.message, error?.response?.status, error?.response?.data)
    }
    return Promise.reject(error)
  }
)

export const api = {
  // Auth endpoints
  auth: {
    register: async (payload) => {
      const res = await apiClient.post('/api/auth/register', payload)
      return res.data
    },
    login: async (payload) => {
      const res = await apiClient.post('/api/auth/login', payload)
      return res.data
    },
    resendVerification: async (email) => {
      const res = await apiClient.post('/api/auth/resend-verification', { email })
      return res.data
    },
    seedTestUser: async () => {
      const res = await apiClient.post('/api/auth/seed-test-user')
      return res.data
    },
    verifyEmailOtp: async (email, otp) => {
      const res = await apiClient.post('/api/auth/verify-email-otp', { email, otp })
      return res.data
    },
    verifyEmail: async (token) => {
      const res = await apiClient.post('/api/auth/verify-email', { token })
      return res.data
    },
    forgotPassword: async (email) => {
      const res = await apiClient.post('/api/auth/forgot-password', { email })
      return res.data
    },
    verifyOtp: async (email, otp) => {
      const res = await apiClient.post('/api/auth/verify-otp', { email, otp })
      return res.data
    },
    resetPassword: async (reset_token, new_password) => {
      const res = await apiClient.post('/api/auth/reset-password', { reset_token, new_password })
      return res.data
    },
    me: async () => {
      const res = await apiClient.get('/api/auth/me')
      return res.data
    },
    updateMe: async (payload) => {
      const res = await apiClient.put('/api/auth/me', payload)
      return res.data
    },
    changePassword: async (current_password, new_password) => {
      const res = await apiClient.post('/api/auth/change-password', { current_password, new_password })
      return res.data
    },
    uploadAvatar: async (dataUrl) => {
      const res = await apiClient.post('/api/auth/avatar', { data: dataUrl })
      return res.data
    },
    deleteAvatar: async () => {
      const res = await apiClient.delete('/api/auth/avatar')
      return res.data
    },
    deleteAccount: async (password) => {
      const res = await apiClient.delete('/api/auth/account', { data: { password } })
      return res.data
    },
  },
  analytics: {
    exportDataset: async (filters = {}) => {
      const res = await apiClient.post('/api/export', filters)
      return res.data
    },
    listPredictions: async (params = {}) => {
      const res = await apiClient.get('/api/predictions', { params })
      return res.data
    },
    deletePrediction: async (id) => {
      const res = await apiClient.delete(`/api/predictions/${id}`)
      return res.data
    },
    getModelStatus: async () => {
      const res = await apiClient.get('/api/model-status')
      return res.data
    },
    predictBatch: async (data) => {
      const res = await apiClient.post('/api/predict-batch', { data })
      return res.data
    },
    makePrediction: async (inputs) => {
      const res = await apiClient.post('/api/predict', { inputs })
      return res.data
    },
    getPredictionsAnalytics: async () => {
      const res = await apiClient.get('/api/predictions/analytics')
      return res.data
    },
    updatePrediction: async (id, payload) => {
      const res = await apiClient.put(`/api/predictions/${id}`, payload)
      return res.data
    },
    uploadDataset: async ({ filename, data, columns }) => {
      const res = await apiClient.post('/api/upload-dataset', { filename, data, columns })
      return res.data
    },
    listUploads: async (params = {}) => {
      const res = await apiClient.get('/api/uploads', { params })
      return res.data
    },
    uploadPreview: async (id) => {
      const res = await apiClient.get(`/api/uploads/${id}/preview`)
      return res.data
    },
    uploadAnalyze: async (id) => {
      const res = await apiClient.post(`/api/uploads/${id}/analyze`)
      return res.data
    },
    uploadDownload: async (id, format = 'csv') => {
      const res = await apiClient.get(`/api/uploads/${id}/download`, { params: { format } })
      return res.data
    },
    deleteUpload: async (id) => {
      const res = await apiClient.delete(`/api/uploads/${id}`)
      return res.data
    },
    setActiveDataset: async ({ filename, data, columns }) => {
      const res = await apiClient.post('/api/active-dataset', { filename, data, columns })
      return res.data
    },
    getActiveDataset: async () => {
      const res = await apiClient.get('/api/active-dataset')
      return res.data
    },
    clearActiveDataset: async () => {
      const res = await apiClient.delete('/api/active-dataset')
      return res.data
    },
  },
  // Health check
  health: async () => {
    const response = await apiClient.get('/api/health')
    return response.data
  },

  // Simple ping for diagnostics
  ping: async () => {
    try {
      const t0 = performance.now()
      const response = await apiClient.get('/api/health')
      const t1 = performance.now()
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('[API PING]', response.data, `(${Math.round(t1 - t0)}ms)`)
      }
      return { ok: true, ms: t1 - t0, data: response.data }
    } catch (e) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('[API PING FAILED]', e?.message)
      }
      return { ok: false, error: e?.message }
    }
  },

  // Get filter options
  getFilters: async () => {
    const response = await apiClient.get('/api/filters')
    return response.data
  },

  // Get overview metrics
  getOverview: async (filters) => {
    const response = await apiClient.post('/api/overview', filters)
    return response.data
  },

  // Get top performers
  getTopPerformers: async (filters) => {
    const response = await apiClient.post('/api/top-performers', filters)
    return response.data
  },

  // Get industry analysis
  getIndustryAnalysis: async (filters) => {
    const response = await apiClient.post('/api/industry-analysis', filters)
    return response.data
  },

  // Get regional insights
  getRegionalInsights: async (filters) => {
    const response = await apiClient.post('/api/regional-insights', filters)
    return response.data
  },

  // Get trends over time
  getTrends: async (filters) => {
    const response = await apiClient.post('/api/trends', filters)
    return response.data
  },

  // Get correlations
  getCorrelations: async (filters) => {
    const response = await apiClient.post('/api/correlations', filters)
    return response.data
  },

  // Export data
  exportData: async (filters) => {
    const response = await apiClient.post('/api/export', filters)
    return response.data
  },
}
