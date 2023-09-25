
GaussianBlurShader = {

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
		
			"float weights[25];",
			"weights[ 0] = 0.003765;",
			"weights[ 1] = 0.015019;",
			"weights[ 2] = 0.023792;",
			"weights[ 3] = 0.015019;",
			"weights[ 4] = 0.003765;",
			"weights[ 5] = 0.015019;",
			"weights[ 6] = 0.059912;",
			"weights[ 7] = 0.094907;",
			"weights[ 8] = 0.059912;",
			"weights[ 9] = 0.015019;",
			"weights[10] = 0.023792;",
			"weights[11] = 0.094907;",
			"weights[12] = 0.150342;",
			"weights[13] = 0.094907;",
			"weights[14] = 0.023792;",
			"weights[15] = 0.015019;",
			"weights[16] = 0.059912;",
			"weights[17] = 0.094907;",
			"weights[18] = 0.059912;",
			"weights[19] = 0.015019;",
			"weights[20] = 0.003765;",
			"weights[21] = 0.015019;",
			"weights[22] = 0.023792;",
			"weights[23] = 0.015019;",
			"weights[24] = 0.003765;",		
		
			"vec4 sum = vec4( 0.0 );",

			"for (int r = 0; r < 5; r++) {",
				"for (int c = 0; c < 5; c++) {",
					"sum += texture2D( tDiffuse, vec2( vUv.x - float(c - 2) * h, vUv.y - float(r - 2) * v ) ) * weights[r*5 + c];",
				"}",
			"}",
			
			"gl_FragColor = sum;",

		"}"

	].join( "\n" )

};
