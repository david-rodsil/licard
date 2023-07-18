import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import './index.css';
import { HelmetProvider } from 'react-helmet-async';

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
    <React.Suspense fallback="loading">
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </React.Suspense>
);
