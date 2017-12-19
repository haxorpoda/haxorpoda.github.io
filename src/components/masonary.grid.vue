<template>
	<div>
		<div class="controls">
			<div class="shuffle" @click="shuffle()">S</div>
			<div>
				{{size}}
				<input
					class="size"
					type="range"
					min="0.3"
					max="1.2"
					step="0.01"
					v-model="size">
			</div>
		</div>
		<div id="gallery">
			<div
				v-for="fileColor in fileColorShuffled.slice(0,100)"
				:style="{
					width: `${size*10}em`,
					height: `${size*20}em`,
					margin: `${size*5}em`,
					backgroundImage: `url(img/bugs-small-marked-bgremoved/${fileColor.file})`
				}">
			</div>
			<!-- <img src="images/cat-2.jpg" alt="Serious cat"> -->
		</div>
	</div>
</template>

<script>
import { fileColors } from '../../data/colors.one.js';

function shuffleArray(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}


export default {
	data() {
		return {
			fileColors,
			size: 1,
			random0: Math.floor((Math.random() * 10) + 1),
			random1: Math.floor((Math.random() * 10) + 1),
		};
	},
	methods: {
		shuffle() {
			console.log('shuffle222222');
			this.random0 = Math.floor((Math.random() * 10) + 1);
			this.random1 = Math.floor((Math.random() * 10) + 1);
		},
	},
	computed: {
		fileColorShuffled() {
			const sample = shuffleArray(fileColors).slice(0, 100);
			// localStorage.haxrandom = localStorage.haxrandom !== undefined ? false : localStorage.haxrandom
			if (this.random0 < 4) {
				return sample;
			} else {
				sample.sort(function(a, b) {
					return parseFloat(a.colors.hls[0]) - parseFloat(b.colors.hls[0]);
				});
				if (this.random1 > 2) sample.reverse();
				return sample;
			}
		},
	},
};

// const galleryEl = document.querySelector('#gallery');
// const images = indexString.split("\n");
// const html = shuffle(images).map(imgPath => `<img src="../data/img/${imgPath.trim()}">`)
// galleryEl.innerHTML = html.join('');
</script>

<style lang="sass?indentedSyntax">
html, body
	padding: 0
	margin: 0
h1
	text-align: center


#gallery
	padding: 1em
	width: 100%
	display: flex
	flex-wrap: wrap
	justify-content: center
	>div
		width: 10em
		height: 20em
		background-position: center
		background-size: contain
		background-repeat: no-repeat
		margin: 5em

// @media (max-width: 600px)
// 	#gallery
// 		padding: 0

.controls
	position: fixed
	display: flex
	flex-direction: column
	align-items: flex-end
	bottom: 1em
	right: 1em
	color: #ccc
	.size
		opacity: 0.4
	.shuffle
		margin-bottom: 1.5em
		border: 1px solid #ccc
		border-radius: 3px
		width: 2em
		height: 2em
		display: flex
		justify-content: center
		align-items: center
		cursor: pointer
</style>
