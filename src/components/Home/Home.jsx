import React from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiHome, FiFolder, FiSearch } from "react-icons/fi";

export default function Home() {
    const projects = [
        { id: "1", name: "Website Revamp", description: "Next.js + Tailwind redesign" },
        { id: "2", name: "CRM Migration", description: "Move CRM to cloud" },
        { id: "3", name: "Mobile App", description: "Flutter-based client app" },
    ];

    return (
        <div className="min-h-screen ">
            <header className=" px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Welcome back</h2>
                        <p className="text-sm text-gray-500">
                            Manage your projects and test suites seamlessly.
                        </p>
                    </section>        </div>

                <Link
                    to="/projectview"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    <FiPlus size={18} /> Create Project
                </Link>
            </header>

            <main className="mx-auto px-6 py-10">
                <section className="mb-10">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                            <FiFolder /> Your Projects
                        </h3>
                        <Link to="/projectview" className="text-sm text-blue-600 hover:underline">
                            View all projects
                        </Link>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-white border rounded-xl shadow-sm p-5 hover:shadow-md transition"
                            >
                                <h4 className="text-lg font-bold text-gray-800 mb-1">{project.name}</h4>
                                <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                                <Link
                                    to={`/projects/${project.id}`}
                                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    <FiSearch className="mr-1" /> View Project
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-white rounded-xl border shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">What's New</h3>
                    <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
                        <li>🧠 AI-powered suite recommendations (Coming soon)</li>
                        <li>📊 Analytics dashboard for project health (In progress)</li>
                        <li>🔔 Real-time notifications integration (Planned)</li>
                    </ul>
                </section>
            </main>
        </div>
    );
}
