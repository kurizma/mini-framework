import { 
    renderElement, 
    diff, 
    patch, 
    createVNode,
    getState, 
    subscribe, 
    setFilter,
    setupEventListeners,
    router 
} from "../src/framework.js";

// createVNode(tag, attrs = {}, children = [])
// Root Node - static
function buildRootVNode(state) {
    return [
        // aside
        createVNode("aside", { class: "learn" }, [
            createVNode("header", {}, [
                createVNode("h3", {}, ["JavaScript ES6"]),
                createVNode("span", { class: "source-links" }, [
                    createVNode("h5", {}, ["Example"]),
                    createVNode("a", { href: "https://github.com/tastejs/todomvc/tree/gh-pages/examples/javascript-es6" 
                    }, ["Source"])
                ])
            ]),
            createVNode("hr"),
            createVNode("blockquote", { class: "quote speech-bubble" }, [
                createVNode("p", {}, [
                    "The ECMAScript 6 (ES2015) standard was ratified in 2015 following years of work standardizing improvements to ECMAScript 3. The committee introduced a wide variety of improvements such as arrow functions, const declarations, and native Promises."
                ]),
                createVNode("footer", {}, [
                    createVNode("a", { href: "http://developer.mozilla.org/en-US/docs/JavaScript" }, ["JavaScript ES6"])
                ])
            ]),
            createVNode("footer", {}, [
                createVNode("hr"),
                createVNode("em", {}, [
                    'If you have other helpful links to share, or find any of the links above no longer work, please ',
                    createVNode('a', { href:"https://github.com/tastejs/todomvc/issues" }, ["let us know"]),
                    '.'
                ])
            ])
        ]),
        // main App (dynamic)
        buildAppVNode(state),

        // info footer
        createVNode("footer", { class: "info" }, [
            createVNode("p", {}, ["Double-click to edit a todo"]),
            createVNode("p", {}, ["Created by the JOGA Team"]),
            createVNode("p", {}, [
                "Part of ",
                createVNode("a", { href: "http://todomvc.com" }, ["JOGA"])
            ])
        ])
    ];
}

/// ------------ /// 
// main app vnode
function buildAppVNode(state) {
    let todosToShow = state.todos;
    if (state.filter === "active") {
        todosToShow = todosToShow.filter(t => !t.completed);
    } else if (state.filter === "completed") {
        todosToShow = todosToShow.filter(t => t.completed);
    }

    const todoListItems = todosToShow.map(todo => {
        const isEditing = state.editingId === todo.id;
        const children = [
            createVNode("div", { class: "view" }, [
                createVNode("input", {
                    class: "toggle",
                    type: "checkbox",
                    ...(todo.completed ? { checked: "checked" } : {})
                }),
                createVNode("label", {}, [todo.text]),
                createVNode("button", { class: "destroy" })
            ])
        ];
        if (isEditing) {
            children.push(
                createVNode("input", {
                    class: "edit",
                    value: todo.text,
                    type: "text"
                })
            );
        }
        return createVNode("li", {
            "data-id": String(todo.id),
            class: [
                isEditing ? "editing" : "",
                todo.completed ? "completed" : ""
            ].filter(Boolean).join(" ")
        }, children);
    });

    const headerVNode = createVNode("header", { class: "header" }, [
        createVNode("h1", {}, ["todos"]),
        createVNode("input", {
            class: "new-todo",
            placeholder: "What needs to be done?",
            autofocus: ""
        })
    ]);

    const mainVNode = createVNode("main", {
        class: "main",
        style: state.todos.length === 0 ? "display: none;" : undefined
    }, [
        createVNode("div", { class: "toggle-all-container" }, [
            createVNode("input", { class: "toggle-all", type: "checkbox" }),
            createVNode("label", { class: "toggle-all-label", for: "toggle-all" }, ["Mark all as complete"])
        ]),
        createVNode("ul", { class: "todo-list" }, todoListItems)
    ]);

    // Build filters
    const filters = [
        createVNode("li", {}, [
            createVNode("a", {
                href: "#/",
                class: state.filter === "all" ? "selected" : ""
            }, ["All"])
        ]),
        createVNode("li", {}, [
            createVNode("a", {
                href: "#/active",
                class: state.filter === "active" ? "selected" : ""
            }, ["Active"])
        ]),
        createVNode("li", {}, [
            createVNode("a", {
                href: "#/completed",
                class: state.filter === "completed" ? "selected" : ""
            }, ["Completed"])
        ])
    ];

    // Build footer children    
    const hasCompleted = state.todos.some(t => t.completed);

    const footerChildren = [
        createVNode("span", { class: "todo-count" }, [
            createVNode("strong", {}, [String(state.todos.filter(t => !t.completed).length)]),
            ` item${state.todos.filter(t => !t.completed).length === 1 ? '' : 's'} left`
        ]),
        createVNode("ul", { class: "filters" }, [
            createVNode("li", {}, [
                createVNode("a", {
                    href: "#/",
                    class: state.filter === "all" ? "selected" : ""
                }, ["All"])
            ]),
            createVNode("li", {}, [
                createVNode("a", {
                    href: "#/active",
                    class: state.filter === "active" ? "selected" : ""
                }, ["Active"])
            ]),
            createVNode("li", {}, [
                createVNode("a", {
                    href: "#/completed",
                    class: state.filter === "completed" ? "selected" : ""
                }, ["Completed"])
            ])
        ]),
        // Always include the button, toggle visibility with style
        createVNode("button", {
            class: "clear-completed",
            style: hasCompleted ? "display: block" : "display: none;"
        },  hasCompleted ? ["Clear completed"] : [])
    ];

    const footerVNode = createVNode("footer", {
        class: "footer",
        style: state.todos.length === 0 ? "display: none;" : undefined
    }, footerChildren);


    return createVNode("section", { class: "todoapp" }, [
        headerVNode,
        mainVNode,
        footerVNode
    ]);
}

/// ------------ /// 

// ---- App Initialization ----

// 1. Initial render
console.log('Root VNode:', buildRootVNode(getState()));
let oldVNode = buildRootVNode(getState());
const appRoot = document.body;
let rootDomNode = renderElement(oldVNode);
console.log('Rendered DOM:', rootDomNode);
appRoot.appendChild(rootDomNode);

// 2. UI update function (called on state changes)
function updateUI() {
    const newVNode = buildRootVNode(getState());
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




