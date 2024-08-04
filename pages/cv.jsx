export default () => /*html*/ `
<!doctype html>
<html lang=en>
<meta charset=utf-8>
<title>CV</title>
<meta name=color-scheme content="light dark">
<meta name=viewport content="width=device-width">
<style>
	* { 
		box-sizing: border-box;
		margin: 0;
	}
	body {
		--accent: light-dark(turquoise, tomato);
		--secondary: light-dark(#ccc, #666);
		margin: 0 auto;
		max-inline-size: 70rem;
		display: grid;
		gap: 2rem;
		padding: 4rem 2rem;
		font: 1.125rem/1.4 Georgia, serif;
		color: light-dark(#333, #ddd);
		@media (width >= 54em) {
			grid-template-columns: 1fr 20rem;
		}
	}
	:is(main, aside) > * + * {
		margin-top: 2rem;
	}
	hr {
		margin-block: 2rem;
		border-style: solid;
		color: aqua;
		color: var(--accent);
	}
	a {
		color: inherit;
		text-decoration: none;
	}
	a:not(:is([href^=mail], [href^=tel])) {
		text-decoration: underline var(--secondary) 2px;
		text-underline-offset: 3px;
	}
	h2 {
		text-transform: uppercase;
		letter-spacing: 1px;
	}
	:is(h2, h3, h4) {
		font-size: 1em;
		font-weight: 400;
		font-family: system-ui;
		+ * {
			margin-block-start: 0.5rem;
		}
	}
	h2 + h3 {
		margin-block-start: 1rem;
	}
	nav > ul {
		padding-inline-start: 0;
		list-style: none;
	}
	ul {
		padding-inline-start: 1em;
		& ::marker {
			color: var(--secondary);
		}
	}
	li + li {
		margin-block-start: 0.5rem;
	}
</style>


<main>

<h1>Oliver Phillips</h1>

<nav>
<ul>
<li><a href=mailto:hello@oliverjam.com>📧 hello@oliverjam.com</a>
<li><a href=tel:+447789908839>📞 07789908839</a>
</ul>
</nav>

<h2>Bio</h2>
<p>
I'm a knowledgeable fullstack developer with a penchant for simple code focused on solving problems for the end user.
I've been surfing the world wide web for 25 years, and I am continually excited that I get to build things for it.
My preference is to work in product teams where everyone feels invested in working towards what's best for users,
creating performant, accessible and usable experiences.
<p>I write a lot of <a href=https://github.com/oliverjam>open source code</a> for fun,
and I <a href=https://oliverjam.com>blog about</a> my many coding opinions.
I enjoy nerding out about coffee and shaving bytes off my SVGs.

<hr>

<h2>Experience</h2>

<h3>The Delta Group</h3>
<h4>Freelance fullstack engineer | Feb 2024-April 2024</h4>
<ul>
<li>
Designed and developed a desk management and remote working platform for Delta's new Soho office space.
Allowed employees to easily manage desk bookings and office admins to track usage and capacity.
<li>Deployed a fullstack Node.js and SQLite app to their existing Azure cloud and authenticated with employee Microsoft Entra accounts.
<li>Focused on robust, simple code with a well-architected database as this was a solo project handed over to a client to manage internally.
</ul>

<h3>Founders and Coders</h3>
<h4>Developer in residence | Jan 2020-Aug 2022</h4>
<ul>
<li>
Wrote and delivered the <a href=https://github.com/foundersandcoders/coursebook/>fullstack web development curriculum</a> for the bootcamp,
including lectures and workshops on HTTP, testing, Node.js, SQL databases, and React,
via a custom frontend that I built for the purpose.
<li>
Built a fullstack platform for managing applications to the bootcamp using Remix and Postgres,
allowing applicants to track their progress through the required learning projects.
This was very UX-focused to make filling out lots of forms a smooth experience.
<li>
Led a small product team building a prototype app for creating automated AI telephone agents,
managing junior engineers and ensuring we iterated quickly while keeping the codebase approachable.
Relied on React Query to integrate dynamic UI requirements with the backend API.
</ul>

<h3>Ticketmaster</h3>
<h4>Frontend Engineer III | Sep 2018-Sep 2019</h4>
<ul>
<li>
Built a library of reusable, accessible and user-friendly React UI components.
Collaborated with engineers in different teams to create a library that covered common UI patterns to avoid duplication of work.
Rolled out across web and React Native products to ensure design consistency across the business.
</ul>

<h4>Frontend Engineer II | Feb 2018-Sep 2018</h4>
<ul>
<li>
Worked on the new account experience for Ticketmaster customers across the UK & Europe,
adding support for reselling tickets for the first time.
Integrating several different backends and legacy data sources from different teams,
involving a lot of very complex business logic.
<li>
Built a Node backend to coordinate the many internal services involved and ensure the frontend had everything it needed.
Set up robust validation and logging to cope with the complex architecture and track down inconsistencies or bugs.
</ul>

<h4>Frontend Engineer I | Jul 2017-Feb 2018</h4>
<ul>
<li>
Built the new checkout for resale tickets on ticketmaster.co.uk,
working in a scrum product team with full ownership of the product from design to implementation.
Started with Next.js but switched to our own custom server-rendering solution for better control.
<li>
Focused on fast performance and smooth user-experience as checkout is a business-critical product.
Created a robust suite of tests with React Testing Library and Cypress to avoid any regressions as we moved quickly.
</ul>

</main>

<aside>

<h2>Recent Projects</h2>

<h3>Rddit</h3>
<p>
A <a href=https://rddit.netlify.app/r/all>modern frontend for Reddit</a> that I genuinely prefer using to the official website.
Built in TypeScript with modern React Router for fast data fetching and lazy-loading slow Reddit API calls.
<p><a href=https://github.com/oliverjam/reddit-app>github.com/oliverjam/reddit-app</a>
	
<h3>Hypa</h3>
<p>
The backend framework I've always wanted JavaScript to have.
Just enough batteries included to build simple fullstack apps using JSX and SQLite.
Still in-progress, but complete enough that I am building other projects with it.
<p><a href=https://github.com/oliverjam/hypa>github.com/oliverjam/hypa</a>
	
<h3>Transclusion</h3>
<p>
A frontend library for declaratively adding interactivity to server-rendered apps.
Inspired by HTMX but focused on progressive enhancement and simplicity.
<p><a href=https://github.com/oliverjam/transclusion>github.com/oliverjam/transclusion</a>

<hr>

<h2>Tech experience</h2>

<ul>
<li>TypeScript
<li>React
<li>React Router
<li>React Query
<li>Redux
<li>Next.js
<li>Styled Components
<li>Tailwind
<li>Jest
<li>React Testing Library
<li>Cypress
<li>Node.js
<li>Express
<li>Postgres
<li>SQLite
<li>GraphQL
<li>Heroku
<li>Fly.io
<li>AWS
<li>Azure
</ul>

<hr>

<h2>Education</h2>

<h3>Founders and Coders | 2017</h3>
<p>Fullstack web development bootcamp</p>

<h3>University of Manchester | 2009-2012</h3>
<p>BA Philosophy, Politics & Economics Upper Second Class</p>

<!-- <dl>
<dt>Education level<dd>A-Level
<dt>Institution<dd>Bancroft's School
<dt>Date<dd>2009
<dt>Results
<dd>Maths: A
<dd>Physics: A
<dd>History: A
<dd>Critical Thinking: A (AS)
</dl>

<dl>
<dt>Education level<dd>GCSE
<dt>Institution<dd>Bancroft's School
<dt>Date<dd>2007
<dt>Results
<dd>5 A*s
<dd>4 As
<dd>Including English & Maths
</dl> -->

</aside>
`;
