import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProjectView from "./components/projects/ProjectView"; 
import SuiteListPage from "./components/suites/SuiteListPage";
import LoginPage from "./common/LoginPage";
import Home from "./components/Home/home";
import MainLayout from "./common/layout/Main_Layout";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/projectview" element={<ProjectView />} /> 
          <Route path="/suites/:projectId" element={<SuiteListPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}
