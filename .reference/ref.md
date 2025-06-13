# Direct DOM Approach
## Tree
```
.
├── docs
│   └── README.md
├── package.json
├── src
│   ├── dom.js
│   ├── events.js
│   ├── router.js
│   └── state.js
└── todoMVC
    ├── app.js
    └── index.html

```


1. src/dom.js
    - Purpose:
        Provides functions to create, update, and manage DOM elements programmatically.
    - Example:
        - createElement(type, props, children)
        - Utility to set attributes, classes, and event listeners.

2. src/events.js
    - Purpose:
        - Centralizes event handling logic.
    - Example:
        - Functions to attach/detach event listeners
        - Custom event system or pub/sub for communication between components

3. src/router.js
    - Purpose:
        - Handles client-side routing ( switching between All, Active, Completed views without reloading the page).
    - Example:
        - Listens to hash changes or uses the History API.
        - Calls reder functions for the correct view.

4. src/state.js
    - Purpose:
        - Manages application state (the list of todos, current filter, etc.) and notifies the UI when state changes.
    - Example:
        - Functions to add, remove, update todos.
        - Observer Pattern or simple subscription mechanics for state changes.

--- 

5. todoMVC/index.html
    - Purpose:
        - Minimal HTML file with root element 
        (e.g. <section id="app"></section)
        - Loads your app and framework scripts.

6. todoMVC/app.js
    - Purpose:
        - The entry point for your TodoMVC app.
            - Imports your framework modules(dom.js, state.js, etc.)
            - Sets up the initial UI using your DOM abstraction.
            - Hooks up event listeners (e.g., for adding a todo, toggling completion)
            - Subscribes to state changes and triggers UI re-renders.
            - Integrates routing to switch between filtered views.

--- 

## Example Flow

1. User loads index.html
    - app.js runs, sets up the UI dynamically using dom.js

2. User adds a todo
    - Event handler (from event.js) captures the input
    - Calls a function in state.js to add the new todo.
    - State change triggers a rerender of the todo list via dom.js

3. User clicks a filter (All/Active/Completed)
    - router.js detects the route change
    - Calls for appropriate render logic in app.js to update the view.

4. Any state change (add, toggle, remove)
    - state.js updates the data
    - Notifies the UI to update via a subscription or callback.
    - dom.js functions re-render the relevant parts of the UI.

---

### Comparison to Classic TodoMVC Structure

- Your src/ folder replaces the need for separate models,js, view.js, controller.js, template.js, etc., by grouping similiar functionality (DOM, state, events, routing) into focused modules.

- app.js acts as the glue, orchestrating how these modules work together to create the app.

---

## Summary Table

| Your File             | Classic TodoMVC Equivalent | Responsibility                          |
|-----------------------|---------------------------|------------------------------------------|
| src/dom.js            | view.js, template.js      | UI rendering, DOM manipulation           |
| src/events.js         | controller.js             | Event handling, user interaction         |
| src/state.js          | model.js, store.js        | Data management, state updates           |
| src/router.js         | router.js (if present)    | Routing/filtering logic                  |
| todoMVC/app.js        | app.js                    | App entry, module integration, orchestration |
| todoMVC/index.html    | index.html                | App entry point, root element            |

---


Here’s a detailed, student-friendly breakdown of the four core concepts—DOM, Events, Routing, and State—using plain language and examples:

---

## 1. DOM (Document Object Model)

**What is it?**  
The DOM is a programming interface that represents your web page as a tree of objects, where each HTML element (like ``, ``, etc.) is a node in that tree[2].

**Why is it important?**  
- It lets JavaScript read and change the content, structure, and style of your page after it’s loaded.
- For example, when you add a new todo item, your code creates a new DOM node and inserts it into the page.

**Example:**  
- The HTML `Hello` becomes a DOM node you can access in JS:
  ```js
  const heading = document.querySelector('h1');
  heading.textContent = "Hi there!"; // Changes the text on the page
  ```
- Your `dom.js` module will have functions to create, update, or remove these nodes dynamically.

**Summary:**  
The DOM is the bridge between your HTML and your JavaScript, allowing your code to create interactive, dynamic web pages[2].

---

## 2. Events

**What is an event?**  
An event is anything that happens in the browser that your code might want to react to[3]. This includes things like:
- Clicking a button
- Typing in a text box
- Submitting a form
- Moving the mouse
- The page finishing loading

**How do you use them?**  
You attach an event handler (a function) to an element, so when the event happens, your code runs.

**Example:**  
```js
button.addEventListener('click', function() {
  alert('Button was clicked!');
});
```
- In your `events.js`, you might have functions to help attach these handlers easily.

**Summary:**  
Events let your app respond to user actions and browser changes, making the page interactive[3].

---

## 3. Routing

**What is routing?**  
Routing is how your app decides what to show based on the current "address" or URL. In a Single Page Application (SPA), routing is handled on the client side, so the page doesn’t reload when you move between views[4].

**Why is it useful?**  
- Lets users bookmark or share specific views (like “All”, “Active”, “Completed” in TodoMVC).
- Keeps the app fast and smooth, since only part of the page updates.

**Example:**  
- When a user clicks "Completed," the URL changes (e.g., to `#/completed`), and your app updates the view to show only completed todos.
- Your `router.js` listens for these changes and tells the app what to render.

**Summary:**  
Routing controls what the user sees based on the URL, without reloading the page, making navigation seamless in SPAs[4].

---

## 4. State

**What is state?**  
State is the current data of your app—what todos exist, which ones are completed, what filter is active, etc[5].

**Why is it important?**  
- Your UI should always reflect the current state.
- When state changes (like adding a todo), your app updates the DOM to match.

**Example:**  
- In your `state.js`, you might store an array of todo objects:
  ```js
  let todos = [
    { text: "Learn JS", completed: false },
    { text: "Build a project", completed: true }
  ];
  ```
- When a user checks off a todo, you update the state and re-render the list.

**Summary:**  
State is the data your app is working with right now. State management is about keeping this data in sync with what’s displayed, and updating the UI when the data changes[5].

---

## How They Work Together

- **DOM**: Renders the UI based on the current state.
- **Events**: Listen for user actions and trigger state changes.
- **State**: Holds the data; when it changes, the DOM updates.
- **Routing**: Changes the view based on the URL, possibly filtering the state.

---

**In your framework:**
- `dom.js` handles creating/updating/removing elements.
- `events.js` attaches handlers to respond to user actions.
- `router.js` manages navigation and view switching.
- `state.js` stores and updates your app’s data, and notifies the DOM when changes occur.

This modular approach keeps your code organized and makes it easier to build complex, interactive apps.
<details>
  <summary>Show References</summary>

  [1] https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_84d47f68-8484-43af-b91b-66129a9fd484/578d75c4-0af5-4e1f-beaa-d77687083810/YourFile-ClassicTodoMVCEquivalent-Responsibility.csv  
  [2] https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction  
  [3] https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events  
  [4] https://bholmes.dev/blog/spas-clientside-routing/  
  [5] https://www.reddit.com/r/Frontend/comments/17kyo0v/what_is_state_management/  
  [6] https://www.w3.org/TR/REC-DOM-Level-1/introduction.html  
  [7] https://www.reddit.com/r/webdev/comments/1hmtf5/what_is_a_dom/  
  [8] https://www.reddit.com/r/programming/comments/1fix4h4/what_is_the_dom_the_complete_guide_for_beginner/  
  [9] https://developer.mozilla.org/en-US/docs/Web/API/Event  
  [10] https://www.shecodes.io/athena/58421-when-and-why-should-i-use-event-in-a-function  
  [11] https://www.reddit.com/r/reactjs/comments/k9n9w3/is_routing_really_necessary_for_every_non_trivial/  
  [12] https://blog.risingstack.com/writing-a-javascript-framework-client-side-routing/  
  [13] https://prodo-dev.github.io/state-management/  
  [14] https://github.com/collections/javascript-state-management  
  [15] https://redux.js.org  
  [16] https://www.w3schools.com/js/js_htmldom.asp  
  [17] https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model  
  [18] https://www.digitalocean.com/community/tutorials/introduction-to-the-dom  
  [19] https://www.sencha.com/blog/main-steps-to-use-dom-manipulation-js-framework/  
  [20] https://www.codecademy.com/resources/blog/what-is-dom/  
  [21] https://dev.to/adam_cyclones/working-with-dom-in-a-front-end-framework-f4p  
  [22] https://www.w3schools.com/js/js_events.asp  
  [23] https://www.techtarget.com/searchapparchitecture/definition/event-handler  
  [24] https://www.sencha.com/blog/event-handling-in-javascript-a-practical-guide-with-examples/  
  [25] https://www.codecademy.com/resources/docs/javascript/event-handling  
  [26] https://quix.io/blog/what-why-how-of-event-driven-programming  
  [27] https://developer.mozilla.org/en-US/docs/Web/Events/Event_handlers  
  [28] https://en.wikipedia.org/wiki/Event-driven_programming  
  [29] https://dev.to/thedevdrawer/single-page-application-routing-using-hash-or-url-9jh  
  [30] https://blog.carlosrojas.dev/client-side-routing-in-javascript-creating-smooth-single-page-apps-2e7b2dcc546f  
  [31] https://reactrouter.com/how-to/spa  
  [32] https://www.pluralsight.com/resources/blog/guides/pros-and-cons-of-client-side-routing-with-react  
  [33] https://expressjs.com/en/guide/routing.html  
  [34] https://nextjs.org/docs/app/guides/single-page-applications  
  [35] https://www.telerik.com/blogs/server-side-routing-vs-client-side-routing  
  [36] https://blog.pixelfreestudio.com/top-state-management-libraries-for-2024-a-developers-guide/  
  [37] https://www.linkedin.com/pulse/power-state-deep-dive-management-technopalette-solutions  
  [38] https://study.com/academy/lesson/state-as-a-concept-definition-development-size.html  
  [39] https://30dayscoding.com/blog/state-management-in-javascript  
  [40] https://www.techtarget.com/searchapparchitecture/definition/state-management  
  [41] https://en.wikipedia.org/wiki/State_(polity)  
</details>
