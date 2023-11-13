uniform vec3 lightDirection;

varying vec3 norm;
varying vec3 eyeVec;
varying vec3 lightVector;



void main(void) {
	// Normal in Camera Space
	norm = normalMatrix * normal;

	// Vertex in camera space
	eyeVec = - normalize( vec3( modelViewMatrix * vec4( position, 1.0)));

	// Light direction in camera Space (ignore translation => 0.0)
  	lightVector = normalize( vec3( viewMatrix * vec4( -lightDirection, 0.0)));

  	// Vertex in Screen Space
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

