const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper function to make authenticated requests
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  register: async (username: string, email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Registration failed' }));
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  },
};

// Task API
export const taskAPI = {
  getTasks: async () => {
    return fetchWithAuth('/tasks');
  },

  getTaskById: async (id: string) => {
    return fetchWithAuth(`/tasks/${id}`);
  },

  createTask: async (task: {
    title: string;
    description?: string;
    priority?: 'high' | 'medium' | 'low';
    dueDate?: string;
    status?: 'active' | 'progress' | 'completed';
  }) => {
    // Map frontend status to backend status
    const backendStatus = task.status === 'completed' ? 'completed' : 'pending';
    return fetchWithAuth('/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: task.title,
        description: task.description || '',
        status: backendStatus,
        priority: task.priority,
        dueDate: task.dueDate,
      }),
    });
  },

  updateTask: async (id: string, updates: {
    title?: string;
    description?: string;
    status?: 'active' | 'progress' | 'completed';
    priority?: 'high' | 'medium' | 'low';
    dueDate?: string;
  }) => {
    // Map frontend status to backend status
    const backendStatus = updates.status === 'completed' ? 'completed' : 'pending';
    return fetchWithAuth(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...updates,
        status: backendStatus,
      }),
    });
  },

  deleteTask: async (id: string) => {
    return fetchWithAuth(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};
