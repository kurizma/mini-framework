// src/state.js

// The app's state: an array of todos and the current filter
let state = {
  todos: [], // Each todo: { id, text, completed }
  filter: "all", // "all" | "active" | "completed"
  editingId: null, // id of todo item being edited or null
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
        listeners = listeners.filter((l) => l !== listener);
    };
}

// Notify all listeners (e.g., after a state change)
function notify() {
    listeners.forEach((listener) => {
        try {
        listener();
        } catch (error) {
        console.error("Error in state listener:", error);
        }
    });
}

// Add a new todo
let nextTodoId = 1;

export function addTodo(text) {
    state = {
        ...state,
        todos: [
        {
            id: nextTodoId++,
            text,
            completed: false,
        },
        ...state.todos, // append new todo to already existing todo items
        ],
    };
    notify();
}

// Toggle a todo's completion
export function toggleTodo(id) {
    state = {
        ...state,
        todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ),
    };
    notify();
}

// Remove a todo
export function removeTodo(id) {
    state = {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== id),
    };
    notify();
}

// toggle all items
export function toggleAllTodos(forceCompleted = null) {
  // If forceCompleted is provided, use it. Otherwise, determine based on current state
    let newCompletedState;

    if (forceCompleted !== null) {
        newCompletedState = forceCompleted;
    } else {
        // If all todos are completed, mark all as incomplete
        // If any todo is incomplete, mark all as complete
        const allCompleted = state.todos.every((todo) => todo.completed);
        newCompletedState = !allCompleted;
    }

    state = {
        ...state,
        todos: state.todos.map((todo) => ({
        ...todo,
        completed: newCompletedState,
        })),
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
        todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
        ),
    };
    notify();
}
