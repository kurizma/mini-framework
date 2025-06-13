## Diff-ing / Patching

### What is a diff?
- **Diff** is the process of comparaing the told virtual DOM tree to find out what has changed
- The diff function returns a list or object "patches" - instructions describing exactly what needs to change in the real DOM to make it match the new virtual DOM
- **Diff does NOT change the real DOM itself.**  It just figures out what would need to change.

- Example:
    - If only the next of a node changed, the diff will say: "update the text here"
    - If an element was remove, the diff will say: "remove this node."

--- 

### What is patch?
- **Patch** is the process of applying those patches (the instructs from diff) to the real DOM
- The **patch function** takes the real DOM node and the patches, and updates the DOM so it matches the new virtual DOM
- **Patching is when the actual changes happen in the browser.**

- Example:
    - If the diff said "update the text," patch will actually set the .textContent of that DOM node.
    - If the diff said "replace this node," patch will use replaceChild to swap out the DOM node.

--- 

### Why Seperate Diff and Patch?
- **Separation of concerns:** Diffing is about figuring out what needs to change; patching is about actually making those changes.
- This makes updates more efficient: you can batch changes and only touch the real DOM as little as possible, which is much faster than rebuilding everything.
- This pattern is used by all major virtual DOM frameworks (React, Vue, etc.)

### In summary:
1. Diff = detect differences between old and new vritual DOM trees.
2. Patch = apply those differences to the real DOM (make the changes)
- This two-step process is what makes virtual DOM frameworks efficient and declarative.



