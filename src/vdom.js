export function renderElement(node) {
    // handle text nodes (strings) directly
    if (typeof node === "string") {
        return document.createTextNode(node);
    }

    // handle element nodes (objects)
    const el = document.createElement(node.tag);

    for (const [key, value] of Object.entries(node.attrs || {})) {
        el.setAttribute(key, value);
    }

    if (node.children && Array.isArray(node.children)) {
        node.children.forEach((child) => {
            // Recursively render children
            el.appendChild(renderElement(child)); 
        });
    }

    return el;
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
        children: diffChildren(oldVNode.children, newVNode.children)
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
    const patches = [];
    const max = Math.max(oldChildren.length, newChildren.length);
    for (let i = 0; i < max; i++) {
        patches[i] = diff(oldChildren[i], newChildren[i]);
    }
    return patches;
}


/////////

// Patch: Apply a patch object to the real DOM
export function patch(parent, domNode, patchObj, index = 0) {
    if (!patchObj) return domNode;

    switch (patchObj.type) {
        case "CREATE": {
            const newDom = renderElement(patchObj.newVNode);
            parent.appendChild(newDom);
            return newDom;
        }
        case "REMOVE": {
            parent.removeChild(domNode);
            return null;
        }
        case "TEXT": {
            domNode.textContent = patchObj.text;
            return domNode;
        }
        case "REPLACE": {
            const newDom = renderElement(patchObj.newVNode);
            parent.replaceChild(newDom, domNode);
            return newDom;
        }
        case "UPDATE": {
            // Update attributes
            patchObj.props.forEach(({ key, value }) => {
                if (value === undefined) {
                    domNode.removeAttribute(key);
                } else {
                    domNode.setAttribute(key, value);
                }
            });
            // Patch children
            const childNodes = domNode.childNodes;
            for (let i = 0; i < patchObj.children.length; i++) {
                patch(domNode, childNodes[i], patchObj.children[i], i);
            }
            return domNode;
        }
        default:
            return domNode;
    }
}