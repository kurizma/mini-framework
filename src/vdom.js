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

// Helper: Diff children - FIXED VERSION
function diffChildren(oldChildren = [], newChildren = []) {
  oldChildren = oldChildren || [];
  newChildren = newChildren || [];

  // Simple position-based diffing (more reliable for filtered lists)
  const patches = [];
  const maxLength = Math.max(oldChildren.length, newChildren.length);

  for (let i = 0; i < maxLength; i++) {
    const oldChild = oldChildren[i];
    const newChild = newChildren[i];

    // For keyed elements, check if they're the same item
    if (
      oldChild &&
      newChild &&
      typeof oldChild === "object" &&
      typeof newChild === "object" &&
      oldChild.key &&
      newChild.key
    ) {
      // Same key = update in place
      if (oldChild.key === newChild.key) {
        patches[i] = diff(oldChild, newChild);
      }
      // Different key = replace (this handles filter changes properly)
      else {
        patches[i] = { type: "REPLACE", newVNode: newChild };
      }
    } else {
      // Standard diff for non-keyed or position changes
      patches[i] = diff(oldChild, newChild);
    }
  }

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

// ------

// function diffChildren(oldChildren = [], newChildren = []) {
//     const oldKeyed = {};
//     oldChildren.forEach(child => {
//         if (!child || typeof child !== "object" || child.key == null) {
//             throw new Error("All children must have a unique 'key' property.");
//         }
//         oldKeyed[child.key] = child;
//     });

//     const patches = [];
//     const newKeys = newChildren.map(child => {
//         if (!child || typeof child !== "object" || child.key == null) {
//             throw new Error("All children must have a unique 'key' property.");
//         }
//         return child.key;
//     });

//     newChildren.forEach(newChild => {
//         const oldChild = oldKeyed[newChild.key];
//         patches.push({
//             key: newChild.key,
//             patch: diff(oldChild, newChild)
//         });
//     });

//     Object.keys(oldKeyed).forEach(key => {
//         if (!newKeys.includes(key)) {
//             patches.push({
//                 key,
//                 patch: diff(oldKeyed[key], undefined)
//             });
//         }
//     });

//     return patches;
// }

// // update patch
// case "UPDATE": {
//     if (!domNode) return domNode;

//     // Update attributes
//     patchObj.props.forEach(({ key, value }) => {
//         if (value === undefined) {
//             domNode.removeAttribute(key);
//         } else {
//             domNode.setAttribute(key, value);
//         }
//     });

//     // --- Key-based children patching and reordering ---
//     // Build a map of existing DOM child nodes by key
//     const existingDomNodes = {};
//     Array.from(domNode.childNodes).forEach(child => {
//         if (child.__vdomKey !== undefined) {
//             existingDomNodes[child.__vdomKey] = child;
//         }
//     });

//     let prevDomNode = null;
//     for (let i = 0; i < patchObj.children.length; i++) {
//         const { key, patch: childPatch } = patchObj.children[i];
//         let currentDomNode = existingDomNodes[key];

//         if (childPatch.type === "CREATE") {
//             const newChildDom = renderElement(childPatch.newVNode);
//             newChildDom.__vdomKey = key;
//             domNode.insertBefore(newChildDom, prevDomNode ? prevDomNode.nextSibling : domNode.firstChild);
//             prevDomNode = newChildDom;
//         } else if (childPatch.type === "REMOVE") {
//             if (currentDomNode && currentDomNode.parentNode === domNode) {
//                 domNode.removeChild(currentDomNode);
//             }
//         } else {
//             // UPDATE, TEXT, REPLACE
//             if (currentDomNode) {
//                 patch(domNode, currentDomNode, childPatch);
//                 // Move node if not in correct position
//                 if (currentDomNode !== prevDomNode?.nextSibling) {
//                     domNode.insertBefore(currentDomNode, prevDomNode ? prevDomNode.nextSibling : domNode.firstChild);
//                 }
//                 prevDomNode = currentDomNode;
//             }
//         }
//     }
//     // Remove any extra DOM nodes not in the new children
//     Array.from(domNode.childNodes).forEach(child => {
//         if (child.__vdomKey !== undefined && !patchObj.children.some(p => p.key === child.__vdomKey)) {
//             domNode.removeChild(child);
//         }
//     });

//     return domNode;
// }
