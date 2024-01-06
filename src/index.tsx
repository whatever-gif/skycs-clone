import "./polyfills";
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ToastContainer } from "react-toastify";
// @ts-ignore
// import { worker } from './mocks/browser';
import "./i18n/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "@packages/contexts/auth";
import "react-toastify/dist/ReactToastify.css";

import Error from "./packages/ui/error/error";
import UserPopup from "./packages/ui/user-panel/UserPopup";

if (import.meta.env.DEV) {
  // worker.start();
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchIntervalInBackground: false,
    },
  },
});

root.render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Suspense>
        <App />
      </Suspense>
    </AuthProvider>
    <Error />
    <ToastContainer
      className="toaster-container"
      position="top-right"
      autoClose={3000}
      hideProgressBar={true}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable={false}
      pauseOnHover={true}
    />
    <ReactQueryDevtools />
  </QueryClientProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
