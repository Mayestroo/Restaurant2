import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { routes } from "./routes";
import { useSignalR } from "./hooks/useSignalR";
import ErrorBoundary from "./components/ErrorBoundary";
import { useRoutes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const AppRoutes = () => {
  return (
    <Suspense
      fallback={<div className="text-center mt-10">Yuklanmoqda...</div>}
    >
      {useRoutes(routes)}
    </Suspense>
  );
};

const App = () => {
  useSignalR();

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  );
};

export default App;
