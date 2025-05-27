import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("❌ Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center mt-20 text-red-500">
          <h1 className="text-2xl font-bold">Xatolik yuz berdi</h1>
          <p>Sahifani yuklashda muammo bo‘ldi.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
