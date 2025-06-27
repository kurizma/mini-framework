# mini-framework

A lightweight JavaScript framework that demonstrates the core concepts behind modern frontend frameworks—built entirely from scratch, without relying on libraries like React, Vue, or Angular.

## Overview

**Mini-Framework** abstracts the DOM using a virtual DOM system, manages application state centrally, handles routing via URL hash changes, and provides a declarative event handling system. It includes a fully functional TodoMVC example to showcase its features.

## Features

- **Virtual DOM abstraction**
- **Centralized state management**
- **Hash-based routing**
- **Declarative and manual event handling**
- **TodoMVC example implementation**

## Quick Start

1. **Clone the repository.**
2. **Run the TodoMVC Example:**
   ```bash
   npm start
   # or
   python3 -m http.server 8080
   ```
3. **Open** `http://localhost:8080/todoMVC/` in your browser.

## Project Structure

- `index.html` — Base Root
- `app.js` — Main application logic + Entry Point
- `src/` — Framework source code
- `todoMVC/` — Example implementation

## Documentation

For detailed usage instructions, API reference, and code examples, **please see the [documentation](./docs/projectAbstract.md)**.

**Note:**  
This README provides a high-level overview. For in-depth guidance on how to use, extend, or contribute to Mini-Framework, refer to the full documentation.