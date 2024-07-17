---
kind: article
title: Testing React components from scratch
tags:
  - js
  - react
  - testing
date: 2024-07-17
intro: "Writing tests for React components can be difficult and confusing, so we rely on libraries that handle this for us. Let's see how we can write some tests ourselves to better understand how it works."
---

Although React components _seem_ like simple functions, they actually hide a lot of complexity that makes them difficult to test. You can't just call a component function and assert about its return value. Components usually have behaviour like state, event handlers and side effects that should be verified.

We're going to implement a very simplified version of a testing library for React that is based on the very popular [React Testing Library](https://testing-library.com/docs/react-testing-library/intro), so we can better understand what this dependency does for us.

## How components work

There are two main steps to rendering a React component so we can test it. First we need to convert JSX syntax to regular JS, then we need to convert React's object representation of the UI into real DOM elements we can interact with.

For example this component:

```jsx
function Greeting() {
	return <h1>Hello</h1>;
}
```

looks like this when converted to JS:

```jsx
import { jsx as _jsx } from "react/jsx-runtime";

function Greeting() {
	return jsx("h1", { children: "Hello" });
}
```

When called this function returns an object that looks something like this:

```json
{
	"$$typeof": Symbol("react.element"),
	"props": { "children": "I'm a button" },
	"type": "button",
}
```

We can't really do much with this object other than assert that its props are correct. However this wouldn't be a very helpful test since we're passing those props in ourselves.

React components need to be rendered into a DOM using the `render` method. We create a "React root" for rendering elements into, then render our component into it:

```jsx
import { createRoot } from "react-dom/client";

let div = document.querySelector("#root");
let root = createRoot(div);
root.render(<Greeting />);
```

In this case we're assuming we have access to a `document` that contains a div with an ID of "root". That leads us to another problem.

## Environment setup

Most testing environments do not have access to a DOM. For convenience we usually like to runs tests from our terminal, or in a CI job when we push a PR to GitHub. It is possible to run tests in a real browser (e.g. using [QUnit](https://qunitjs.com/)), but almost nobody does anymore.

So to test React components we need to create a fake DOM within our testing environment. This usually means using the [JSDom](https://github.com/jsdom/jsdom) library. I've [written about using JSDOM before](https://oliverjam.es/articles/frontend-testing-node-jsdom), so I won't go into detail now. Suffice to say it implements a large number of browser features in pure JavaScript so we can run code that is meant for the browser in Node or some other non-browser environment.

The simplest way to use JSDOM is via the [global-jsdom](https://github.com/modosc/global-jsdom) package. This sets up a DOM and all the globals you would expect to use in the browser (`window`, `document`, `console` etc). It's as simple as importing a file:

```js
import "global-jsdom/register";
```

## Dealing with JSX

Node doesn't understand JSX syntax. There are a couple of ways to deal with this: either compile your code with something like esbuild or Babel, or use [a Node module hook](https://nodejs.org/api/module.html#transpilation) to compile it on the fly as you import it.

To make things simpler here we're going to use the [Bun](https://bun.sh) runtime, which supports JSX natively.

## Rendering components

Now that we have a DOM we can render our component as above:

```jsx
import "global-jsdom/register";
import { createRoot } from "react-dom/client";

function Greeting() {
	return <h1>Hello</h1>;
}

let div = document.querySelector("#root");
let root = createRoot(div);
root.render(<Greeting />);

console.log(div.innerHTML); // <h1>Hello</h1>
```

## Writing a render function

It would be nice to abstract some of this rendering boilerplate so that testing looks as simple as this:

```jsx
import { test, expect } from "bun:test";
import { render } from "./helpers.js";

test("Greeting renders correctly", () => {
	render(<Greeting />);
	let h1 = document.querySelector("h1");
	expect(h1).toBeInstanceOf(HTMLHeadingElement);
});
```

We want to write a `render` function that does three things:

1. Create a new div element to render into
1. Put the div in the DOM
1. Render our React element into a new React root

```js
import { createRoot } from "react-dom/client";

export function render(element) {
	let container = document.createElement("div");
	document.body.append(container);
	let root = createRoot(container);
	root.render(element);
}
```

If we run the example test from above it will fail:

```
Expected constructor: [class HTMLHeadingElement]
Received value: null
```

This is strange because everything should work fine now. If we try to log `document.body.innerHTML` after we call `render` we just get `<div></div>`. This implies that the container is being created and appended to the body, but the React root is not rendering.

Newer versions of React render asynchronously, which means we cannot rely on the render having completed before the rest of our code runs. We can verify that this is the problem by making our test async and awaiting a promise to push our test code to the back of the queue:

```jsx
test("Greeting renders correctly", async () => {
	render(<Greeting />);
	await new Promise((resolve) => setTimeout(resolve, 0));
	console.log(document.body.innerHTML);
	let h1 = document.querySelector("h1");
	expect(h1).toBeInstanceOf(HTMLHeadingElement);
});
```

The test now passes, and the log shows the correct DOM containing the `<h1>`. This isn't really a proper solution though, just a hack to diagnose the issue. Luckily React provides a way to fix this.

## Using the act function

The React team realised that tests would need a way to reliably render components and assert about them synchronously, so they provided the [`act`](https://react.dev/reference/react/act) function. React will make sure any any pending updates for the code wrapped in `act` are complete before the rest of your test code runs. We'll need to use `act` any time we render, or trigger state updates or effects.

We need to update our `render` function to wrap the React render in `act`:

```js
export function render(element) {
	let container = document.createElement("div");
	document.body.append(container);
	let root = createRoot(container);
	act(() => root.render(element));
}
```

We can now get rid of the timeout in our test and see that it passes correctly:

```jsx
test("Greeting renders correctly", () => {
	render(<Greeting />);
	console.log(document.body.innerHTML);
	let h1 = document.querySelector("h1");
	expect(h1).toBeInstanceOf(HTMLHeadingElement);
});
```

It also logs the correct DOM:

```html
<div><h1>Hello</h1></div>
```

We now have a warning in the console from React:

```
Warning: The current testing environment is not configured to support act(...)
```

The `act` function is designed to only be used in testing environments, not real apps. So we need to tell React that this code is running inside a test, by setting a [special global variable](https://react.dev/reference/react/act#error-the-current-testing-environment-is-not-configured-to-support-act).

```js
global.IS_REACT_ACT_ENVIRONMENT = true;

export function render(element) {
	// ...
}
```

That's it as far as rendering goes. We can now render components and use normal DOM methods to query elements and make assertions about them.

## Cleaning up after ourselves

Since the DOM is global every test is updating the same document. This could potentially cause one test to affect the result of another, which is a bad idea. Tests should always be isolated from each other so that when one fails you know it's a real failure and not a false negative caused by some other test.

If we add a second test that also logs the DOM we can see this accumulation:

```js
test("Another thing renders correctly", () => {
	render(<span>goodbye</span>);
	console.log(document.body.innerHTML);
	let h1 = document.querySelector("h1");
	expect(h1).toBeInstanceOf(HTMLHeadingElement);
});
```

This test logs:

```html
<div><h1>Hello</h1></div>
<div><span>goodbye</span></div>
```

The test also passes even though it shouldn't! We are searching the DOM for an `h1` and finding it, even though we rendered a `span`, because the `h1` is still there from the previous test.

We need to create a way to clean up the DOM to remove any containers we've added, and to unmount any React roots we created. Most testing frameworks provide a way to run code after each test, so we can aim for something like this:

```js
import { test, expect, afterEach } from "bun:test";
import { render, cleanup } from "./helpers.js";

afterEach(cleanup);
```

We'll have to keep track of both the container and React roots we create during renders, so lets push them into an array:

```js
let roots = [];

export function render(element) {
	// ...
	roots.push({ root, container });
}
```

Then we can write a `cleanup` function that loops over this array and deletes any DOM nodes and unmounts any React roots:

```js
export function cleanup() {
	for (let { root, container } of roots) {
		act(() => root.unmount());
		container.remove();
	}
	roots.length = 0; // empty the array once we're done
}
```

Note that just like when we render into a React root, we also wrap the unmount in `act` to make sure it happens at the right time.

Now when we run our two tests again the second one fails as it should, since the DOM now only contains the `span`:

```html
<div><span>goodbye</span></div>
```

## Dispatching events

Writing useful component tests requires interacting with them. Otherwise you're just verifying that you typed the right JSX. In order to test interactivity we need to be able to trigger events on the DOM elements the component rendered.

Let's try to test this counter component:

```tsx
function Counter() {
	let [count, setCount] = useState(0);
	return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

First we need to render it as before:

```tsx
test("Counter can increment", () => {
	render(<Counter />);
	let button = document.querySelector("button");
	if (!button) throw new Error("could not find <button>");
	expect(button?.textContent).toBe("0");
});
```

To verify that the counter works we need to trigger a click event on the button element, then check that the text content has updated. We can do that using the `dispatchEvent` method on DOM elements:

```tsx
test("Counter can increment", () => {
	render(<Counter />);
	let button = document.querySelector("button");
	if (!button) throw new Error("could not find <button>");
	expect(button.textContent).toBe("0");

	let click = new MouseEvent("click", { bubbles: true });
	button.dispatchEvent(click);
	expect(button.textContent).toBe("1");
});
```

However this test fails: the text content does not update from "0" to "1". We do get a helpful warning from React though:

```
Warning: An update to Counter inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...)
```

This is the same problem as before—state updates are not handled synchonously, so our assertions run before React has finished re-rendering. We need to wrap the event dispatch in `act` to ensure everything happens in the right order:

```tsx
test("Counter can increment", () => {
	// ...
	let click = new MouseEvent("click", { bubbles: true });
	act(() => button.dispatchEvent(click));
	expect(button.textContent).toBe("1");
});
```

Now the DOM updates correctly and the test passes.

Creating and dispatching events like this is a little clunky. It would be nice to abstract this away into a helper function like this:

```js
fireEvent("click", button);
```

Unfortunately that is not a simple undertaking. Different events require different constructor functions (i.e. "click" events must use `MouseEvent`, "blur" events must use `FocusEvent` etc). Different events also need different options: some bubble and some do not. React Testing Library maintains a [~400 line object](https://github.com/testing-library/dom-testing-library/blob/main/src/event-map.js) mapping each event type to the required options to handle this.

The best we can do without adding a ton of complexity is hide the `act` call so tests don't need to import this from React:

```js
export function fireEvent(event, element) {
	act(() => element.dispatchEvent(event));
}
```

This simplifies the test very slightly:

```js
test("Counter can increment", () => {
	// ...
	let click = new MouseEvent("click", { bubbles: true });
	fireEvent(click, button);
	expect(button.textContent).toBe("1");
});
```

### Input value updates

There is another weird edge-case to take care of. React does some strange things when handling updates to the values of inputs and textareas. This makes normal event dispatches not work correctly. For example:

```js
function Uppercase() {
	let [value, setValue] = useState("");
	return (
		<input
			value={value.toUpperCase()}
			onChange={(e) => {
				console.log(e);
				setValue(e.target.value);
			}}
		/>
	);
}

test("Counter can increment", () => {
	render(<Uppercase />);
	let input = document.querySelector("input");
	if (!input) throw new Error("could not find <input>");

	input.value = "hello";
	let change = new Event("change", { bubbles: true });
	fireEvent(change, input);
	expect(input.value).toBe("HELLO");
});
```

This test fails because the change event handler never runs (we never see the event logged by the component). There's a [discussion on why this happens](https://github.com/facebook/react/issues/10135) from 2017. Unfortunately the solution is pretty weird. This is the most minimal version I can get to work:

```js
function setValue(element, value) {
	let proto = Object.getPrototypeOf(element);
	let setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
	if (setter) setter.call(element, value);
}
```

We find the prototype of the input element, then get the setter function for the `value` property and then bind it to the input element and call it with the new value we want to set. This bypasses React's hijacking of the update so the event handler actually runs.

We have to use this instead of setting the value directly on the input:

```jsx
test("Counter can increment", () => {
	// ...
	setValue(input, "hello");
	let change = new Event("change", { bubbles: true });
	fireEvent(change, input);
	expect(input.value).toBe("HELLO");
});
```

Even weirder this works fine in Jest with their JSDOM setup, but not in Bun using `global-jsdom`. This is another argument for using React Testing Library, since they have [a more robust implementation of this](https://github.com/testing-library/dom-testing-library/blob/20d9894f0e5403e50c8d01b795a51532d72e8337/src/events.js#L106).

## Conclusion

Here's our final set of testing helpers:

```js
import "global-jsdom/register";
import { act } from "react";
import { createRoot } from "react-dom/client";

global.IS_REACT_ACT_ENVIRONMENT = true;

let roots = [];

export function render(element) {
	let container = document.createElement("div");
	document.body.append(container);
	let root = createRoot(container);
	act(() => root.render(element));
	roots.push({ root, container });
}

export function cleanup() {
	for (let { root, container } of roots) {
		container.remove();
		act(() => root.unmount());
	}
	roots.length = 0;
}

export function fireEvent(event, element) {
	act(() => element.dispatchEvent(event));
}

export function setValue(element, value) {
	let proto = Object.getPrototypeOf(element);
	let setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
	if (setter) setter.call(element, value);
}
```

This hopefully demystifies React testing a bit—there's not much magic happening; it's mostly just regular DOM stuff with a few weird bits due to React's strange internals.

My main takeaway would probably be to just use React Testing Library, since it handles a lot of edge-cases for you and provides lots more convenient helpers too.
