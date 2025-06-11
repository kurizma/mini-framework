const obj = {
  tag: "html",
  attrs: {},
  children: [
    {
      tag: "div",
      attrs: {
        class: "nameSubm",
      },
      children: [
        {
          tag: "input",
          attrs: {
            type: "text",
            placeholder: "Insert Name",
          },
        },
        {
          tag: "input",
          attrs: {
            type: "submit",
            placeholder: "Submit",
          },
        },
      ],
    },
  ],
};

function renderElement(node) {
  const el = document.createElement(node.tag);

  for (const [key, value] of Object.entries(node.attrs || {})) {
    el.setAttribute(key, value);
  }

  if (node.children && Array.isArray(node.children)) {
    node.children.forEach((child) => {
      if (typeof child === "string") {
        el.appendChild(document.createTextNode(child));
      } else {
        el.appendChild(renderElement(child));
      }
    });
  }

  return el;
}

function startApp(virtualDom, elementId) {
  const container = document.getElementById(elementId);
  const domTree = renderElement(virtualDom);
  container.appendChild(domTree);
}


startApp(obj, "app");
