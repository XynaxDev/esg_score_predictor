import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, info: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    this.setState({ info })
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('React render error:', error, info)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-950 text-gray-100 p-6">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
              <h1 className="text-xl font-bold text-red-300">UI crashed</h1>
              <p className="text-sm text-red-200 mt-1">A rendering error occurred. See details below (dev only).</p>
              <pre className="mt-3 whitespace-pre-wrap text-xs text-gray-200">
                {String(this.state.error)}
              </pre>
              {this.state.info?.componentStack && (
                <pre className="mt-2 whitespace-pre-wrap text-xs text-gray-400">
                  {this.state.info.componentStack}
                </pre>
              )}
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
