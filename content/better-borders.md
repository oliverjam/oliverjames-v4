---
kind: article
title: Subtley better borders using transparency
tags:
  - css
date: 2025-05-05
intro: Semi-transparent borders can look much nicer in certain situations. Let's explore why, and how to implement them to make our components work better in a wider variety of situations.
---

<style>
	
	.Example {
		color-scheme: light;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(14rem, auto));
		gap: 0.5lh;
		justify-content: center;
		padding: var(--gutter);
		background-color: white;
		color: #333;
		font-family: system-ui;
		&[gradient] {
			background: linear-gradient(
				to bottom right,
				hsl(120 100 80),
				hsl(172 96 45)
			)
		}
		label, input {
			all: revert;
		}
		label {
			display: grid;
			gap: 0.125lh;
			font-weight: 500;
			font-size: 16px;
		}
		input {
			--b: hsl(0 0 0 / 0.25);
			border-radius: 4px;
			border-width: 1px;
			border-style: solid;
			border-color: hsl(0 0 75);
			padding: 0.25rem;
			outline: 0;
			transition-property: border-color, outline-color, box-shadow;
			transition-duration: 0.2s;
			background-color: white;
			&:focus {
				border-color: hsl(0 0 40);
				--b: hsla(0 0 0 / 0.7);
			}
			&[trans] {
				border-color: var(--b);
				&:focus {
					border-color: var(--b);
				}
			}
			&[clip] {
				background-clip: padding-box;
			}
			&[shadow] {
				box-shadow:
					0 10px 15px -3px hsl(0 0 0 / 0.2),
					0 4px 6px -4px hsl(0 0 0 / 0.2)
			}
			&[outline] {
				border: 0;
				outline: 1px solid var(--b);
			}
			&[bsb] {
				border: 0;
				box-shadow: 0 0 0 1px var(--b);
			}
		}
	}
</style>

Here's an input. You can tell because it's got a border.

<figure class="Example">
	<label>Your name
		<input>
	</label>
</figure>

This border is just a solid grey colour: `hsl(0 0 75)`. I think it looks pretty nice as is, but there are some situations where it will struggle.

For example on a gradient background:

<figure class="Example" gradient>
	<label>Your name
		<input>
	</label>
</figure>

Now the grey border looks muddy and hard to see. That light grey doesn't stand out from the background at all. We'd need to make the border darker to be properly visible here. Let's make it 25% darker with `hsl(0 0 50%)` and see how that looks:

<figure class="Example" gradient>
	<label>Your name
		<input style="border-color: hsl(0 0 50)">
	</label>
</figure>

This is better, but it's going to be annoying to manually set the border colour of our input every time we use it on a coloured background. It would be nice if we could make one version of the border that worked on any background.

Luckily we can, by using a semi-transparent border. This will allow some of the background colour to show through, which will make the border naturally appear darker on darker backgrounds. It will also slightly tint the border colour so it matches better.

Let's try setting the border to a transparent grey like `hsl(0 0 0 / 0.25)`. This is pure black but at 25% opacity, so it should be equivalent to our 75% lightness original grey colour.

<figure class="Example">
	<label>Your name
		<input trans>
	</label>
</figure>

It looks pretty much identical on a white background. Let's put the original back in so we can compare:

<figure class="Example">
	<label>Solid border
		<input>
	</label>
	<label>Transparent border
		<input trans>
	</label>
</figure>

Now let's see if it looks better on our gradient background:

<figure class="Example" gradient>
	<label>Solid border
		<input>
	</label>
	<label>Transparent border
		<input trans>
	</label>
</figure>

That's weird, it hasn't helped at all! It turns out that by default the background of an element extends up to the edge of its "border box".

<figure class="Example" style="font-family: ui-mono, monospace; font-size: 14px; line-height: 1; text-align: center">
	<div style="padding: 12px; background: hsl(55 100 95); border: 2px dashed hsl(55 100 50)">
		<div style="padding-bottom: 8px">margin</div>
		<div style="position: relative; border: 2px solid hsl(0 0 20)">
			<div style="position: absolute; top: 0; left: 0; padding: 2px; border-bottom-right-radius: 2px; background: hsl(0 0 20); color: white">border</div>
			<div style="padding: 12px; background: hsl(240 100 95);">
				<div style="padding-bottom: 8px">padding</div>
				<div style="padding: 12px; background: hsl(190 100 96)">
					<div>content</div>
				</div>
			</div>
		</div>
	</div>	
</figure>

That means the white background of the input is "underneath" the transparent border. This isn't what we want—for this trick to work we need the gradient background to show through the border.

Luckily there's a CSS property to control where an element's background extends to: [`background-clip`](https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip). By default this is set to `border-box`, but we can change it to `padding-box` to tell the browser to stop drawing the input's background at the edge of the padding, before the border starts. Let's see how that looks:

<figure class="Example" gradient>
	<label>Solid border
		<input>
	</label>
	<label>Transparent border
		<input trans clip>
	</label>
</figure>

How much better does that look? Our input will stay distinct from the background no matter what.

There is another edge-case that we need to account for: shadows. Let's see how our inputs look with a nice shadow under them.

<figure class="Example">
	<label>Solid border
		<input shadow>
	</label>
	<label>Transparent border
		<input trans clip shadow>
	</label>
</figure>

That's annoying. Our borders blend into the shadow and disappear at the bottom. This makes the inputs look kind of weird and bad again.

I was initially confused about why the input with the transparent border looks the same here. Surely it should work the same as with the gradient background? Unfortunately it turns out that CSS box-shadows always start being drawn _after_ the border-box of an element. As far as I can tell there's no way to make the shadow start after the padding-box (underneath the border).

Here's a visualisation of the problem:

<figure class="Example" style="font-family: ui-mono, monospace; font-size: 14px; line-height: 1; text-align: center" gradient>
		<div style="position: relative; border: 10px solid hsl(0 0 0 / 0.2); box-shadow: 0 8px 16px hsl(0 100 50 / 0.8); padding: 16px; background: white; background-clip: padding-box">
			<div style="position: absolute; top: -10px; left: -10px; padding: 2px; border-bottom-right-radius: 2px; background: hsl(0 0 20); color: white">border</div>
			<div>padding (& content)</div>
		</div>
</figure>

The border colour is transparent black, so the gradient background shows through and tints it green. However the red box-shadow doesn't show through—it starts _after_ the border-box, and as far as I can tell there's no way to change this.

In order to work around this we have to stop using borders for our border. We need something that will render _outside_ the element, so it sits on top of the box-shadow. Our two options are either `outline`, or more `box-shadow`.

Outline is by far the easiest to work with, since the syntax is the same as for borders. We can set `outline-color: hsla(0, 0%, 0%, 0.25)` and get the same result as before:

<figure class="Example">
	<label>Solid border
		<input shadow>
	</label>
	<label>Transparent border
		<input outline shadow>
	</label>
</figure>

This looks so much better with the shadow. The edge of the input is crisp, even right at the bottom where it meets the shadow. And it still looks great on the gradient background too:

<figure class="Example" gradient>
	<label>Solid border
		<input shadow>
	</label>
	<label>Transparent border
		<input outline shadow>
	</label>
</figure>

The downside to using an outline as a border is you can't also have an outline. For example if you wanted a more distinct separate focus style you'd be a bit stuck here.

It's more complicated, but you can also simulate a border using box-shadow. You set zero offset and blur, and use the spread to control the thickness. For example: `box-shadow: 0 0 0 1px hsl(0 0 0 / 0.25)`.

<figure class="Example">
	<label>Solid border
		<input>
	</label>
	<label>Transparent border
		<input bsb>
	</label>
</figure>

This looks good on the gradient background too:

<figure class="Example" gradient>
	<label>Solid border
		<input>
	</label>
	<label>Transparent border
		<input bsb>
	</label>
</figure>

The only downside to this approach is that it's more fiddly to add another shadow, since we need to write multiple box-shadows. For example:

<!-- prettier-ignore-start -->
```css
input {
	box-shadow:
		/* The border */
		0 0 0 1px hsl(0 0 0 / 0.25),
		/* The actual shadow */
		0 10px 15px -3px hsl(0 0 0 / 0.2),
		0 4px 6px -4px hsl(0 0 0 / 0.2)
}
```
<!-- prettier-ignore-end -->

<figure class="Example">
	<label>Solid border
		<input shadow>
	</label>
	<label>Transparent border
		<input style="
			border: 0;
			box-shadow:
			0 0 0 1px var(--b),
			0 10px 15px -3px hsl(0 0 0 / 0.2),
			0 4px 6px -4px hsl(0 0 0 / 0.2)">
	</label>
</figure>

And finally, putting everything together, let's see how it looks on the gradient background with a shadow:

<figure class="Example" gradient>
	<label>Solid border
		<input shadow>
	</label>
	<label>Transparent border
		<input style="
			border: 0;
			box-shadow:
			0 0 0 1px var(--b),
			0 10px 15px -3px hsl(0 0 0 / 0.2),
			0 4px 6px -4px hsl(0 0 0 / 0.2)">
	</label>
</figure>

I love it! Some might argue that this is a lot of effort to go to for a pretty subtle enhancement, but I think that sweating the small UI details is what makes really great products stand out. You only have to write these styles once, but every time a user sees them they pay off.

One final bonus tip: if you're writing Tailwind this is as simple as switching from the [`border`](https://tailwindcss.com/docs/border-width) class to [`ring`](https://tailwindcss.com/docs/box-shadow#adding-a-ring).
