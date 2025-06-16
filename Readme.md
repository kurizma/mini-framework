# Mini-Framework

A lightweight virtual DOM framework with state management, routing, and event handling.

## Features

- **Virtual DOM**: Efficient diff/patch algorithm with key-based optimization
- **State Management**: Centralized, immutable state with reactive updates
- **Routing**: Hash-based routing system
- **Event Handling**: Declarative event management with delegation

## Quick Start

```javascript
import { h, renderElement, getState, subscribe } from './src/index.js';

// Create virtual DOM
const vnode = h('div', { class: 'app' }, [
    h('h1', {}, ['Hello World']),
    h('button', { onclick: 'handleClick' }, ['Click me'])
]);

// Render to DOM
const element = renderElement(vnode);
document.body.appendChild(element);
```

## API Reference

### Virtual DOM

#### `h(tag, attrs, children)`
Creates a virtual DOM node.
- `tag`: HTML tag name
- `attrs`: Object of attributes
- `children`: Array of child nodes or text

#### `renderElement(vnode)`
Converts virtual DOM to real DOM elements.

#### `diff(oldVNode, newVNode)`
Compares two virtual DOM trees and returns patches.

#### `patch(parent, domNode, patches)`
Applies patches to update the real DOM.

### State Management

#### `getState()`
Returns the current application state.

#### `subscribe(listener)`
Subscribes to state changes. Returns unsubscribe function.

#### State Actions
- `addTodo(text)` - Add new todo
- `toggleTodo(id)` - Toggle todo completion
- `removeTodo(id)` - Remove todo
- `setFilter(filter)` - Set filter ('all', 'active', 'completed')

### Routing

#### `router.addRoute(path, handler)`
Register a route handler.

#### `router.navigate(path)`
Navigate to a route programmatically.

### Event Handling

#### `setupEventListeners(element)`
Sets up event delegation for the application.

## Architecture

This framework follows the Virtual DOM pattern:

1. **State** drives everything - all UI updates come from state changes
2. **Virtual DOM** represents the desired UI state as JavaScript objects
3. **Diff** algorithm finds minimal changes between old and new virtual DOM
4. **Patch** applies only the necessary changes to the real DOM

## TodoMVC Example

See the `todoMVC/` directory for a complete example implementation.

## Running the TodoMVC Example

```bash
npm start
# or
python3 -m http.server 8000
```

Then open http://localhost:8000/todoMVC/