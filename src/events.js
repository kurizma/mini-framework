// src/events.js

import { addTodo, toggleTodo, removeTodo, setFilter, getState, setEditing, clearEditing, updateTodo } from "./state.js";

/**
 * Sets up all event listeners for the TodoMVC app.
 * Should be called after every DOM update.
 * @param {HTMLElement} appRoot - The root element of your app
 */
export function setupEventListeners(appRoot) {
    // Add new todo on Enter key in the input box
    const input = appRoot.querySelector('.new-todo');
    if (input) {
        input.onkeydown = null;
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                addTodo(input.value.trim());
                input.value = '';
            }
        });
    }

    // Event delegation for toggling and deleting todos
    const todoList = appRoot.querySelector('.todo-list');
    if (todoList) {
        todoList.addEventListener('dblclick', (e) => {
            if (e.target.tagName === "LABEL") {
                const li = e.target.closest('li[data-id]');
                if (!li) return;
                const id = Number(li.getAttribute('data-id'));
                setEditing(id);
                // Focus the input after the DOM updates
                setTimeout(() => {
                    const input = li.querySelector('.edit');
                    if (input) input.focus();
                }, 0);
            }
        });

        // --- Save or cancel edit ---
        todoList.addEventListener('keydown', (e) => {
            if (!e.target.classList.contains('edit')) return;
            const li = e.target.closest('li[data-id]');
            if (!li) return;
            const id = Number(li.getAttribute('data-id'));
            if (e.key === 'Enter') {
                updateTodo(id, e.target.value.trim());
                clearEditing();
            }
            if (e.key === 'Escape') {
                clearEditing();
            }
        });
        todoList.addEventListener('blur', (e) => {
            if (!e.target.classList.contains('edit')) return;
            const li = e.target.closest('li[data-id]');
            if (!li) return;
            const id = Number(li.getAttribute('data-id'));
            updateTodo(id, e.target.value.trim());
            clearEditing();
        }, true); // useCapture: true to catch blur
    }   

    // --- Filter buttons (All, Active, Completed) ---
    const filters = appRoot.querySelectorAll('.filters a');
    filters.forEach(link => {
        // Remove previous listener to avoid duplicates
        link.onclick = null;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href === "#/") setFilter("all");
            else if (href === "#/active") setFilter("active");
            else if (href === "#/completed") setFilter("completed");
        });
    });

    // --- Clear completed ---
    const clearBtn = appRoot.querySelector('.clear-completed');
    if (clearBtn) {
        clearBtn.onclick = null;
        clearBtn.addEventListener('click', () => {
            const { todos } = getState();
            todos.filter(t => t.completed).forEach(t => removeTodo(t.id));
        });
    }
    
}
