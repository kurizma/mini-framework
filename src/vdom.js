export function renderElement(node) {
  try {
    if (typeof node === "string") {
      return document.createTextNode(node);
    }

    if (!node || !node.tag) {
      console.warn("Invalid node passed to renderElement:", node);
      return document.createTextNode("");
    }

    const el = document.createElement(node.tag);

    // Handle attributes and events
    for (const [key, value] of Object.entries(node.attrs || {})) {
      if (key.startsWith("on") && typeof value === "function") {
        // Handle event listeners
        const eventName = key.slice(2).toLowerCase();
        el.addEventListener(eventName, value);
      } else {
        el.setAttribute(key, value);
      }
    }

    // render and append children
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach((child) => {
        // Recursively render children
        el.appendChild(renderElement(child));
      });
    }

    return el;
  } catch (error) {
    console.error("Error rendering element:", error, node);
    return document.createTextNode("Render Error");
  }
}

// Diff two virtual DOM nodes and return a patch object describing the change
export function diff(oldVNode, newVNode) {
  // 1. If the old node doesn't exist, create the new node
  if (!oldVNode) {
    return { type: "CREATE", newVNode };
  }
  // 2. If the new node doesn't exist, remove the old node
  if (!newVNode) {
    return { type: "REMOVE" };
  }
  // 3. If both are text nodes and different, update the text
  if (typeof oldVNode === "string" && typeof newVNode === "string") {
    if (oldVNode !== newVNode) {
      return { type: "TEXT", text: newVNode };
    } else {
      return null; // No change
    }
  }
  // 4. If tags/types are different, replace the node
  if (oldVNode.tag !== newVNode.tag) {
    return { type: "REPLACE", newVNode };
  }
  // 5. If tags are the same, diff attributes and children (expand later)
  return {
    type: "UPDATE",
    props: diffProps(oldVNode.attrs, newVNode.attrs),
    children: diffChildren(oldVNode.children, newVNode.children),
  };
}

// Helper: Diff attributes
function diffProps(oldProps = {}, newProps = {}) {
  const patches = [];
  // Removed or changed attributes
  for (const key in oldProps) {
    if (!(key in newProps)) {
      patches.push({ key, value: undefined });
    }
  }
  // Added or changed attributes
  for (const key in newProps) {
    if (oldProps[key] !== newProps[key]) {
      patches.push({ key, value: newProps[key] });
    }
  }
  return patches;
}

// Helper: Diff children
function diffChildren(oldChildren = [], newChildren = []) {
  // If children are undefined, treat as empty array
  oldChildren = oldChildren || [];
  newChildren = newChildren || [];

  // Build key maps for old and new children
  const oldKeyed = {};
  const newKeyed = {};

  oldChildren.forEach((child, i) => {
    if (child && typeof child === "object" && child.key != null) {
      oldKeyed[child.key] = { child, index: i };
    }
  });
  newChildren.forEach((child, i) => {
    if (child && typeof child === "object" && child.key != null) {
      newKeyed[child.key] = { child, index: i };
    }
  });

  // If no keys, fallback to index-based diffing
  const hasKeys =
    Object.keys(oldKeyed).length > 0 || Object.keys(newKeyed).length > 0;
  if (!hasKeys) {
    const patches = [];
    const max = Math.max(oldChildren.length, newChildren.length);
    for (let i = 0; i < max; i++) {
      patches[i] = diff(oldChildren[i], newChildren[i]);
    }
    return patches;
  }

  // Key-based diffing
  const patches = [];
  const usedOldKeys = new Set();

  // Go through new children, match by key
  newChildren.forEach((newChild, i) => {
    if (newChild && typeof newChild === "object" && newChild.key != null) {
      const oldEntry = oldKeyed[newChild.key];
      if (oldEntry) {
        patches[i] = diff(oldEntry.child, newChild);
        usedOldKeys.add(newChild.key);
      } else {
        // New node (not found in old)
        patches[i] = diff(undefined, newChild);
      }
    } else {
      // Fallback for non-keyed nodes
      patches[i] = diff(oldChildren[i], newChild);
    }
  });

  // Any old nodes not present in newChildren should be removed
  oldChildren.forEach((oldChild, i) => {
    if (oldChild && typeof oldChild === "object" && oldChild.key != null) {
      if (!newKeyed[oldChild.key]) {
        // Place a REMOVE patch at the old index
        patches[i] = diff(oldChild, undefined);
      }
    }
  });

  return patches;
}

// ----------------------------- //

// Patch: Apply a patch object to the real DOM
export function patch(parent, domNode, patchObj, index = 0) {
  if (!patchObj) return domNode;

  try {
    switch (patchObj.type) {
      case "CREATE": {
        const newDom = renderElement(patchObj.newVNode);
        parent.appendChild(newDom);
        return newDom;
      }
      case "REMOVE": {
        if (domNode && domNode.parentNode === parent) {
          parent.removeChild(domNode);
        }
        return null;
      }
      case "TEXT": {
        if (domNode && domNode.nodeType === Node.TEXT_NODE) {
          domNode.textContent = patchObj.text;
        }
        return domNode;
      }
      case "REPLACE": {
        const newDom = renderElement(patchObj.newVNode);
        if (domNode && domNode.parentNode === parent) {
          parent.replaceChild(newDom, domNode);
        }
        return newDom;
      }
      case "UPDATE": {
        if (!domNode) return domNode;

        // Update attributes
        patchObj.props.forEach(({ key, value }) => {
          if (value === undefined) {
            domNode.removeAttribute(key);
          } else {
            domNode.setAttribute(key, value);
          }
        });

        // Patch children (key-based)
        const childNodes = Array.from(domNode.childNodes);
        let domChildIndex = 0;

        for (let i = 0; i < patchObj.children.length; i++) {
          const childPatch = patchObj.children[i];
          const oldChildNode = childNodes[domChildIndex];

          // If patch is a CREATE, insert new node
          if (childPatch && childPatch.type === "CREATE") {
            const newChildDom = renderElement(childPatch.newVNode);
            domNode.insertBefore(newChildDom, oldChildNode || null);
            domChildIndex++;
          }
          // If patch is a REMOVE, remove the node
          else if (childPatch && childPatch.type === "REMOVE") {
            if (oldChildNode && oldChildNode.parentNode === domNode) {
              domNode.removeChild(oldChildNode);
            }
            // Do not increment domChildIndex since node was removed
          }
          // Otherwise, patch the existing node
          else {
            if (oldChildNode) {
              patch(domNode, oldChildNode, childPatch, i);
            }
            domChildIndex++;
          }
        }

        // Remove any extra old nodes
        while (domNode.childNodes.length > patchObj.children.length) {
          const last = domNode.lastChild;
          if (last && last.parentNode === domNode) {
            domNode.removeChild(last);
          } else {
            break;
          }
        }
        return domNode;
      }
      default:
        console.warn("Unknown patch type:", patchObj.type);
        return domNode;
    }
  } catch (error) {
    console.error("Error applying patch:", error, patchObj);
    return domNode;
  }
}
