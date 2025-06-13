import { renderElement, diff, patch } from "../src/vdom.js";

// Function to build the app virtual DOM tree based on state
function buildAppVNode(todoCount) {

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
                children: []
            }
        ]
    };

    const headerVNode = {
        tag: "header",
        attrs: { class: "header" },
        children: [
            { tag: "h1", attrs: {}, children: ["todos"] },
            { tag: "input", attrs: { class: "new-todo", placeholder: "What needs to be done?", autofocus: "" }, children: [] }
        ]
    };

    const footerVNode = {
        tag: "footer",
        attrs: { class: "footer", style: "display: block;" },
        children: [
            {
                tag: "span",
                attrs: { class: "todo-count" },
                children: [
                    { tag: "strong", attrs: {}, children: [String(todoCount)] },
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

// Initial state
let todoCount = 0;
let oldVNode = buildAppVNode(todoCount);

const appRoot = document.getElementById('app');
let rootDomNode = renderElement(oldVNode);
appRoot.appendChild(rootDomNode);

// Example: Update the UI when a button is clicked
const button = document.createElement("button");
button.textContent = "Add Todo";
button.onclick = () => {
    todoCount++;
    const newVNode = buildAppVNode(todoCount);
    const patchObj = diff(oldVNode, newVNode);
    rootDomNode = patch(appRoot, rootDomNode, patchObj);
    oldVNode = newVNode;
};
appRoot.appendChild(button);
