<script>
import { mapState } from 'vuex';
import TreeMap from './treemap.vue';
import MasonaryGrid from './masonary.grid.vue';


export default {
	components: {
		TreeMap,
		MasonaryGrid,
	},
	computed: mapState([]),
};
</script>

<template>
<div class="web-app">
	<div class="spacer"></div>
	<a href="https://twitter.com/haxorpoda">
		<img src="img/haxorpoda.logo.png" class="logo" alt="Haxorpoda Collective logo">
	</a>
	<h1>Haxorpoda Collective</h1>
	<!-- <tree-map></tree-map> -->
	<masonary-grid></masonary-grid>
	<h2>Ils vont à la chasse aux papillons.</h2>
	<h3><a href="https://twitter.com/haxorpoda">@haxorpoda</a></h3>
</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

@font-face
	font-family: 'Abel'
	src: url('../fonts/abel-regular.ttf')
	font-weight: 400
	font-style: normal

*
	box-sizing: border-box

h1, h2
	font-weight: 400
h1
	font-size: 4em
h2
	font-size: 3em

body
	font-family: 'Abel', sans-serif
	color: $color-tuna
	margin: 0
	a
		color: $color-tuna
		&:visited
			color: $color-tuna
	input:focus
		outline: 0
	::-webkit-scrollbar
		width: #{1.2 * $grid-space}
	::-webkit-scrollbar-track
		background: $color-catskillwhite

	::-webkit-scrollbar-thumb
		background: $color-aluminium-dark
.web-app
	padding-top: 3em
	display: flex
	align-items: center
	// justify-content: center
	flex-direction: column
.spacer
	height: 2em
.logo
	width: 10em
</style>
