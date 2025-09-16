import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, User, Calendar, Flag, Copy, Trash2, Edit3, ChevronDown, X } from 'lucide-react';

const TaskManager = () => {
  const [tasks, setTasks] = useState([
    // Backend Tasks
    {
      id: 1,
      title: "Setup Django Project & Docker Configuration",
      description: "Initialize Django project, configure Docker, create basic project structure",
      status: "To Do",
      priority: "High",
      assignee: "Backend Dev",
      project: "Backend",
      labels: ["setup", "infrastructure"],
      dueDate: "2024-09-05",
      blockedBy: [],
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: "Database Schema Implementation",
      description: "Create all PostgreSQL tables, indexes, and relationships as per schema",
      status: "To Do",
      priority: "High",
      assignee: "Backend Dev",
      project: "Backend",
      labels: ["database", "postgres"],
      dueDate: "2024-09-08",
      blockedBy: [1],
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      title: "Firebase Authentication Integration",
      description: "Setup Firebase Auth, implement @villanova.edu email restriction",
      status: "To Do",
      priority: "High",
      assignee: "Backend Dev",
      project: "Backend",
      labels: ["auth", "firebase"],
      dueDate: "2024-09-10",
      blockedBy: [1],
      createdAt: new Date().toISOString()
    },
    {
      id: 4,
      title: "User Management API Endpoints",
      description: "Create user registration, profile, authentication endpoints",
      status: "To Do",
      priority: "Medium",
      assignee: "Backend Dev",
      project: "Backend",
      labels: ["api", "users"],
      dueDate: "2024-09-12",
      blockedBy: [2, 3],
      createdAt: new Date().toISOString()
    },
    {
      id: 5,
      title: "Items Management API",
      description: "CRUD operations for items, categories, search functionality",
      status: "To Do",
      priority: "High",
      assignee: "Backend Dev",
      project: "Backend",
      labels: ["api", "items"],
      dueDate: "2024-09-15",
      blockedBy: [2],
      createdAt: new Date().toISOString()
    },
    {
      id: 6,
      title: "Image Upload & Storage Integration",
      description: "Implement Cloudinary/Firebase Storage for item images",
      status: "To Do",
      priority: "Medium",
      assignee: "Backend Dev",
      project: "Backend",
      labels: ["storage", "images"],
      dueDate: "2024-09-18",
      blockedBy: [5],
      createdAt: new Date().toISOString()
    },
    {
      id: 7,
      title: "Messaging System API",
      description: "Real-time messaging between buyers and sellers",
      status: "To Do",
      priority: "Medium",
      assignee: "Backend Dev",
      project: "Backend",
      labels: ["messaging", "realtime"],
      dueDate: "2024-09-20",
      blockedBy: [4],
      createdAt: new Date().toISOString()
    },
    {
      id: 8,
      title: "Payment Integration (Stripe)",
      description: "Implement Stripe payment processing for transactions",
      status: "To Do",
      priority: "Medium",
      assignee: "Backend Dev",
      project: "Backend",
      labels: ["payments", "stripe"],
      dueDate: "2024-09-25",
      blockedBy: [4, 5],
      createdAt: new Date().toISOString()
    },
    {
      id: 9,
      title: "Admin Dashboard API",
      description: "Admin endpoints for user/item management, moderation",
      status: "To Do",
      priority: "Low",
      assignee: "Backend Dev",
      project: "Backend",
      labels: ["admin", "moderation"],
      dueDate: "2024-09-28",
      blockedBy: [4, 5],
      createdAt: new Date().toISOString()
    },
    {
      id: 10,
      title: "Production Deployment Setup",
      description: "Deploy to DigitalOcean, configure CI/CD, monitoring",
      status: "To Do",
      priority: "High",
      assignee: "Backend Dev",
      project: "Backend",
      labels: ["deployment", "devops"],
      dueDate: "2024-09-30",
      blockedBy: [1, 2],
      createdAt: new Date().toISOString()
    },

    // React Web App Tasks
    {
      id: 11,
      title: "React Project Setup & Configuration",
      description: "Initialize React project with TypeScript, Tailwind, routing",
      status: "To Do",
      priority: "High",
      assignee: "Frontend Dev",
      project: "Web App",
      labels: ["setup", "react", "typescript"],
      dueDate: "2024-09-05",
      blockedBy: [],
      createdAt: new Date().toISOString()
    },
    {
      id: 12,
      title: "Authentication UI Components",
      description: "Login, register, forgot password, 2FA components",
      status: "To Do",
      priority: "High",
      assignee: "Frontend Dev",
      project: "Web App",
      labels: ["auth", "ui", "components"],
      dueDate: "2024-09-08",
      blockedBy: [11],
      createdAt: new Date().toISOString()
    },
    {
      id: 13,
      title: "User Profile & Settings",
      description: "User profile pages, settings, avatar upload",
      status: "To Do",
      priority: "Medium",
      assignee: "Frontend Dev",
      project: "Web App",
      labels: ["profile", "settings"],
      dueDate: "2024-09-12",
      blockedBy: [12, 4],
      createdAt: new Date().toISOString()
    },
    {
      id: 14,
      title: "Item Listing & Search Interface",
      description: "Browse items, search, filters, categories",
      status: "To Do",
      priority: "High",
      assignee: "Frontend Dev",
      project: "Web App",
      labels: ["items", "search", "ui"],
      dueDate: "2024-09-15",
      blockedBy: [11, 5],
      createdAt: new Date().toISOString()
    },
    {
      id: 15,
      title: "Item Creation & Management",
      description: "Create/edit item listings, image upload interface",
      status: "To Do",
      priority: "High",
      assignee: "Frontend Dev",
      project: "Web App",
      labels: ["items", "upload", "management"],
      dueDate: "2024-09-18",
      blockedBy: [14, 6],
      createdAt: new Date().toISOString()
    },
    {
      id: 16,
      title: "Messaging Interface",
      description: "Chat interface, conversation list, real-time updates",
      status: "To Do",
      priority: "Medium",
      assignee: "Frontend Dev",
      project: "Web App",
      labels: ["messaging", "chat", "realtime"],
      dueDate: "2024-09-22",
      blockedBy: [7],
      createdAt: new Date().toISOString()
    },
    {
      id: 17,
      title: "Payment & Checkout Flow",
      description: "Stripe integration, checkout process, transaction history",
      status: "To Do",
      priority: "Medium",
      assignee: "Frontend Dev",
      project: "Web App",
      labels: ["payments", "checkout"],
      dueDate: "2024-09-25",
      blockedBy: [8],
      createdAt: new Date().toISOString()
    },
    {
      id: 18,
      title: "Responsive Design & Mobile Optimization",
      description: "Ensure all components work perfectly on mobile devices",
      status: "To Do",
      priority: "Medium",
      assignee: "Frontend Dev",
      project: "Web App",
      labels: ["responsive", "mobile", "ui"],
      dueDate: "2024-09-28",
      blockedBy: [14, 15, 16],
      createdAt: new Date().toISOString()
    },
    {
      id: 19,
      title: "Admin Dashboard Interface",
      description: "Admin panel for user/item moderation",
      status: "To Do",
      priority: "Low",
      assignee: "Frontend Dev",
      project: "Web App",
      labels: ["admin", "dashboard"],
      dueDate: "2024-09-30",
      blockedBy: [9],
      createdAt: new Date().toISOString()
    },

    // iOS Mobile App Tasks
    {
      id: 20,
      title: "iOS Project Setup & Architecture",
      description: "Create iOS project, setup MVVM architecture, dependencies",
      status: "To Do",
      priority: "High",
      assignee: "Mobile Dev",
      project: "iOS App",
      labels: ["setup", "ios", "swift"],
      dueDate: "2024-09-05",
      blockedBy: [],
      createdAt: new Date().toISOString()
    },
    {
      id: 21,
      title: "Firebase SDK Integration",
      description: "Integrate Firebase Auth, Storage, and other services",
      status: "To Do",
      priority: "High",
      assignee: "Mobile Dev",
      project: "iOS App",
      labels: ["firebase", "integration"],
      dueDate: "2024-09-08",
      blockedBy: [20],
      createdAt: new Date().toISOString()
    },
    {
      id: 22,
      title: "Authentication Flow (iOS)",
      description: "Login, register, 2FA screens with proper iOS design",
      status: "To Do",
      priority: "High",
      assignee: "Mobile Dev",
      project: "iOS App",
      labels: ["auth", "ui", "ios"],
      dueDate: "2024-09-12",
      blockedBy: [21, 3],
      createdAt: new Date().toISOString()
    },
    {
      id: 23,
      title: "Item Browse & Search (iOS)",
      description: "Main feed, search functionality, category filters",
      status: "To Do",
      priority: "High",
      assignee: "Mobile Dev",
      project: "iOS App",
      labels: ["items", "search", "ios"],
      dueDate: "2024-09-15",
      blockedBy: [22, 5],
      createdAt: new Date().toISOString()
    },
    {
      id: 24,
      title: "Camera & Image Upload",
      description: "Camera integration, photo picker, image upload",
      status: "To Do",
      priority: "Medium",
      assignee: "Mobile Dev",
      project: "iOS App",
      labels: ["camera", "upload", "images"],
      dueDate: "2024-09-18",
      blockedBy: [6],
      createdAt: new Date().toISOString()
    },
    {
      id: 25,
      title: "Item Creation Flow (iOS)",
      description: "Create listing screen with all form fields",
      status: "To Do",
      priority: "High",
      assignee: "Mobile Dev",
      project: "iOS App",
      labels: ["items", "creation", "forms"],
      dueDate: "2024-09-20",
      blockedBy: [24],
      createdAt: new Date().toISOString()
    },
    {
      id: 26,
      title: "Push Notifications Setup",
      description: "Configure APNs, handle notification scenarios",
      status: "To Do",
      priority: "Medium",
      assignee: "Mobile Dev",
      project: "iOS App",
      labels: ["notifications", "apns"],
      dueDate: "2024-09-22",
      blockedBy: [21],
      createdAt: new Date().toISOString()
    },
    {
      id: 27,
      title: "In-App Messaging (iOS)",
      description: "Chat interface, real-time messaging with proper iOS UX",
      status: "To Do",
      priority: "Medium",
      assignee: "Mobile Dev",
      project: "iOS App",
      labels: ["messaging", "chat", "ios"],
      dueDate: "2024-09-25",
      blockedBy: [7, 26],
      createdAt: new Date().toISOString()
    },
    {
      id: 28,
      title: "Payment Integration (iOS)",
      description: "Apple Pay and Stripe integration",
      status: "To Do",
      priority: "Medium",
      assignee: "Mobile Dev",
      project: "iOS App",
      labels: ["payments", "apple-pay"],
      dueDate: "2024-09-28",
      blockedBy: [8],
      createdAt: new Date().toISOString()
    },
    {
      id: 29,
      title: "App Store Preparation",
      description: "App icons, screenshots, store listing, TestFlight",
      status: "To Do",
      priority: "Low",
      assignee: "Mobile Dev",
      project: "iOS App",
      labels: ["app-store", "deployment"],
      dueDate: "2024-09-30",
      blockedBy: [25, 27, 28],
      createdAt: new Date().toISOString()
    }
  ]);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');
  const [filterProject, setFilterProject] = useState('');

  const statuses = ['To Do', 'In Progress', 'In Review', 'Done', 'Blocked'];
  const priorities = ['Low', 'Medium', 'High', 'Urgent'];
  const assignees = ['Backend Dev', 'Frontend Dev', 'Mobile Dev'];
  const projects = ['Backend', 'Web App', 'iOS App'];

  const priorityColors = {
    'Low': 'bg-slate-100 text-slate-700 border-slate-200',
    'Medium': 'bg-blue-100 text-blue-700 border-blue-200',
    'High': 'bg-orange-100 text-orange-700 border-orange-200',
    'Urgent': 'bg-red-100 text-red-700 border-red-200'
  };

  const statusColors = {
    'To Do': 'bg-slate-100 text-slate-700 border-slate-200',
    'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
    'In Review': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Done': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Blocked': 'bg-red-100 text-red-700 border-red-200'
  };

  const projectColors = {
    'Backend': 'bg-purple-100 text-purple-700 border-purple-200',
    'Web App': 'bg-green-100 text-green-700 border-green-200',
    'iOS App': 'bg-indigo-100 text-indigo-700 border-indigo-200'
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || task.status === filterStatus;
    const matchesAssignee = !filterAssignee || task.assignee === filterAssignee;
    const matchesProject = !filterProject || task.project === filterProject;
    
    return matchesSearch && matchesStatus && matchesAssignee && matchesProject;
  });

  const handleCreateTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData,
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, newTask]);
    setShowTaskModal(false);
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    setShowTaskModal(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const handleCloneTask = (task) => {
    const clonedTask = {
      ...task,
      id: Date.now(),
      title: `${task.title} (Copy)`,
      status: 'To Do',
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, clonedTask]);
  };

  const getBlockingTasks = (taskId) => {
    return tasks.filter(task => task.blockedBy.includes(taskId));
  };

  const TaskModal = ({ task, onSave, onClose }) => {
    const [formData, setFormData] = useState(task || {
      title: '',
      description: '',
      status: 'To Do',
      priority: 'Medium',
      assignee: '',
      project: '',
      labels: [],
      dueDate: '',
      blockedBy: []
    });

    const [newLabel, setNewLabel] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    const addLabel = () => {
      if (newLabel.trim() && !formData.labels.includes(newLabel.trim())) {
        setFormData({
          ...formData,
          labels: [...formData.labels, newLabel.trim()]
        });
        setNewLabel('');
      }
    };

    const removeLabel = (labelToRemove) => {
      setFormData({
        ...formData,
        labels: formData.labels.filter(label => label !== labelToRemove)
      });
    };

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-blue-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {task ? 'Edit Task' : 'Create New Task'}
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50 transition-all resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50 transition-all"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50 transition-all"
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Assignee</label>
                <select
                  value={formData.assignee}
                  onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50 transition-all"
                  required
                >
                  <option value="">Select assignee</option>
                  {assignees.map(assignee => (
                    <option key={assignee} value={assignee}>{assignee}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Project</label>
                <select
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50 transition-all"
                  required
                >
                  <option value="">Select project</option>
                  {projects.map(project => (
                    <option key={project} value={project}>{project}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Labels</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.labels?.map(label => (
                  <span key={label} className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    {label}
                    <button
                      type="button"
                      onClick={() => removeLabel(label)}
                      className="ml-2 text-blue-400 hover:text-blue-600 p-1 rounded hover:bg-blue-100 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Add label"
                  className="flex-1 px-4 py-2 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50 transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLabel())}
                />
                <button
                  type="button"
                  onClick={addLabel}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors font-medium"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-blue-100">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-slate-600 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
              >
                {task ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const TaskCard = ({ task }) => {
    const blockingTasks = getBlockingTasks(task.id);
    const blockedTasks = tasks.filter(t => task.blockedBy.includes(t.id));

    return (
      <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-slate-800 flex-1 mr-2 group-hover:text-blue-700 transition-colors">{task.title}</h3>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => handleCloneTask(task)}
              className="text-slate-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors"
              title="Clone task"
            >
              <Copy size={14} />
            </button>
            <button
              onClick={() => {
                setEditingTask(task);
                setShowTaskModal(true);
              }}
              className="text-slate-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors"
              title="Edit task"
            >
              <Edit3 size={14} />
            </button>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
              title="Delete task"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">{task.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border shadow-sm ${statusColors[task.status]}`}>
            {task.status}
          </span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border shadow-sm ${priorityColors[task.priority]}`}>
            <Flag size={12} className="mr-1" />
            {task.priority}
          </span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border shadow-sm ${projectColors[task.project]}`}>
            {task.project}
          </span>
        </div>

        {task.labels && task.labels.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {task.labels.map(label => (
              <span key={label} className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                {label}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center text-sm text-slate-500 border-t border-blue-100 pt-3">
          <div className="flex items-center gap-2">
            <User size={14} />
            <span>{task.assignee}</span>
          </div>
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {(blockedTasks.length > 0 || blockingTasks.length > 0) && (
          <div className="mt-4 pt-4 border-t border-blue-100">
            {blockedTasks.length > 0 && (
              <div className="mb-2">
                <p className="text-xs font-semibold text-red-600 mb-2">Blocked by:</p>
                <div className="flex flex-wrap gap-1">
                  {blockedTasks.map(blockedTask => (
                    <span key={blockedTask.id} className="text-xs bg-red-50 text-red-700 px-3 py-1 rounded-lg border border-red-100 shadow-sm">
                      #{blockedTask.id} {blockedTask.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {blockingTasks.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-orange-600 mb-2">Blocking:</p>
                <div className="flex flex-wrap gap-1">
                  {blockingTasks.map(blockingTask => (
                    <span key={blockingTask.id} className="text-xs bg-orange-50 text-orange-700 px-3 py-1 rounded-lg border border-orange-100 shadow-sm">
                      #{blockingTask.id} {blockingTask.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
              VU Marketplace - Task Management
            </h1>
            <p className="text-slate-600 text-lg">Manage development tasks across Backend, Web App, and iOS App teams</p>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-white/90 backdrop-blur-sm border border-blue-200 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={() => {
                setEditingTask(null);
                setShowTaskModal(true);
              }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Plus size={16} className="mr-2" />
              Create Task
            </button>

            <div className="flex items-center gap-2 flex-1 min-w-64">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm shadow-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm shadow-sm"
              >
                <option value="">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <select
                value={filterAssignee}
                onChange={(e) => setFilterAssignee(e.target.value)}
                className="px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm shadow-sm"
              >
                <option value="">All Assignees</option>
                {assignees.map(assignee => (
                  <option key={assignee} value={assignee}>{assignee}</option>
                ))}
              </select>

              <select
                value={filterProject}
                onChange={(e) => setFilterProject(e.target.value)}
                className="px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm shadow-sm"
              >
                <option value="">All Projects</option>
                {projects.map(project => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>

              {(searchTerm || filterStatus || filterAssignee || filterProject) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('');
                    setFilterAssignee('');
                    setFilterProject('');
                  }}
                  className="px-4 py-3 text-slate-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors bg-white/80 backdrop-blur-sm shadow-sm"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Task Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          {statuses.map((status, index) => {
            const count = tasks.filter(task => task.status === status).length;
            const gradients = [
              'from-slate-500 to-slate-600',
              'from-blue-500 to-blue-600', 
              'from-amber-500 to-yellow-600',
              'from-emerald-500 to-green-600',
              'from-red-500 to-rose-600'
            ];
            return (
              <div key={status} className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-1">{status}</p>
                    <p className={`text-3xl font-bold bg-gradient-to-r ${gradients[index]} bg-clip-text text-transparent`}>{count}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${gradients[index]} shadow-lg`}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
          {filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100 max-w-md mx-auto">
              <p className="text-slate-600 text-xl mb-3">No tasks found</p>
              <p className="text-slate-500">Try adjusting your search or filters</p>
            </div>
          </div>
        )}

        {/* Task Modal */}
        {showTaskModal && (
          <TaskModal
            task={editingTask}
            onSave={editingTask ? handleUpdateTask : handleCreateTask}
            onClose={() => {
              setShowTaskModal(false);
              setEditingTask(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TaskManager;