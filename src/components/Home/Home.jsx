import React from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiFolder, FiSearch, FiUserPlus } from "react-icons/fi";
import Modal from "../ui/Modal";
import RichTextEditor from "../ui/RichTextEditor/Index";
import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCreateProjectMutation, useProjectQuery } from "../../services/queries/useProjectQuery";

export default function Home() {
    const user = JSON.parse(localStorage.getItem("User"));
    const createProject = useCreateProjectMutation();
    const { data: projects = [] } = useProjectQuery(user?.id, user?.role?.name);
    console.log(projects)
    const queryClient = useQueryClient();

    // Create Project modal state
    const [open, setOpen] = React.useState(false);
    const [formData, setFormData] = React.useState({
        name: "",
        description: "",
        isActive: true,
        createdBy: "",
    });

    // Assign modal state (Radix)
    const [assignOpen, setAssignOpen] = React.useState(false);
    const [selectedProject, setSelectedProject] = React.useState(null);
    const [selectedUsers, setSelectedUsers] = React.useState([]);
    const [selectAll, setSelectAll] = React.useState(false);

    const {
        data: users = [],
        isLoading: usersLoading,
        isError: usersError,
        refetch: refetchUsers,
    } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await axios.get("http://localhost:3001/user");
            return res.data;
        },
        staleTime: 1000 * 60 * 2,
        refetchOnWindowFocus: false,
    });

    const assignMutation = useMutation({
        mutationFn: async ({ projectId, userIds }) => {
            const url = `http://localhost:3001/project/${projectId}/assign`;
            return axios.post(url, userIds);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });

    // Keep selectAll in sync if users list changes
    React.useEffect(() => {
        if (!users || users.length === 0) {
            setSelectAll(false);
            setSelectedUsers([]);
            return;
        }
        if (selectAll) {
            setSelectedUsers(users.map((u) => u.id));
        } else {
            setSelectedUsers((prev) => prev.filter((id) => users.some((u) => u.id === id)));
        }
    }, [users, selectAll]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // createProject is a custom hook from your codebase; keep using it as before
        createProject.mutate(formData, {
            onSuccess: () => {
                setFormData((f) => ({
                    name: "",
                    description: "",
                    isActive: true,
                    createdBy: f.createdBy,
                }));
                setOpen(false);
            },
            onError: () => {
                console.error("Error creating project.");
            },
        });
    };

    const openAssignModal = (project) => {
        setSelectedProject(project);
        setSelectedUsers([]);
        setSelectAll(false);
        setAssignOpen(true);
        if (!users || users.length === 0) refetchUsers();
    };

    const toggleUser = (userId) => {
        setSelectedUsers((prev) => {
            if (prev.includes(userId)) {
                setSelectAll(false);
                return prev.filter((id) => id !== userId);
            }
            const next = [...prev, userId];
            if (users && next.length === users.length) setSelectAll(true);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedUsers([]);
            setSelectAll(false);
        } else {
            setSelectedUsers(users.map((u) => u.id));
            setSelectAll(true);
        }
    };

    const handleAssign = async () => {
        if (!selectedProject || !users) return;

        try {
            const payload = users.map((u) => ({
                userId: u.id,
                checked: selectedUsers.includes(u.id),
            }));

            await assignMutation.mutateAsync({
                projectId: selectedProject.id,
                assignments: payload,
            });

            setAssignOpen(false);
            setSelectedUsers([]);
            setSelectAll(false);
        } catch (err) {
            console.error("Assign failed", err);
        }
    };


    return (
        <>
            <div className="min-h-screen ">
                <header className=" px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-1">Welcome back</h2>
                            <p className="text-sm text-gray-500">Manage your projects and test suites seamlessly.</p>
                        </section>
                    </div>
                    {user?.role?.name?.toLowerCase() === 'admin' && (
                        <button
                            onClick={() => setOpen(true)}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            <FiPlus /> Create Project
                        </button>
                    )}
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
                            {projects &&
                                projects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="bg-white border rounded-xl shadow-sm p-5 hover:shadow-md transition flex flex-col justify-between"
                                    >
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-800 mb-1">{project.name}</h4>
                                            <p className="text-sm text-gray-600 mb-3 truncate">{project.description}</p>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <Link
                                                to={`/projects/${project.id}`}
                                                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                <FiSearch className="mr-1" /> View Project
                                            </Link>
                                            {user?.role?.name?.toLowerCase() === 'admin' && (
                                                <button
                                                    onClick={() => openAssignModal(project)}
                                                    className="ml-3 inline-flex items-center gap-2 px-3 py-1.5 bg-sky-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300"
                                                    aria-label={`Assign ${project.name} to users`}
                                                >
                                                    <FiUserPlus />
                                                    Assign
                                                </button>
                                            )}
                                        </div>
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

            {/* Create Project Modal (existing UI Modal component) */}
            <Modal open={open} onOpenChange={setOpen} title="Create Project" subTitle="Required fields are marked with an asterisk *">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Project Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description *</label>
                        <RichTextEditor
                            value={formData.description}
                            onChange={(value) => setFormData((f) => ({ ...f, description: value }))}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">Mark as Active</span>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 mb-4">
                        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-gray-600 rounded-md bg-transparent">
                            Cancel
                        </button>
                        <button type="submit" className="px-3 py-1 text-sm bg-blue-600 text-white !rounded-sm  hover:bg-blue-700">
                            Create
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Radix Assign Modal (multi-select with checkboxes) */}
            <Dialog.Root open={assignOpen} onOpenChange={setAssignOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

                    <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl focus:outline-none">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xl font-semibold text-slate-900">Assign Project</p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Assign <span className="font-medium text-slate-800">{selectedProject?.name ?? "—"}</span> to one or more users.
                                </p>
                            </div>

                            <Dialog.Close asChild>
                                <button
                                    aria-label="Close"
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 focus:outline-none"
                                >
                                    ✕
                                </button>
                            </Dialog.Close>
                        </div>

                        {/* Select All / meta */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <label className="inline-flex items-center gap-3 cursor-pointer select-none">
                                        {/* visually aligned custom checkbox */}
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={selectAll}
                                                onChange={toggleSelectAll}
                                                disabled={usersLoading || usersError || (users?.length ?? 0) === 0}
                                                className="absolute h-4 w-4 opacity-0"
                                                aria-label="Select all users"
                                            />
                                            <div
                                                className={`flex h-5 w-5 items-center justify-center rounded border ${selectAll ? "border-sky-600 bg-sky-600" : "border-slate-200 bg-white"
                                                    } shadow-sm`}
                                            >
                                                {selectAll && (
                                                    <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>

                                        <span className="text-sm font-medium text-slate-700">Select all</span>
                                    </label>

                                    <span className="text-sm text-slate-500">({selectedUsers.length} selected)</span>
                                </div>

                                <div className="text-sm text-slate-500">Total users: {users?.length ?? 0}</div>
                            </div>

                            {/* Users list */}
                            <div className="max-h-56 overflow-auto divide-y rounded border border-slate-100">
                                {usersLoading && (
                                    <div className="p-4 text-center text-sm text-slate-500">Loading users...</div>
                                )}

                                {usersError && (
                                    <div className="p-4 text-center text-sm text-rose-600">Failed to load users — try refreshing.</div>
                                )}

                                {!usersLoading && !usersError && users?.length === 0 && (
                                    <div className="p-4 text-center text-sm text-slate-500">No users found.</div>
                                )}

                                {!usersLoading && !usersError && users?.map((u) => {
                                    const label = u.name ?? u.username ?? u.email ?? `User ${u.id}`;
                                    const roleLabel = typeof u.role === "string" ? u.role : u.role?.name ?? "Member";
                                    const isSelected = selectedUsers.includes(u.id);

                                    return (
                                        <label
                                            key={u.id}
                                            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                {/* aligned custom checkbox */}
                                                <div className="relative flex-shrink-0">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => toggleUser(u.id)}
                                                        className="absolute h-4 w-4 opacity-0"
                                                        aria-label={`Select ${label}`}
                                                    />
                                                    <div className={`flex h-5 w-5 items-center justify-center rounded border ${isSelected ? "border-sky-600 bg-sky-600" : "border-slate-200 bg-white"} shadow-sm`}>
                                                        {isSelected && (
                                                            <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                                <path strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="text-sm font-medium text-slate-900 truncate">{label}</div>
                                                    <div className=" flex-shrink-0 text-xs text-slate-500">{roleLabel}</div>

                                                </div>
                                            </div>

                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex justify-end gap-3">
                            <Dialog.Close asChild>
                                <button className="inline-flex items-center px-4 py-2 rounded-md bg-slate-100 text-sm font-medium hover:bg-slate-200 focus:outline-none">
                                    Cancel
                                </button>
                            </Dialog.Close>

                            <button
                                onClick={handleAssign}
                                disabled={assignMutation?.isLoading || selectedUsers.length === 0}
                                className="inline-flex items-center px-4 py-2 rounded-md bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-sky-300"
                            >
                                {assignMutation?.isLoading ? "Assigning..." : `Assign (${selectedUsers.length})`}
                            </button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

        </>
    );
}
