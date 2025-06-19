/**
 * Recursively renders a virtual DOM node (string, array, or object) into a real DOM node.
 * - Strings become TextNodes.
 * - Arrays become DocumentFragments (for fragments/multiple siblings).
 * - Objects become DOM elements.
 * - Invalid nodes are handled gracefully with warnings.
 */
export function renderElement(node) {
    console.log('renderElement called with node:', node);
    try {
        // string handling
        if (typeof node === "string") {
            return document.createTextNode(node);
        }

        // Disallow arrays as root node
        if (Array.isArray(node)) {
            console.warn("Arrays are not allowed as root nodes in renderElement:", node);
            return document.createTextNode("");
        }

        if (!node || !node.tag) {
            console.warn("Invalid node passed to renderElement:", node);
            return document.createTextNode("");
        }

        // Special handling for <body>
        let el;
        if (node.tag === "body") {
            el = document.body; // Use the existing body
            
            for (const [key, value] of Object.entries(node.attrs || {})) {
                if (key.startsWith("on") && typeof value === "function") {
                    const eventName = key.slice(2).toLowerCase();
                    el.addEventListener(eventName, value);
                } else {
                    el.setAttribute(key, value);
                }
            }

            // Remove all existing children before re-rendering
            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }
        } else {
            el = document.createElement(node.tag);

            for (const [key, value] of Object.entries(node.attrs || {})) {
                if (key.startsWith("on") && typeof value === "function") {
                    const eventName = key.slice(2).toLowerCase();
                    el.addEventListener(eventName, value);
                } else {
                    el.setAttribute(key, value);
                }
            }
        }

        // render and append children
        if (node.children && Array.isArray(node.children)) {
            node.children.forEach((child) => {
                if (child === undefined || child === null) return;
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
// the patch object will be used by `patch` to update the real DOM
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

// Helper: Diff attributes/props between two virtual DOM nodes.
// returns an array of changes to be applied.

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
// Handles both keyed and non-keyed children.
// uses position-based diffing by default, with key support for more reliable updates.

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

// Patch: Apply a patch object (from `diff`) to the real DOM
// handles all patch types (CREATE, REMOVE, TEXT, REPLACE, UPDATE) and is recursive for children.
// see below `patch` to see helper function

export function patch(parent, domNode, patchObj, index = 0) {
    if (!patchObj) return domNode;
    try {
        switch (patchObj.type) {
            case "CREATE":
                return patchCreate(parent, patchObj);
            case "REMOVE":
                return patchRemove(parent, domNode);
            case "TEXT":
                return patchText(domNode, patchObj);
            case "REPLACE":
                return patchReplace(parent, domNode, patchObj);
            case "UPDATE":
                return patchUpdate(domNode, patchObj);
            default:
                console.warn("Unknown patch type:", patchObj.type);
                return domNode;
        }
    } catch (error) {
        console.error("Error applying patch:", error, patchObj);
        return domNode;
    }
}

function patchCreate(parent, patchObj) {
    const newDom = renderElement(patchObj.newVNode);
    parent.appendChild(newDom);
    return newDom;
}

function patchRemove(parent, domNode) {
    if (domNode && domNode.parentNode === parent) {
        parent.removeChild(domNode);
    }
    return null;
}

function patchText(domNode, patchObj) {
    if (domNode && domNode.nodeType === Node.TEXT_NODE) {
        domNode.textContent = patchObj.text;
    }
    return domNode;
}

function patchReplace(parent, domNode, patchObj) {
    const newDom = renderElement(patchObj.newVNode);
    if (domNode && domNode.parentNode === parent) {
        parent.replaceChild(newDom, domNode);
    }
    return newDom;
}

function patchUpdate(domNode, patchObj) {
    if (!domNode) return domNode;
    // Update attributes
    patchObj.props.forEach(({ key, value }) => {
        if (value === undefined) {
            domNode.removeAttribute(key);
        } else {
            domNode.setAttribute(key, value);
        }
    });
    // Patch children
    patchChildren(domNode, patchObj.children);
    return domNode;
}

function patchChildren(domNode, childrenPatches) {
    const childNodes = Array.from(domNode.childNodes);
    let domChildIndex = 0;
    for (let i = 0; i < childrenPatches.length; i++) {
        const childPatch = childrenPatches[i];
        const oldChildNode = childNodes[domChildIndex];

        if (!oldChildNode) {
            // No existing DOM node at this position: CREATE
            if (childPatch && childPatch.type === "CREATE") {
                const newChildDom = renderElement(childPatch.newVNode);
                domNode.appendChild(newChildDom);
            }
        } else if (childPatch && childPatch.type === "CREATE") {
            // Insert before existing node
            const newChildDom = renderElement(childPatch.newVNode);
            domNode.insertBefore(newChildDom, oldChildNode);
            domChildIndex++;
        } else if (childPatch && childPatch.type === "REMOVE") {
            if (oldChildNode && oldChildNode.parentNode === domNode) {
                domNode.removeChild(oldChildNode);
            }
            // Do not increment domChildIndex since node was removed
        } else {
            if (oldChildNode) {
                patch(domNode, oldChildNode, childPatch, i);
                domChildIndex++;
            }
        }
    }

    // Remove any extra old nodes
    while (domNode.childNodes.length > childrenPatches.length) {
        const last = domNode.lastChild;
        if (last && last.parentNode === domNode) {
            domNode.removeChild(last);
        } else {
            break;
        }
    }
}
