export function renderElement(node) {
    // Handle text nodes (strings) directly
    if (typeof node === "string") {
        return document.createTextNode(node);
    }

    // Handle element nodes (objects)
    const el = document.createElement(node.tag);

    for (const [key, value] of Object.entries(node.attrs || {})) {
        el.setAttribute(key, value);
    }

    if (node.children && Array.isArray(node.children)) {
        node.children.forEach((child) => {
            el.appendChild(renderElement(child)); // Recursively render children
        });
    }

    return el;
}


// function startApp(virtualDom, elementId) {
//     const container = document.getElementById(elementId);
//     const domTree = renderElement(virtualDom);
//     container.appendChild(domTree);
// }


// startApp(obj, "app");
