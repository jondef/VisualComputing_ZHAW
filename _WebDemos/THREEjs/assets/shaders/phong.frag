


varying vec3 norm;
varying vec3 eyeVec;
varying vec3 lightVector;


void main(void) {

	// ambient
	vec4 IAmbient = vec4(0.1, 0.5, 0.2, 1.0);

	float lambertFactor = max(dot(lightVector, norm), 0.0);
	if ( lambertFactor > 0.0) {
		// calculate diffuse light
		vec4 IDiffuse = vec4(0.15, 0.75, 0.3, 1.0);
		gl_FragColor =	IDiffuse * lambertFactor ;

		// reflect lightVector
		vec3 Reflected = normalize( reflect( -lightVector, norm ));

		// calculcate specular
		vec4 ISpecular = vec4(1.0, 0.0, 0.0, 1.0);
		float shininess = pow(max(dot(Reflected, eyeVec), 0.0), 20.0);
		gl_FragColor +=	ISpecular * shininess;
	} else {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	};
	gl_FragColor += IAmbient;
}
