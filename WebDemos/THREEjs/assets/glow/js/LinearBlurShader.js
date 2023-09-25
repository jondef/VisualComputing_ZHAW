
LinearBlurShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"h":        { type: "f", value: 1.0 / 512.0 },
		"v":        { type: "f", value: 1.0 / 512.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"uniform float h;",
		"uniform float v;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 sum = vec4( 0.0 );",

			"sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y - 1.0 * v ) );",
			"sum += texture2D( tDiffuse, vec2( vUv.x + 0.0 * h, vUv.y - 1.0 * v ) );",
			"sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y - 1.0 * v ) );",
			
			"sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y + 0.0 * v ) );",
			"sum += texture2D( tDiffuse, vec2( vUv.x + 0.0 * h, vUv.y + 0.0 * v ) );",
			"sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y + 0.0 * v ) );",
			
			"sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y + 1.0 * v ) );",
			"sum += texture2D( tDiffuse, vec2( vUv.x + 0.0 * h, vUv.y + 1.0 * v ) );",
			"sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y + 1.0 * v ) );",

			"gl_FragColor = sum / 9.0;",

		"}"

	].join( "\n" )

};
