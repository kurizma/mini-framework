# mini-framework


## Overview
This project is a simple to-do application built using a custom JavaScript framework all implemented from scratch without importing any libraries like React or Vue. This project as a foundation for exploring how frontend frameworks work under the hood, or as a base for building more advanced applications using your own tooling.


## Framework Features


- Virtual DOM System
   - Uses createVNode(tag, attrs, children) to define virtual nodes.
   - Nodes can represent HTML tags, attributes, event handlers, and children.
   - Supports optional key for diffing optimization.


- Custom Renderer
   - renderElement(vnode) recursively transforms VNodes into real DOM elements.
   - Handles attributes, event listeners, and nested children.


- DOM Event Handling
   - Automatically binds events through virtual DOM (onClick, onChange, etc.).
   - Event listeners are parsed from VNode attributes.


- Manual DOM Event Binding Support
   - Adds listeners post-render for specific DOM targets (e.g., .todo-list, .new-todo).
   - Separate file (events.js) manages additional manual handlers.


- Element Nesting
   - Child elements are created by passing an array of VNodes in the children argument.
   - Deep nesting supported (e.g., headers containing inputs and headings).
   - Rendering function processes child arrays recursively.


## How to Create an Element in the Mini-Framework


Creating an element in the mini-framework involves defining a virtual DOM node using the `createVNode` function. This function allows you to specify the tag, attributes, and children of the element you want to create. Below is a step-by-step guide on how to use this function effectively.


### Step 1: Import the `createVNode` Function


Before you can create an element, ensure that you import the `createVNode` function from the framework:


```javascript
import { createVNode } from 'mini-framework';
```


### Step 2: Define the Virtual DOM Node


You can create a virtual DOM node by calling the `createVNode` function. The function takes the following parameters:


- **tag**: A string representing the HTML tag (e.g., 'div', 'span', 'button').
- **attrs**: An object containing the attributes you want to set on the element (e.g., `class`, `id`, `onClick`).
- **children**: An array of child nodes, which can be strings (text nodes) or other virtual DOM nodes.
- **key** (optional): A unique key for the node, useful for diffing.


### Example


Here’s an example of creating a simple button element:


```javascript
   createVNode(
     "button",
     {
       class: "clear-completed",
       style: hasCompleted ? "display: block" : "display: none;",
     },
     hasCompleted ? ["Clear completed"] : []
   ),
```


In this example:
- The tag is `'button'`.
- The attributes include a class and an event handler for the click event.
- The children consist of a single text node, `'Click Me'`.


## Step 3: Render the Element


Once you have defined your virtual DOM node, you can render it into the real DOM using the `renderElement` function:


```javascript
const appRoot = document.getElementById('app');
const renderedButton = renderElement(button);
appRoot.appendChild(renderedButton);
```


## How to Create an Event in the Mini-Framework


This mini-framework creates and handles events in two main ways:


### 1. DOM Event Listeners in the Virtual DOM


In vdom.js, when rendering elements, the framework checks for attributes that start with on (like onclick, onchange, etc.) and automatically attaches them as event listeners:


Here's an example:


```javascript
for (const [key, value] of Object.entries(node.attrs || {})) {
   if (key.startsWith("on") && typeof value === "function") {
       const eventName = key.slice(2).toLowerCase();
       el.addEventListener(eventName, value);
   } else {
       el.setAttribute(key, value);
   }
}
```


### 2. Manual Event Listener Setup


In events.js, the framework sets up event listeners directly on DOM elements after rendering.
For example, it attaches handlers for clicks, keydowns, changes, etc., on elements like .todo-list and .new-todo:


Here's an example:


```javascript
input.addEventListener('keydown', input._todoKeyHandler);
todoList.addEventListener("click", handleTodoListClick);
todoList.addEventListener("change", handleTodoListChange);
```


These handlers then call state management functions or update the UI.


## How Elements are Nested


Nesting elements in this mini-framework is handled through the children property of the virtual node objects, as defined in createVNode and rendered by the renderElement function in vdom.js.




### 1. Creating Nested Elements


You create a virtual node (VNode) for each element. To nest elements, pass an array of child VNodes as the children argument:


```javascript
// Example: Nesting a <header> with <h1> children
const headerVNode = createVNode("header", { class: "header" }, [
   createVNode("h1", {}, ["todos"]),
   createVNode("input", {
     class: "new-todo",
     placeholder: "What needs to be done?",
     autofocus: "",
   }),
 ]);
```


### 2. How Nesting is Rendered


The renderElement function in vdom.js recursively renders each node and its children:


```javascript
if (node.children && Array.isArray(node.children)) {
   node.children.forEach((child) => {
       if (child === undefined || child === null) return;
           el.appendChild(renderElement(child));
       });
   }
   return el;
```

## State Management

A global state object holds the entire application state. Any action that modifies the state triggers a re-render.

```javascript
let state = {
  todos: [],
  filter: "all"
};

function setState(newState) {
  state = { ...state, ...newState };
  renderApp();
}
```

## Routing System

Simple routing is achieved by syncing the app state with the URL using the hashchange event. This lets users navigate to #/active, #/completed, etc., and updates the visible todos based on the URL.

```javascript
window.addEventListener("hashchange", () => {
  const route = location.hash.replace("#/", "");
  setState({ filter: route });
});
```

## Getting Started: Clone and Run the TodoMVC Example

```bash
npm start
# or
python3 -m http.server 8000
```

Then open http://localhost:8000/todoMVC/
