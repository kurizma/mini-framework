# Virtual DOM Approach

## Tree
```
    .
├── docs
│   └── README.md
├── package.json
├── src
│   ├── vdom.js    
│   ├── router.js
│   └── state.js
└── todoMVC
    ├── app.js
    └── index.html
```

### Structure

1. src/vdom.js
- Purpose:
    - Provides functions to create virtual DOM nodes (plain JS objects representing elements).
    - Contains logic to diff (compare) old and new virtual DOM trees and patch (update) the real DOM efficiently.
- Example:
    - h(type, props, children) – creates a virtual node.
    - render(vNode) – turns a virtual node into a real DOM node.
    - diff(oldVNode, newVNode) – finds changes between two virtual DOM trees.
    - patch($root, patches) – applies the changes to the real DOM.

- Sample Code:
```
// Create a virtual node
const vNode = h('li', { class: 'todo-item' }, ['Learn Virtual DOM']);

// Render to real DOM
const $li = render(vNode);

```

2. src/events.js
- Purpose:
    - Centralizes event handling logic
    - Attaches event listeners to real DOM nodes after rendering.
- Example: 
    - Functions to attach/deatch event listeners.
    - Event delegation may be used for efficiency.

3. src/router.js
- Purpose:
    - Handles client-side routing ( switching between All, Active, Completed views without reloading the page)
    - Triggers a re-render of the virtual DOM tree when route changes.
- Example:
    - Listens to hash changes or uses the History API
    - Calls a function in app.js to generate a new virtual DOM tree for the current route.

4. src/state.js
- Purpose:
    - Manages application state (the list of todos, current filter, etc.)
    - When state changes, triggers a re-render by generating a new virtual DOM tree and diffing it against the previous one.
- Example:
    - Functions to add, remove, update todos.
    - Observers pattern or subscription mechanism to notify the app to re-render

--- 

5. todoMVC/index.html
- Purpose: 
    - Minimal HTML file with a root element (e.g. <sectin id="app"></section>).
    - Loads your app and framework scripts.

6. todoMVC/app.js
- Purpose: 
    - Entry point for your TodoMVC app.
    - Imports your framework modules (vdom.js, state.js, etc.)
    - Descrubes the UI as a virtual DOM tree using h() or similiar.
    - On state or route changes, generates a new virtual DOM tree, diffs it with the previous tree, and patches the real DOM.
    - Hooks up event listeners after rendering.

--- 

## Sample Flow
```
import { h, render, diff, patch } from '../src/vdom.js';

let oldVNode = null;
let rootNode = document.getElementById('app');

function renderApp(state) {
    const newVNode = h('ul', {}, state.todos.map(todo =>
        h('li', { class: 'todo-item' }, [todo.text])
    ));
    if (oldVNode) {
        const patches = diff(oldVNode, newVNode);
        rootNode = patch(rootNode, patches);
    } else {
        rootNode.appendChild(render(newVNode));
    }
    oldVNode = newVNode;
}

```

## Example Flow (Virtual DOM)

1. **User loads index.html**
    - `app.js` creates an initial virtual DOM tree and renders it to the real DOM.

2. **User adds a todo**
    - Event handler updates state.
    - State change triggers creation of a new virtual DOM tree.
    - The framework diffs the new tree with the old one and patches the real DOM with only the necessary changes.

3. **User clicks a filter (All/Active/Completed)**
    - `router.js` detects the route change.
    - Triggers re-render of the virtual DOM for the new view.

4. **Any state change (add, toggle, remove)**
    - `state.js` updates the data.
    - Notifies the app to generate a new virtual DOM tree and update the real DOM efficiently.

---

### Comparison Table (Updated)

| Your File         | Classic TodoMVC Equivalent | Responsibility                                 |
|-------------------|---------------------------|------------------------------------------------|
| src/vdom.js       | view.js, template.js      | Virtual DOM creation, diffing, patching         |
| src/events.js     | controller.js             | Event handling, user interaction                |
| src/state.js      | model.js, store.js        | Data management, state updates                  |
| src/router.js     | router.js (if present)    | Routing/filtering logic                         |
| todoMVC/app.js    | app.js                    | App entry, module integration, orchestration    |
| todoMVC/index.html| index.html                | App entry point, root element                   |

---

## Key Differences from Direct DOM

- **UI is described as virtual DOM trees (JS objects), not created directly in the real DOM**.
- **Rendering is handled by diffing and patching, not by clearing and rebuilding DOM nodes**.
- **State and route changes trigger virtual DOM updates, which are efficiently synced to the real DOM**.

---