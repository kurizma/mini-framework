import { renderElement, diff, patch } from "../src/vdom.js";
import { getState, subscribe, addTodo } from "../src/state.js";

// Function to build the app virtual DOM tree based on state
/**
 * Build the virtual DOM tree for the entire app, based on the current state.
 * @param {Object} state - The current application state (todos, filter, etc.)
 * @returns {Object} - The virtual DOM tree (root node)
 */
function buildAppVNode(state) {

    // Generate todo <li> items from state.todos
    const todoListItems = state.todos.map(todo => ({
        tag: "li",
        attrs: { "data-id": String(todo.id), class: "" },
        children: [
            {
                tag: "div",
                attrs: { class: "view" },
                children: [
                    { tag: "input", attrs: { class: "toggle", type: "checkbox" }, children: [] },
                    { tag: "label", attrs: {}, children: [todo.text] },
                    { tag: "button", attrs: { class: "destroy" }, children: [] }
                ]
            }
        ]
    }));


    const headerVNode = {
        tag: "header",
        attrs: { class: "header" },
        children: [
            { tag: "h1", attrs: {}, children: ["todos"] },
            { tag: "input", attrs: { class: "new-todo", placeholder: "What needs to be done?", autofocus: "" }, children: [] }
        ]
    };

    const mainVNode = {
        tag: "main",
        attrs: { class: "main", style: "display: block;" },
        children: [
            {
                tag: "div",
                attrs: { class: "toggle-all-container" },
                children: [
                    { tag: "input", attrs: { class: "toggle-all", type: "checkbox" }, children: [] },
                    { tag: "label", attrs: { class: "toggle-all-label", for: "toggle-all" }, children: ["Mark all as complete"] }
                ]
            },
            {
                tag: "ul",
                attrs: { class: "todo-list" },
                children: todoListItems
            }
        ]
    };

    // footer w/ count and filters
    const footerVNode = {
        tag: "footer",
        attrs: { class: "footer", style: "display: block;" },
        children: [
            {
                tag: "span",
                attrs: { class: "todo-count" },
                children: [
                    { tag: "strong", attrs: {}, children: [String(state.todos.length)] },
                    " items left"
                ]
            },
            {
                tag: "ul",
                attrs: { class: "filters" },
                children: [
                    { tag: "li", attrs: {}, children: [
                        { tag: "a", attrs: { href: "#/", class: "selected" }, children: ["All"] }
                    ]},
                    { tag: "li", attrs: {}, children: [
                        { tag: "a", attrs: { href: "#/active", class: "" }, children: ["Active"] }
                    ]},
                    { tag: "li", attrs: {}, children: [
                        { tag: "a", attrs: { href: "#/completed", class: "" }, children: ["Completed"] }
                    ]}
                ]
            },
            {
                tag: "button",
                attrs: { class: "clear-completed", style: "display: none;" },
                children: []
            }
        ]
    };

    // root section
    return {
        tag: "section",
        attrs: { class: "todoapp" },
        children: [
            headerVNode,
            mainVNode,
            footerVNode
        ]
    };
}

// ---- App Initialization ----

// 1. Initial render
let oldVNode = buildAppVNode(getState());
const appRoot = document.getElementById('app');
let rootDomNode = renderElement(oldVNode);
appRoot.appendChild(rootDomNode);

// 2. UI update function (called on state changes)
function updateUI() {
    const newVNode = buildAppVNode(getState());
    const patchObj = diff(oldVNode, newVNode);
    rootDomNode = patch(appRoot, rootDomNode, patchObj);
    oldVNode = newVNode;
}

// 3. Subscribe UI updates to state changes
subscribe(updateUI);

// 4. Demo: Add a todo when the button is clicked
const button = document.createElement("button");
button.textContent = "Add Todo";
button.onclick = () => {
    addTodo("Todo " + (getState().todos.length + 1));
};
appRoot.appendChild(button);
