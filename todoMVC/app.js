import {
    renderElement,
    diff,
    patch,
    createVNode,
    getState,
    subscribe,
    setFilter,
    setupEventListeners,
    router,
} from "../src/framework.js";

// createVNode(tag, attrs = {}, children = [])
// building root virtual DOM node for the entire app
function buildRootVNode(state) {
    // returning a vnode for <body> with all app sections are children
    return createVNode("body", { class: "learn-bar" }, [
        // aside
        createVNode("aside", { class: "learn" }, [
        createVNode("header", {}, [
            createVNode("h3", {}, ["mini-framework"]),
            createVNode("span", { class: "source-links" }, [
            // createVNode("h5", {}, ["Example"]),
            createVNode(
                "a",
                { href: "https://github.com/kurizma/mini-framework" },
                ["Source"]
            ),
            ]),
        ]),
        createVNode("hr"),
        createVNode("blockquote", { class: "quote speech-bubble" }, [
            createVNode("p", {}, [
            "This mini-framework project challenges you to build a modern JavaScript web application framework from scratch—no React, Vue, or Angular allowed. It demonstrates core features like virtual DOM rendering, state management, custom event handling, and client-side routing, all implemented by hand. The TodoMVC example here is built entirely on this framework, showing how you can compose UI, manage state, and handle user interactions with just a few simple abstractions.",
            ]),
            createVNode("footer", {}, [
            createVNode(
                "a",
                {
                href: "https://github.com/01-edu/public/tree/master/subjects/mini-framework",
                },
                ["mini-framework"]
            ),
            ]),
        ]),
        createVNode("footer", {}, [
            createVNode("hr"),
            createVNode("em", {}, [
            "If you have other helpful links to share, or find any of the links above no longer work, please ",
            createVNode(
                "a",
                { href: "https://github.com/kurizma/mini-framework/issues" },
                ["let us know"]
            ),
            ".",
            ]),
        ]),
        ]),

        // main App (dynamic)
        buildAppVNode(state),

        // info footer
        createVNode("footer", { class: "info" }, [
            createVNode("p", {}, ["Double-click to edit a todo"]),
            createVNode("p", {}, ["Created by the JOGA Team"]),
            createVNode("p", {}, [
                createVNode("a", { href: "https://github.com/kurizma" }, ["Joon Kim"]),
                createVNode("a", { href: "https://github.com/oafilali" }, [
                "Othmane Afilali",
                ]),
                createVNode("a", { href: "https://github.com/gigiAddams" }, [
                "Geraldine Addamo",
                ]),
                createVNode("a", { href: "https://github.com/AllenLeeyn" }, [
                "Allen Leeyn",
                ]),
            ]),
        ]),
    ]);
}

/// ------------ ///

// main app todoMVC section based on the curren state
// dynamic handling of changes
function buildAppVNode(state) {
    // filter todos based on current filter state
    let todosToShow = state.todos;
    if (state.filter === "active") {
        todosToShow = todosToShow.filter((t) => !t.completed);
    } else if (state.filter === "completed") {
        todosToShow = todosToShow.filter((t) => t.completed);
    }

    // mapping todo to <li> virtual nodes
    const todoListItems = todosToShow.map((todo) => {
        const isEditing = state.editingId === todo.id;
        const children = [
        // todo item view
        createVNode("div", { class: "view" }, [
            createVNode("input", {
            class: "toggle",
            type: "checkbox",
            // Only add checked when actually completed
            ...(todo.completed ? { checked: "checked" } : {}),
            }),
            createVNode("label", {}, [todo.text]),
            createVNode("button", { class: "destroy" }),
        ]),
        ];
        // if editing, add input field
        if (isEditing) {
        children.push(
            createVNode("input", {
            class: "edit",
            value: todo.text,
            type: "text",
            })
        );
        }
        // return <li> vnode for todo list
        return createVNode(
        "li",
        {
            "data-id": String(todo.id),
            class: [isEditing ? "editing" : "", todo.completed ? "completed" : ""]
            .filter(Boolean)
            .join(" "),
        },
        children,
        todo.id
        );
    });

    // header (title + input)
    const headerVNode = createVNode("header", { class: "header" }, [
        createVNode("h1", {}, ["todos"]),
        createVNode("input", {
        class: "new-todo",
        placeholder: "What needs to be done?",
        autofocus: "",
        }),
    ]);

    // main section (toggle-all + todo list)
    const mainVNode = createVNode(
        "main",
        {
        class: "main",
        style: state.todos.length === 0 ? "display: none;" : "display: block",
        },
        [
        createVNode("div", { class: "toggle-all-container" }, [
            createVNode("input", {
            class: "toggle-all",
            type: "checkbox",
            id: "toggle-all", 
            ...(state.todos.length > 0 && state.todos.every((t) => t.completed)
                ? { checked: "checked" }
                : {}),
            }),
            createVNode("label", { class: "toggle-all-label", for: "toggle-all" }, [
            "Mark all as complete",
            ]),
        ]),
        createVNode("ul", { class: "todo-list" }, todoListItems),
        ]
    );

    // Build footer section (itms left, filters, clear completed button)
    const hasCompleted = state.todos.some((t) => t.completed);

    const footerChildren = [
        // n items left
        createVNode("span", { class: "todo-count" }, [
        createVNode("strong", {}, [
            String(state.todos.filter((t) => !t.completed).length),
        ]),
        ` item${
            state.todos.filter((t) => !t.completed).length === 1 ? "" : "s"
        } left`,
        ]),
        // filter links (all, active, completed)
        createVNode("ul", { class: "filters" }, [
        createVNode("li", {}, [
            createVNode(
            "a",
            {
                href: "#/",
                class: state.filter === "all" ? "selected" : "",
            },
            ["All"]
            ),
        ]),
        createVNode("li", {}, [
            createVNode(
            "a",
            {
                href: "#/active",
                class: state.filter === "active" ? "selected" : "",
            },
            ["Active"]
            ),
        ]),
        createVNode("li", {}, [
            createVNode(
            "a",
            {
                href: "#/completed",
                class: state.filter === "completed" ? "selected" : "",
            },
            ["Completed"]
            ),
        ]),
        ]),
        // always include the button, toggle visibility with style
        createVNode(
        "button",
        {
            class: "clear-completed",
            style: hasCompleted ? "display: block" : "display: none;",
        },
        hasCompleted ? ["Clear completed"] : []
        ),
    ];

    // build the footer with the previous "footerChildren"
    const footerVNode = createVNode(
        "footer",
        {
        class: "footer",
        style: state.todos.length === 0 ? "display: none;" : "display: block",
        },
        footerChildren
    );

    // return the combination of vnodes
    return createVNode("section", { class: "todoapp" }, [
        headerVNode,
        mainVNode,
        footerVNode,
    ]);
}

/// ------------ ///

// ---- App Initialization ----

// 1. build initial virtual DOM tree from state default
let oldVNode = buildRootVNode(getState());
const appRoot = document.documentElement; // <html>; parent
let rootDomNode = renderElement(oldVNode); // render initial app into  <body>

// 2. UI update function (called on state changes; patch DOM)
function updateUI() {
    const newVNode = buildRootVNode(getState());
    const patchObj = diff(oldVNode, newVNode);
    rootDomNode = patch(appRoot, rootDomNode, patchObj); // patch <body> on <html>
    oldVNode = newVNode;
    setupEventListeners(appRoot); // re-attach event listeners
}

// 3. Subscribe UI updates to state changes
// "Whenever the state changes, call updateUI to refresh the UI."
subscribe(updateUI);

// attach event listeners for the first render
setupEventListeners(rootDomNode);

// init + setup routing for filter changes
router.addRoute("/", () => setFilter("all"));
router.addRoute("/active", () => setFilter("active"));
router.addRoute("/completed", () => setFilter("completed"));

// Start router to handle initial route
router.handleRoute();
