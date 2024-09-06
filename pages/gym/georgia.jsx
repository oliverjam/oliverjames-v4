export default () => /*html*/ `
<!doctype html>
<html lang=en>
<meta charset=utf-8>
<title>Georgia's programme</title>
<meta name=color-scheme content="light dark">
<meta name=viewport content="width=device-width">
<style>
	* { 
		box-sizing: border-box;
		margin: 0;
	}
	body {
		--px: 16px;
		margin: 0 auto;
		max-inline-size: 70rem;
		padding-block: 0.75rem;
		font: 14px/1.3 system-ui, sans-serif;
		> * + * {
			margin-block-start: 1rem;
		}
	}

	h1 {
		padding-inline: var(--px);
	}

	ul {
		list-style: none;
		padding-inline-start: 0;
	}

	table {
		width: 100%;
		font-variant-numeric: tabular-nums;
		text-align: left;
		border-collapse: collapse;
		padding-inline: var(--px);
	}

	tr + tr {
		border-block-start: 1px solid ButtonFace;
	}

	th, td {
		padding: 3px 4px;
		&:first-child,
		&:last-child {
			padding-inline: var(--px);
		}
	}

	td > span {
		display: inline-flex;
		align-items: center;
		border-radius: 4px;
		padding: 2px 6px;
		text-transform: uppercase;
		font-weight: 500;
		color: #555;
		background-color: ButtonFace;
	}

	p {
		padding-inline: var(--px);
	}

	[popovertarget] {
		aspect-ratio: 1;
		display: grid;
		place-content: center;
	}

	[popover] {
		top: auto;
		bottom: 0;
		border-radius: 1rem 1rem 0 0;
		border: 0;
		padding: 0.5rem;
		box-shadow: 0 -10px 15px -3px rgb(0 0 0 / 0.1), 0 -4px 6px -4px rgb(0 0 0 / 0.1);
		transition: translate 0.2s ease-out, display 0.2s ease-out allow-discrete;
		> * + * {
			margin-block-start: 0.5rem;
		}
		@starting-style {
			translate: 0 100%;
		}
		&:not(:popover-open) {
			translate: 0 100%;
		}
	}

	img {
		inline-size: 100%;
		height: auto;
	}
	
</style>



<h1>Georgia's programme</h1>

<table>
<tr><th>Weight<th>Sets<th>Reps<th>Exercise       <th>Help
<tr><td>20kg  <td>2   <td>12  <td>Hamstring curl <td><button popovertarget=curl>?</button></tr>
<tr><td>20kg  <td>2   <td>10  <td>Squat          <td><button popovertarget=squat>?</button></tr>
<tr><td>05kg  <td>2   <td>12  <td>Shoulder press <td><button popovertarget=ohp>?</button></tr>
<tr><td>14kg  <td>2   <td>12  <td>Lat pull down  <td><button popovertarget=curl>?</button></tr>
<tr><td>10kg  <td>2   <td>12  <td>Chest press    <td><button popovertarget=curl>?</button></tr>
<tr><td>15kg  <td>2   <td>12  <td>Row            <td><button popovertarget=curl>?</button></tr>
</table>

<div id=curl popover>
<img src=https://www.shutterstock.com/image-illustration/lever-seated-leg-curl-thighs-260nw-2327161935.jpg alt=>
<p>Adjust machine so your lower back is against the seat and the thigh pad is just above your kneecap. Your legs should be straight without too much strain on the hamstring.
<p>Contract your hamstring to close your leg until the foot pad cannot move further.
<p>You should feel this in your hamstrings and a little in your calves.
</div>

<div id=squat popover>
<img src=https://w7.pngwing.com/pngs/222/252/png-transparent-squat-barbell-exercise-weight-training-lunge-barbell-squat.png alt=>
<p>Place the bar on a rack at shoulder height. Facing the rack, duck under the bar and position it on the muscles behind your neck. Your knees should be a little bent.
<p>Squat the bar up and off the rack. Step back with one foot, then the other, then slide one foot out to a roughly shoulder width stance.
<p>Lower yourself straight down as far as you can go, then stand back up. The bar should travel in a straight line, and your knees should track over your feet. Try to push through your midfoot/heel—don't rock onto your toes.
<p>You should feel this in your quads.
<p>If the squat rack is busy substitute goblet squats with the heaviest dumbbell you can hold in your hands.
</div>

<div id=ohp popover>
<img src=https://www.icfitnessclub.com/wp-content/uploads/2023/04/Standing-Overhead-Dumbbell-Shoulder-Press.webp alt=>
<p>Press the dumbbells from the sides of your shoulders until arms are extended overhead. Lower to the start position and repeat.
<p>You should feel this in the front/sides or your shoulders, and your triceps.
</div>

<p>Weights are approximate—figure out the heaviest you can do to finish each set about 2 reps away from failure.
`;
