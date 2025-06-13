## **Why is State Important in Virtual DOM Apps?

- **State is the source of truth:** All UI updates should be driven by state, not by direct DOM manipulation.

- **Separation of conerns:** You keep your data (state) and UI logic (rendering) separate, making your code easier to maintain and reason about.

- **Efficient Updates:** By tracking state and re-rendering the virtual DOM when it changes, you ensure your UI is always up-to-date with minimal DOM operations.

## How is State Managed?

- **Centralized State:** You can keep all your app state (the list of todos, filter, etc.) in a single object or module.

- **State triggers updates:** When you modify the state, you re-run your render function to get a new virtual DOM, then use diff and patch to updae the real DOM.