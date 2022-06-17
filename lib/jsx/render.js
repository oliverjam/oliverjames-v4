const VOID_ELEMENTS =
  /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/;

export function render(node) {
  if (node === false || node == null) {
    return "";
  }
  if (typeof node !== "object") {
    return node.toString();
  }
  if (Array.isArray(node)) {
    return node.map(render).join("");
  }
  let { type, props } = node;
  if (typeof type === "function") {
    return render(type(props));
  }
  let { children, ...rest } = props;
  if (children === null || children === false) {
    children = "";
  } else if (children?.type) {
    children = render(children);
  } else if (Array.isArray(children)) {
    children = children.map(render).join("");
  }
  let attrs = "";
  for (let [k, v] of Object.entries(rest)) {
    switch (v) {
      case true:
        attrs += " " + k;
        break;
      case false:
      case null:
      case undefined:
        break;
      default:
        attrs += " " + `${k}="${v}"`;
    }
  }
  if (type.match(VOID_ELEMENTS)) {
    return `<${type}${attrs}>`;
  } else {
    return `<${type}${attrs}>${children}</${type}>`;
  }
}
