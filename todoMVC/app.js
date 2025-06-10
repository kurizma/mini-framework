import { createTodoItem } from "../src/dom.js";

const appRoot = document.getElementById('app');
const todo = createTodoItem('Learn modules');
appRoot.appendChild(todo);