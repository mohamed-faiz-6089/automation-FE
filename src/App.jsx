import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProjectView from "./components/projects/ProjectView"; 
import SuiteListPage from "./components/suites/SuiteListPage";
import LoginPage from "./common/LoginPage";
import Home from "./components/Home/Home";
import MainLayout from "./common/layout/Main_Layout";
import AutomateEditor from "./components/AutomateEditor";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/projectview" element={<ProjectView />} /> 
          <Route path="/projects/:projectId" element={<SuiteListPage />} />
          <Route path="/AutomateEditor" element={<AutomateEditor />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}
