import { 
    renderElement, 
    diff, 
    patch, 
    h,
    getState, 
    subscribe, 
    setFilter,
    setupEventListeners,
    router 
} from "../src/framework.js";

// Function to build the app virtual DOM tree based on state
/**
 * Build the virtual DOM tree for the entire app, based on the current state.
 * @param {Object} state - The current application state (todos, filter, etc.)
 * @returns {Object} - The virtual DOM tree (root node)
 */

function buildAppVNode(state) {
    // Filter todos based on state.filter
    let todosToShow = state.todos;
    if (state.filter === "active") {
        todosToShow = todosToShow.filter(t => !t.completed);
    } else if (state.filter === "completed") {
        todosToShow = todosToShow.filter(t => t.completed);
    }

    // Generate keyed todo <li> items from state.todos
    const todoListItems = todosToShow.map(todo => {
        const isEditing = state.editingId === todo.id;
        return {
            tag: "li",
            key: todo.id, // ✅ This is correct - keeps React-like key optimization
            attrs: {
                "data-id": String(todo.id),
                class: [
                    isEditing ? "editing" : "",
                    todo.completed ? "completed" : ""
                ].filter(Boolean).join(" ")
            },
            children: [
                {
                    tag: "div",
                    attrs: { class: "view" },
                    children: [
                        { 
                            tag: "input", 
                            attrs: { 
                                class: "toggle", 
                                type: "checkbox", 
                                ...(todo.completed ? { checked: "checked" } : {}) // ✅ Fixed: proper checked value
                            },
                            children: [] 
                        },
                        { 
                            tag: "label", 
                            attrs: {}, 
                            children: [todo.text] 
                        },
                        { 
                            tag: "button", 
                            attrs: { class: "destroy" },
                            children: [] 
                        }
                    ]
                },
                // Editing input (only visible in edit mode)
                isEditing ? {
                    tag: "input",
                    attrs: { 
                        class: "edit", 
                        value: todo.text,
                        type: "text" // ✅ Added explicit type
                    },
                    children: []
                } : null
            ].filter(Boolean)
        };
    });

    const headerVNode = {
        tag: "header",
        attrs: { class: "header" },
        children: [
            { tag: "h1", attrs: {}, children: ["todos"] },
            { 
                tag: "input", 
                attrs: { 
                    class: "new-todo", 
                    placeholder: "What needs to be done?", 
                    autofocus: "",
                    type: "text" // ✅ Added explicit type
                }, 
                children: [] 
            }
        ]
    };

    // ✅ Fixed: Only show main section when there are todos
    const mainVNode = state.todos.length > 0 ? {
        tag: "main",
        attrs: { class: "main" },
        children: [
            {
                tag: "input",
                attrs: { 
                    id: "toggle-all",
                    class: "toggle-all", 
                    type: "checkbox"
                },
                children: []
            },
            {
                tag: "label",
                attrs: { 
                    for: "toggle-all",
                    class: "toggle-all-label"
                },
                children: ["Mark all as complete"]
            },
            {
                tag: "ul",
                attrs: { class: "todo-list" },
                children: todoListItems
            }
        ]
    } : null;

    // ✅ Fixed: Only show footer when there are todos
    const footerVNode = state.todos.length > 0 ? {
        tag: "footer",
        attrs: { class: "footer" },
        children: [
            {
                tag: "span",
                attrs: { class: "todo-count" },
                children: [
                    { 
                        tag: "strong", 
                        attrs: {}, 
                        children: [String(state.todos.filter(t => !t.completed).length)] 
                    },
                    ` item${state.todos.filter(t => !t.completed).length === 1 ? '' : 's'} left` // ✅ Fixed pluralization
                ]
            },
            {
                tag: "ul",
                attrs: { class: "filters" },
                children: [
                    { 
                        tag: "li", 
                        attrs: {}, 
                        children: [
                            { 
                                tag: "a", 
                                attrs: { 
                                    href: "#/", 
                                    class: state.filter === "all" ? "selected" : "" 
                                }, 
                                children: ["All"] 
                            }
                        ]
                    },
                    { 
                        tag: "li", 
                        attrs: {}, 
                        children: [
                            { 
                                tag: "a", 
                                attrs: { 
                                    href: "#/active", 
                                    class: state.filter === "active" ? "selected" : ""  
                                }, 
                                children: ["Active"] 
                            }
                        ]
                    },
                    { 
                        tag: "li", 
                        attrs: {}, 
                        children: [
                            { 
                                tag: "a", 
                                attrs: { 
                                    href: "#/completed", 
                                    class: state.filter === "completed" ? "selected" : "" 
                                }, 
                                children: ["Completed"] 
                            }
                        ]
                    }
                ]
            },
            // ✅ Fixed: Only show clear completed when there are completed items
            state.todos.some(t => t.completed) ? {
                tag: "button",
                attrs: { 
                    class: "clear-completed"
                },
                children: ["Clear completed"]
            } : null
        ].filter(Boolean)
    } : null;

    // root section
    return {
        tag: "section",
        attrs: { class: "todoapp" },
        children: [
            headerVNode,
            mainVNode,
            footerVNode
        ].filter(Boolean) // ✅ Filter out null sections
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
    setupEventListeners(appRoot);
}

// 3. Subscribe UI updates to state changes
// "Whenever the state changes, call updateUI to refresh the UI."
subscribe(updateUI);

// event listening for input
setupEventListeners(appRoot);

// Initialize router with filter routes
router.addRoute('/', () => setFilter('all'));
router.addRoute('/active', () => setFilter('active'));
router.addRoute('/completed', () => setFilter('completed'));

// Start router
router.handleRoute();