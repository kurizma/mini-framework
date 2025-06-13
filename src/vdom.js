export function createTodoItem(text) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.textContent = text;
    return li;
}