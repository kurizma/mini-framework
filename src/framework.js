export { renderElement, diff, patch } from './vdom.js';
export { getState, subscribe, addTodo, toggleTodo, removeTodo, setFilter, setEditing, clearEditing, updateTodo } from './state.js';
export { setupEventListeners } from './events.js';
export { router } from './router.js';


export function createVNode(tag, attrs = {}, children = [], key = undefined) {
    return {
        tag,
        attrs,
        children: Array.isArray(children) ? children : [children],
        key
    };
}