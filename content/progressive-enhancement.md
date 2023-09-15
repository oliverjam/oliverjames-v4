---
draft: true
kind: article
title: Simple progressively enhanced web apps
tags:
  - html
  - js
date: 2023-09-12
intro: The HTMX library is getting a lot of hype lately. I thought I'd experiment with using a similar HTML-first API to progressively enhance server-rendered HTML.
---

Progressive enhancement is the idea that you should layer more powerful features on top of functional basics. For example starting with a regular HTML form, then adding JS to intercept submits and update the page selectively rather than doing a full browser navigation.

HTMX is a library for adding interactivity to HTML without writing your own JavaScript.

HTMX makes the server the source of truth, so you don't end up with the UI out of sync from the data. HTML attributes are just to control how HTMX reconciles server responses with the current UI.
