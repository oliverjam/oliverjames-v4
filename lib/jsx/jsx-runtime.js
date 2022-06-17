function jsx(type, props, key, __self, __source) {
  return {
    type,
    props,
    key,
    __self,
    __source,
  };
}

function Fragment({ children }) {
  return children;
}

export { jsx, jsx as jsxs, jsx as jsxDEV, Fragment };
