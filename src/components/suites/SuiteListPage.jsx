// File: src/pages/SuiteListPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import SuiteList from "./SuiteList";
import { useSuitesByProjectIdQuery } from "../../services/queries/useSuiteQuery";


export default function SuiteListPage() {
  const { projectId } = useParams();

  const { data: suites, isLoading, isError } = useSuitesByProjectIdQuery(projectId);
  

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        🧪 Test Suites for Project
      </h2>

      {isLoading && <p className="text-center">Loading suites...</p>}
      {isError && <p className="text-red-500 text-center">Failed to load suites</p>}

      {suites && <SuiteList selectedProjectId={projectId} suites={suites} />}
    </div>
  );
}
