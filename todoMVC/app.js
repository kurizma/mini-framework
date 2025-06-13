import { createTodoItem } from "../src/vdom.js";

const appRoot = document.getElementById('app');
const todo = createTodoItem('Learn modules');
appRoot.appendChild(todo);