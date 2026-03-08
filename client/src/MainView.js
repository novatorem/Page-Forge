import React from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";

import Dashboard from "./react-components/Dashboard";

export default function MainView() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/:coverId" element={<Dashboard />} />
        <Route path="*" element={<div>404 Not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
