import { User, Board, Todo, Comment } from '../types';

// API Base URL - change this for production
const API_BASE_URL = 'http://localhost:5001/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('todosphere_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }
    return data;
};

export const api = {
    // --- AUTH ---
    signup: async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        return handleResponse(response);
    },

    login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return handleResponse(response);
    },

    getMe: async (): Promise<User> => {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // --- BOARDS ---
    getBoards: async (): Promise<Board[]> => {
        const response = await fetch(`${API_BASE_URL}/boards`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    getBoard: async (boardId: string): Promise<Board> => {
        const response = await fetch(`${API_BASE_URL}/boards/${boardId}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    createBoard: async (title: string): Promise<Board> => {
        const response = await fetch(`${API_BASE_URL}/boards`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ title })
        });
        return handleResponse(response);
    },

    updateBoard: async (boardId: string, title: string): Promise<Board> => {
        const response = await fetch(`${API_BASE_URL}/boards/${boardId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ title })
        });
        return handleResponse(response);
    },

    deleteBoard: async (boardId: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/boards/${boardId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        await handleResponse(response);
    },

    // --- TODOS ---
    getTodos: async (boardId: string): Promise<Todo[]> => {
        const response = await fetch(`${API_BASE_URL}/todos/${boardId}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    getTodo: async (todoId: string): Promise<Todo> => {
        const response = await fetch(`${API_BASE_URL}/todos/item/${todoId}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    createTodo: async (title: string, boardId: string, options?: {
        description?: string;
        priority?: string;
        dueDate?: string;
    }): Promise<Todo> => {
        const response = await fetch(`${API_BASE_URL}/todos`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ title, boardId, ...options })
        });
        return handleResponse(response);
    },

    updateTodo: async (todoId: string, updates: Partial<{
        title: string;
        description: string;
        status: string;
        priority: string;
        dueDate: string | null;
        recurrence: {
            enabled: boolean;
            pattern: string | null;
            interval: number;
            endDate: string | null;
        };
        dependencies: string[];
    }>): Promise<Todo> => {
        const response = await fetch(`${API_BASE_URL}/todos/item/${todoId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(updates)
        });
        return handleResponse(response);
    },

    // Legacy method for backward compatibility
    updateTodoStatus: async (todoId: string, status: string): Promise<Todo> => {
        return api.updateTodo(todoId, { status });
    },

    deleteTodo: async (todoId: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/todos/item/${todoId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        await handleResponse(response);
    },

    // --- SUBTASKS ---
    addSubtask: async (todoId: string, title: string): Promise<Todo> => {
        const response = await fetch(`${API_BASE_URL}/todos/item/${todoId}/subtask`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ title })
        });
        return handleResponse(response);
    },

    toggleSubtask: async (todoId: string, subtaskId: string): Promise<Todo> => {
        const response = await fetch(`${API_BASE_URL}/todos/item/${todoId}/subtask/${subtaskId}`, {
            method: 'PUT',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    deleteSubtask: async (todoId: string, subtaskId: string): Promise<Todo> => {
        const response = await fetch(`${API_BASE_URL}/todos/item/${todoId}/subtask/${subtaskId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // --- COMMENTS ---
    getComments: async (todoId: string): Promise<Comment[]> => {
        const response = await fetch(`${API_BASE_URL}/comments/${todoId}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    createComment: async (todoId: string, content: string, type: 'comment' | 'activity' = 'comment'): Promise<Comment> => {
        const response = await fetch(`${API_BASE_URL}/comments`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ todoId, content, type })
        });
        return handleResponse(response);
    },

    deleteComment: async (commentId: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/comments/item/${commentId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        await handleResponse(response);
    }
};

