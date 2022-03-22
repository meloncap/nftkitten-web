import { Component, ReactNode } from 'react'

export class ErrorBoundary extends Component<{
  fallback: NonNullable<ReactNode> | null
}> {
  state = { hasError: false, error: null }
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error,
    }
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}
