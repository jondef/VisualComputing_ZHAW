
CompositingShader = {

	uniforms: {
		tDiffuse: { type: "t", value: null },
		tGlow: { type: "t", value: null }
	},

	vertexShader: [
		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"
	].join("\n"),

	fragmentShader: [
		"uniform sampler2D tDiffuse;",
		"uniform sampler2D tGlow;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 texel = texture2D( tDiffuse, vUv );",
			"vec4 glow = texture2D( tGlow, vUv );",
			"gl_FragColor = texel + vec4(0.5, 0.75, 1.0, 1.0) * glow * 2.0;",

		"}"
	].join("\n")
};
