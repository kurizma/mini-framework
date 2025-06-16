// // src/events.js
import { addTodo, toggleTodo, removeTodo, setFilter, getState, setEditing, clearEditing, updateTodo } from "./state.js";

function handleTodoListClick(e) {
    const li = e.target.closest('li[data-id]');
    if (!li) return;
    const id = Number(li.getAttribute('data-id'));
    if (e.target.classList.contains('destroy')) {
        removeTodo(id);
    }
}

function handleTodoListChange(e) {
    if (!e.target.classList.contains('toggle')) return;
    const li = e.target.closest('li[data-id]');
    if (!li) return;
    const id = Number(li.getAttribute('data-id'));
    toggleTodo(id);
}

function handleTodoListDblClick(e) {
    if (e.target.tagName === "LABEL") {
        const li = e.target.closest('li[data-id]');
        if (!li) return;
        const id = Number(li.getAttribute('data-id'));
        setEditing(id);
        setTimeout(() => {
            const input = li.querySelector('.edit');
            if (input) input.focus();
        }, 0);
    }
}

function handleTodoListKeyDown(e) {
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
}

function handleTodoListBlur(e) {
    if (!e.target.classList.contains('edit')) return;
    const li = e.target.closest('li[data-id]');
    if (!li) return;
    const id = Number(li.getAttribute('data-id'));
    updateTodo(id, e.target.value.trim());
    clearEditing();
}

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

    const todoList = appRoot.querySelector('.todo-list');
    if (todoList) {
        todoList.removeEventListener('click', handleTodoListClick);
        todoList.addEventListener('click', handleTodoListClick);

        todoList.removeEventListener('change', handleTodoListChange);
        todoList.addEventListener('change', handleTodoListChange);

        todoList.removeEventListener('dblclick', handleTodoListDblClick);
        todoList.addEventListener('dblclick', handleTodoListDblClick);

        todoList.removeEventListener('keydown', handleTodoListKeyDown);
        todoList.addEventListener('keydown', handleTodoListKeyDown);

        todoList.removeEventListener('blur', handleTodoListBlur, true);
        todoList.addEventListener('blur', handleTodoListBlur, true);
    }

    // Filter buttons
    const filters = appRoot.querySelectorAll('.filters a');
    filters.forEach(link => {
        link.onclick = null;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href === "#/") setFilter("all");
            else if (href === "#/active") setFilter("active");
            else if (href === "#/completed") setFilter("completed");
        });
    });

    // Clear completed
    const clearBtn = appRoot.querySelector('.clear-completed');
    if (clearBtn) {
        clearBtn.onclick = null;
        clearBtn.addEventListener('click', () => {
            const { todos } = getState();
            todos.filter(t => t.completed).forEach(t => removeTodo(t.id));
        });
    }
}

