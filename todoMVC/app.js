import { renderElement } from "../src/vdom.js";

// mainVNode.js (or inline in app.js)
const mainVNode = {
    tag: "main",
    attrs: { class: "main", style: "display: none;" }, // hidden when no todos
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
    attrs: { class: "footer", style: "display: none;" },
    children: [
        {
        tag: "span",
        attrs: { class: "todo-count" },
        children: [
            { tag: "strong", attrs: {}, children: ["0"] },
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

const appVNode = {
    tag: "section",
    attrs: { class: "todoapp" },
    children: [
        headerVNode,
        mainVNode,
        footerVNode
    ]
};


const appRoot = document.getElementById('app');
const domTree = renderElement(appVNode);
appRoot.appendChild(domTree);