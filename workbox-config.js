module.exports = {
	globDirectory: './',
	globPatterns: [
		'**/*.{css,png,svg,html,js,json,txt}'
	],
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	swDest: 'service-worker.js'
};