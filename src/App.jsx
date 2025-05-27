import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { routes } from "./routes";
import { useSignalR } from "./hooks/useSignalR";
import ErrorBoundary from "./components/ErrorBoundary";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  useSignalR(); // Initialize SignalR globally

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<div className="text-center mt-10">Yuklanmoqda...</div>}>
          <Routes>
            {routes.map(({ path, element }, index) => (
              <Route key={index} path={path} element={element} />
            ))}
          </Routes>
        </Suspense>
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
