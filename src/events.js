// // src/events.js
import { addTodo, toggleTodo, removeTodo, toggleAllTodos, setFilter, getState, setEditing, clearEditing, updateTodo } from "./state.js";

function handleTodoListClick(e) {
    // console.log('handleTodoListClick', e.target);
    const li = e.target.closest('li[data-id]');
    if (!li) return;
    const id = Number(li.getAttribute('data-id'));
    if (e.target.classList.contains('destroy')) {
        removeTodo(id);
    }
}

function handleTodoListChange(e) {
    // console.log('handleTodoListChange', e.target);
    if (!e.target.classList.contains('toggle')) return;
    const li = e.target.closest('li[data-id]');
    if (!li) return;
    const id = Number(li.getAttribute('data-id'));
    toggleTodo(id);
}

function handleTodoListDblClick(e) {
    // console.log('handleTodoListDblClick', e.target);
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
    // console.log('handleTodoListKeyDown', e.target, e.key);
    if (!e.target.classList.contains('edit')) return;
    const li = e.target.closest('li[data-id]');
    if (!li) return;
    const id = Number(li.getAttribute('data-id'));
    if (e.key === 'Enter') {
    const trimmed = e.target.value.trim();
    const previousValue = getState().todos.find((todo) => todo.id === id)?.text ?? "";
    updateTodo(id, trimmed.length > 0 ? trimmed : previousValue);
    clearEditing();
    }
    if (e.key === 'Escape') {
        clearEditing();
    }
}

function handleTodoListBlur(e) {
    // console.log('handleTodoListBlur', e.target);
    if (!e.target.classList.contains('edit')) return;
    const li = e.target.closest('li[data-id]');
    if (!li) return;
    const id = Number(li.getAttribute('data-id'));
    const trimmed = e.target.value.trim();
    const previousValue = getState().todos.find((todo) => todo.id === id)?.text ?? "";
    updateTodo(id, trimmed.length > 0 ? trimmed : previousValue);
    clearEditing();
}

const appRoot = document.documentElement
export function setupEventListeners(appRoot) {
    if (!appRoot) {
        throw new Error("setupEventListeners: appRoot is undefined!");
    }
    // Add new todo on Enter key in the input box
    const input = appRoot.querySelector('.new-todo');
    if (input) {
        // Remove old listener
        input.removeEventListener('keydown', input._todoKeyHandler);
        
        // Create named handler for proper cleanup
        input._todoKeyHandler = (e) => {
            // console.log('new-todo keydown', e.key);
            if (e.key === 'Enter' && input.value.trim()) {
                addTodo(input.value.trim());
                input.value = '';
            }
        };
        input.addEventListener('keydown', input._todoKeyHandler);
    }

    // Handle toggle-all functionality

    const toggleAll = appRoot.querySelector('.toggle-all');
    // const toggleAll = appRoot.querySelector('#toggle-all');
    if (toggleAll) {
        toggleAll.removeEventListener('change', toggleAll._toggleAllHandler);
        toggleAll._toggleAllHandler = (e) => {
            console.log("toggle-all changed");
            const { todos } = getState();
            const areAllCompleted = todos.every((t) => t.completed);
            todos.forEach((todo) => {
                if (todo.completed === areAllCompleted) {
                toggleTodo(todo.id);
                }
            });
        };
        };
        toggleAll.addEventListener('change', toggleAll._toggleAllHandler);
    }

    const todoList = appRoot.querySelector(".todo-list");
    if (todoList) {
        todoList.removeEventListener("click", handleTodoListClick);
        todoList.addEventListener("click", handleTodoListClick);

        todoList.removeEventListener("change", handleTodoListChange);
        todoList.addEventListener("change", handleTodoListChange);

        todoList.removeEventListener("dblclick", handleTodoListDblClick);
        todoList.addEventListener("dblclick", handleTodoListDblClick);

        todoList.removeEventListener("keydown", handleTodoListKeyDown);
        todoList.addEventListener("keydown", handleTodoListKeyDown);

        todoList.removeEventListener("blur", handleTodoListBlur, true);
        todoList.addEventListener("blur", handleTodoListBlur, true);
    }

    // Filter buttons 
    const filters = appRoot.querySelectorAll('.filters a');
    filters.forEach(link => {
        link.removeEventListener('click', link._filterHandler);
        link._filterHandler = (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            // Update URL hash and let router handle it
            window.location.hash = href;
        };
        link.addEventListener('click', link._filterHandler);
    });

  // Clear completed

    const clearBtn = appRoot.querySelector(".clear-completed");
    if (clearBtn) {
        clearBtn.removeEventListener("click", clearBtn._clearHandler);
        clearBtn._clearHandler = () => {
        console.log("clear-completed clicked");
        const { todos } = getState();
        todos.filter((t) => t.completed).forEach((t) => removeTodo(t.id));
    };
    clearBtn.addEventListener("click", clearBtn._clearHandler);
}
