<template>
	 <div id="gallery">
		<div
			v-for="fileColor in fileColorShuffled.slice(0,100)"
			:style="{
				backgroundImage: `url(img/bugs-small-marked-bgremoved/${fileColor.file})`
			}">
		</div>
		<!-- <img src="images/cat-2.jpg" alt="Serious cat"> -->
	</div>
</template>

<script>
import { fileColors } from '../../data/colors.one.js'
console.log("fileColors", fileColors);

function shuffle(array) {
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
			random: false,
		};
	},
	computed: {
		fileColorShuffled() {
			const sample = shuffle(fileColors).slice(0,100);
			const c = fileColors;//.filter(({ colors }) => (colors.hls[1]>0.33)&&(colors.hls[2]>0.16))
			const random = Math.floor((Math.random() * 10) + 1);
			// localStorage.haxrandom = localStorage.haxrandom !== undefined ? false : localStorage.haxrandom
			if (random < 4) {
				console.log('shuffle');
				return sample;
			} else {
				console.log('sort');
				sample.sort(function(a, b) {
					return parseFloat(a.colors.hls[0]) - parseFloat(b.colors.hls[0]);
				});
				if (Math.floor((Math.random() * 10) + 1) > 2) sample.reverse();
				return sample;
			}



		}
	}
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

#gallery
	padding: 0 100px
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
		margin: 40px

</style>
