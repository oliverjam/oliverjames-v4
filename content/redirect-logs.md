---
kind: article
title: Redirect your log output to files for easier debugging
date: 2023-02-27
intro: Logs written to files are way easier to read, explore and edit compared to scrolling through your terminal
tags:
  - js
  - unix
  - logs
---

I was recently scraping hundreds of URLs at once (backing up my saved Reddit posts). This was a bit annoying to debug as I worked on the code, as logging each success/failure meant a _ton_ of output in my terminal. Sometimes a network failure was buried way back in the logs, making it easy to miss.

## Terminal problems

Most terminal emulators limit the number of lines you can scroll back (my iTerm2 appears to be set to 1000 lines). This is annoying when you are logging a lot—you literally cannot scroll back to view earlier logs.

You could bump up the limit, but unless you make it unlimited you'll hit this issue eventually. Also the limits are there for a reason—to stop your terminal sucking up all the memory with an ever-increasing scrollback buffer.

Terminals are not a particularly nice environment for browsing through logs, especially when you're logging structured data. They often don't support search, line-wrapping, syntax-highlighting etc. All of these are things you take for granted in a text editor.

## Redirecting log output

Here's the fun trick: you can redirect the output of a program to a file with a single shell operator: `>`. You may have used this to quickly populate a file:

```shell
echo "hello world" > hello.txt
```

However this works just as well for the output of a Node program:

```js index.js
for (let i = 0; i <= 100; i++) {
  console.log(`The number is ${i}`);
}
```

```shell
$ node index.js > output.log
```

```ini output.log
The number is 0
The number is 1
The number is 2
...
```

## Capturing different types of log

Programs have three [input/output connections](https://en.wikipedia.org/wiki/Standard_streams): "stdin" (standard input), "stdout" (standard output), and "stderr" (standard error). Having two different outputs (one for normal logs and one for errors) can be helpful in cases where you want to only see one or the other.

By default the `>` operator only redirects stdout. This means that if our Node program logs an error using `console.error` (which outputs to "stderr") it will still show up in the terminal.

```js index.js
for (let i = 0; i <= 100; i++) {
  if (i === 23) console.error(new Error(`${i} is not allowed`));
  else console.log(`The number is ${i}`);
}
```

```shell
$ node index.js > output.log
Error: 23 is not allowed
    at Object.<anonymous> (/Users/oli/Code/node-pipe-logs/index.js:12:31)
    ...
```

We can _also_ redirect stderr to a file by using `2>`:

```shell
$ node index.js > output.log 2> errors.log
```

```ini errors.log
Error: 23 is not allowed
    at Object.<anonymous> (/Users/oli/Code/node-pipe-logs/index.js:12:31)
    ...
```

This is super helpful for debugging: if the errors file is empty you know everything worked fine; if not you have a nice list of everything that went wrong to peruse at your leisure.
