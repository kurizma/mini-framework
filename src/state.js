// src/state.js

// The app's state: an array of todos and the current filter
let state = {
    todos: [], // Each todo: { id, text, completed }
    filter: "all", // "all" | "active" | "completed"
    editingId: null // id of todo item being edited or null
};

// Listeners to notify when state changes
let listeners = [];

// Get the current state
export function getState() {
    return state;
}

// Subscribe to state changes
export function subscribe(listener) {
    listeners.push(listener);
    // Return unsubscribe function
    return () => {
        listeners = listeners.filter(l => l !== listener);
    };
}

// Notify all listeners (e.g., after a state change)
function notify() {
    listeners.forEach(listener => listener());
}

// Add a new todo
export function addTodo(text) {
    state = {
        ...state,
        todos: [
            ...state.todos,
            {
                id: Date.now(),
                text,
                completed: false
            }
        ]
    };
    notify();
}

// Toggle a todo's completion
export function toggleTodo(id) {
    state = {
        ...state,
        todos: state.todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
    };
    notify();
}

// Remove a todo
export function removeTodo(id) {
    state = {
        ...state,
        todos: state.todos.filter(todo => todo.id !== id)
    };
    notify();
}

// Set the current filter
export function setFilter(filter) {
    state = { ...state, filter };
    notify();
}

export function setEditing(id) {
    state = { ...state, editingId: id };
    notify();
}
export function clearEditing() {
    state = { ...state, editingId: null };
    notify();
}
export function updateTodo(id, newText) {
    state = {
        ...state,
        todos: state.todos.map(todo =>
            todo.id === id ? { ...todo, text: newText } : todo
        )
    };
    notify();
}