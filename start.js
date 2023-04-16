function start() {
	const canvas = document.getElementById("my_canvas");
//Inicialize the GL contex
	const gl = canvas.getContext("webgl2");
	if (gl === null) {
		alert("Unable to initialize WebGL. Your browser or machine may not support it.");
		return;
	}

	// ustawienie trybu wyswietlania obrazu
	let tryb = 1;

	//texture1 *****************************************************************************
	const texture1 = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture1);
	const level = 0;
	const internalFormat = gl.RGBA;
	const width = 1;
	const height = 1;
	const border = 0;
	const srcFormat = gl.RGBA;
	const srcType = gl.UNSIGNED_BYTE;
	const pixel = new Uint8Array([0, 0, 255, 255]);
	gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
		width, height, border, srcFormat, srcType,
		pixel);
	const image = new Image();
	image.onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, texture1);
		gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,srcFormat, srcType, image);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	};
	image.crossOrigin = "";
	image.src = "https://cdn.pixabay.com/photo/2013/09/22/19/14/brick-wall-185081_960_720.jpg";
//****************************************************************

	//texture2 *****************************************************************************
	const texture2 = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture2);
	const level2 = 0;
	const internalFormat2 = gl.RGBA;
	const width2 = 1;
	const height2 = 1;
	const border2 = 0;
	const srcFormat2 = gl.RGBA;
	const srcType2 = gl.UNSIGNED_BYTE;
	const pixel2 = new Uint8Array([0, 0, 255, 255]);
	gl.texImage2D(gl.TEXTURE_2D, level2, internalFormat2,
		width2, height2, border2, srcFormat2, srcType2,
		pixel2);
	const image2 = new Image();
	image2.onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, texture2);
		gl.texImage2D(gl.TEXTURE_2D, level2, internalFormat2,srcFormat2, srcType2, image2);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	};
	image2.crossOrigin = "";
	image2.src = "https://images.rawpixel.com/image_1300/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L3BmLWJnMi0xMTQ0LXBhaV8xLmpwZw.jpg";
//****************************************************************


	//*****************pointer lock object forking for cross browser**********************
	canvas.requestPointerLock = canvas.requestPointerLock ||
		canvas.mozRequestPointerLock;
	document.exitPointerLock = document.exitPointerLock ||
		document.mozExitPointerLock;
	canvas.onclick = function() {
		canvas.requestPointerLock();
	};
// Hook pointer lock state change events for different browsers
	document.addEventListener('pointerlockchange', lockChangeAlert, false);
	document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
	function lockChangeAlert() {
		if (document.pointerLockElement === canvas ||
			document.mozPointerLockElement === canvas) {
			console.log('The pointer lock status is now locked');
			document.addEventListener("mousemove", ustaw_kamere_mysz, false);
		} else {
			console.log('The pointer lock status is now unlocked');
			document.removeEventListener("mousemove", ustaw_kamere_mysz, false);
		}
	}
//****************************************************************

console.log("WebGL version: " + gl.getParameter(gl.VERSION));
console.log("GLSL version: " + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
console.log("Vendor: " + gl.getParameter(gl.VENDOR));

const vs = gl.createShader(gl.VERTEX_SHADER);
const fs = gl.createShader(gl.FRAGMENT_SHADER);
const program = gl.createProgram();

	const vsSource =
		`#version 300 es
			precision highp float;
			in vec3 position;
			in vec3 color;
			uniform mat4 model;
			uniform mat4 view;
			uniform mat4 proj;
			
			in vec2 aTexCoord;
			out vec2 TexCoord;
			
			out vec3 Color;
			
			void main(void)
			{
			TexCoord = aTexCoord;
			Color = color;
			   gl_Position =proj * view * model * vec4(position, 1.0);
			}
			`;

	const fsSource =
		`#version 300 es
		   precision highp float;
		   in vec3 Color;
		   in vec2 TexCoord;
		   out vec4 frag_color;
		   uniform sampler2D texture1;
		   uniform sampler2D texture2;
		   
		   void main(void)
	   	{
	   		frag_color = texture(texture1, TexCoord);
	   	}
			`;


//compilation vs
		gl.shaderSource(vs, vsSource);		
		gl.compileShader(vs);
		if(!gl.getShaderParameter(vs, gl.COMPILE_STATUS))
                {
                    alert(gl.getShaderInfoLog(vs));
                }

//compilation fs
		gl.shaderSource(fs, fsSource);     
		gl.compileShader(fs);
		if(!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
                {
                    alert(gl.getShaderInfoLog(fs));
                }

	if(!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
	{
		alert(gl.getShaderInfoLog(fs));
	}

	gl.attachShader(program,vs);
	gl.attachShader(program,fs);
	gl.linkProgram(program);

	if(!gl.getProgramParameter(program, gl.LINK_STATUS))
	{
		alert(gl.getProgramInfoLog(program));
	}

	gl.useProgram(program);




const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	var n_draw=3;
	kostka();
	// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


	// const position = gl.getAttribLocation(program, "position");
	// gl.enableVertexAttribArray(position);
	// gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);

	// dane wierzcholkowe
	const positionAttrib = gl.getAttribLocation(program, "position");
	gl.enableVertexAttribArray(positionAttrib);
	gl.vertexAttribPointer(positionAttrib, 3, gl.FLOAT, false, 8*4, 0);

	const colorAttrib = gl.getAttribLocation(program, "color");
	gl.enableVertexAttribArray(colorAttrib);
	gl.vertexAttribPointer(colorAttrib, 3, gl.FLOAT, false, 8*4, 3*4);

	const texCoord = gl.getAttribLocation(program, "aTexCoord");
	gl.enableVertexAttribArray(texCoord);
	gl.vertexAttribPointer(texCoord, 2, gl.FLOAT, false, 8*4, 6*4);

	//macierze
	// macierz modelu
	const model = mat4.create();
	const kat_obrotu = 45 * Math.PI / 180; // in radians
	mat4.rotate(model, model, kat_obrotu, [0, 0, 1]);

	let uniModel = gl.getUniformLocation(program, 'model');
	gl.uniformMatrix4fv( uniModel, false, model);

	// macierz widoku
	const view = mat4.create();
	mat4.lookAt(view, [0,0,3], [0,0,-1], [0,1,0]);

	let uniView = gl.getUniformLocation(program, 'view');
	gl.uniformMatrix4fv(uniView, false, view);


	// macierz projekcji
	const proj = mat4.create();
	mat4.perspective(proj, 60 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, .1, 100.0);

	let uniProj = gl.getUniformLocation(program, 'proj');
	gl.uniformMatrix4fv( uniProj, false, proj);



	// klawisze
	var pressedKey = {};
	window.onkeyup = e => pressedKey[e.keyCode] = false;
	window.onkeydown = e => pressedKey[e.keyCode] = true;

	let cameraPos = glm.vec3(0,0,3);
	let cameraFront = glm.vec3(0,0,-1);
	let cameraUp = glm.vec3(0,1,0);
	let obrot=0.0;

	// window.requestAnimationFrame(draw);
	setTimeout(() => { requestAnimationFrame(draw);}, 1000 / 10);

	gl.enable(gl.DEPTH_TEST);

	//fpsy
	let licznik=0;
	const fpsElem = document.querySelector("#fps");

	let startTime=0;
	let elapsedTime=0;

	gl.uniform1i(gl.getUniformLocation(program, "texture1"), 0);
	gl.uniform1i(gl.getUniformLocation(program, "texture2"), 1);

function draw() {

	elapsedTime = performance.now() - startTime;
	startTime = performance.now();
	licznik++;
	let fFps = 1000 / elapsedTime;
// ograniczenie częstotliwości odświeżania napisu do ok 1/s
	if(licznik > fFps){
		fpsElem.textContent = fFps.toFixed(1);
		licznik = 0;
	}

	gl.clearColor(0, 0, 0, 1);
	gl.clear(gl.COLOR_BUFFER_BIT);
	switch (tryb) {
		case 1: //normal
			gl.viewport(0, 0, canvas.width, canvas.height);
			// gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, texture1);
			gl.drawArrays(gl.TRIANGLES, 0, 12);
			// gl.activeTexture(gl.TEXTURE1);
			gl.bindTexture(gl.TEXTURE_2D, texture2);
			gl.drawArrays(gl.TRIANGLES, 12, 24);
			break;
		case 2: //stereo
			gl.viewport(0, 0, canvas.width, canvas.height);
			StereoProjection(-6, 6, -4.8, 4.8, 12.99, -100, 0, 13, -0.05);
			gl.colorMask(true,false,false,false);

			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, texture1);
			gl.drawArrays(gl.TRIANGLES, 0, 12);
			// gl.activeTexture(gl.TEXTURE1);
			gl.bindTexture(gl.TEXTURE_2D, texture2);
			gl.drawArrays(gl.TRIANGLES, 12, 24);

			gl.clear(gl.DEPTH_BUFFER_BIT);
			StereoProjection(-6, 6, -4.8, 4.8, 12.99, -100, 0, 13, 0.05);
			gl.colorMask(false,false,true,false);

			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, texture1);
			gl.drawArrays(gl.TRIANGLES, 0, 12);
			// gl.activeTexture(gl.TEXTURE1);
			gl.bindTexture(gl.TEXTURE_2D, texture2);
			gl.drawArrays(gl.TRIANGLES, 12, 24);

			gl.colorMask(true,true,true,true);

			break;
		case 3:
			gl.viewport(0, 0, canvas.width/2, canvas.height);
			StereoProjection(-6, 6, -4.8, 4.8, 12.99, -100, 0, 13, -0.1);

			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, texture1);
			gl.drawArrays(gl.TRIANGLES, 0, 12);
			// gl.activeTexture(gl.TEXTURE1);
			gl.bindTexture(gl.TEXTURE_2D, texture2);
			gl.drawArrays(gl.TRIANGLES, 12, 24);

			gl.viewport(canvas.width/2, 0, canvas.width/2, canvas.height);
			StereoProjection(-6, 6, -4.8, 4.8, 12.99, -100, 0, 13, 0.1);
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, texture1);
			gl.drawArrays(gl.TRIANGLES, 0, 12);
			// gl.activeTexture(gl.TEXTURE1);
			gl.bindTexture(gl.TEXTURE_2D, texture2);
			gl.drawArrays(gl.TRIANGLES, 12, 24);
			break;
	}

	ustawKamere();



	window.requestAnimationFrame(draw);
}



// Add the event listeners for mousedown, mousemove, and mouseup
window.addEventListener('mousedown', e => {
  x = e.offsetX;
  y = e.offsetY;
   // alert("x ="+x);
   // alert("y ="+y);
});


// Add the event listeners for keydown, keyup
window.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 27: // esc
      if (confirm('Zamknac okno?')) {
		  window.close();
	  }
    break;
    case 84: // T
      tryb = 1;
		console.log('tryb 1');
    break;
    case 89: // Y
      tryb = 2;
		console.log('tryb 2');
    break;
    case 85: // u
		console.log('tryb 3');
      tryb = 3;
    break;
  }
}, false);

	function kostka() {

		let punkty_ = 36;

		var vertices = [
			-0.5, -0.5, -0.5,  0.0, 0.0, 0.0, 0.0, 0.0,
			0.5, -0.5, -0.5,  0.0, 0.0, 1.0, 1.0, 0.0,
			0.5,  0.5, -0.5,  0.0, 1.0, 1.0, 1.0, 1.0,
			0.5,  0.5, -0.5,  0.0, 1.0, 1.0, 1.0, 1.0,
			-0.5,  0.5, -0.5,  0.0, 1.0, 0.0, 0.0, 1.0,
			-0.5, -0.5, -0.5,  0.0, 0.0, 0.0, 0.0, 0.0,

			-0.5, -0.5,  0.5,  0.0, 0.0, 0.0, 0.0, 0.0,
			0.5, -0.5,  0.5,  1.0, 0.0, 1.0, 1.0, 0.0,
			0.5,  0.5,  0.5,  1.0, 1.0, 1.0, 1.0, 1.0,
			0.5,  0.5,  0.5,  1.0, 1.0, 1.0, 1.0, 1.0,
			-0.5,  0.5,  0.5,  0.0, 1.0, 0.0, 0.0, 1.0,
			-0.5, -0.5,  0.5,  0.0, 0.0, 0.0, 0.0, 0.0,

			-0.5,  0.5,  0.5,  1.0, 0.0, 1.0, 0.0, 0.0,
			-0.5,  0.5, -0.5,  1.0, 1.0, 1.0, 1.0, 0.0,
			-0.5, -0.5, -0.5,  0.0, 1.0, 0.0, 1.0, 1.0,
			-0.5, -0.5, -0.5,  0.0, 1.0, 0.0, 1.0, 1.0,
			-0.5, -0.5,  0.5,  0.0, 0.0, 0.0, 0.0, 1.0,
			-0.5,  0.5,  0.5,  1.0, 0.0, 1.0, 0.0, 0.0,

			0.5,  0.5,  0.5,  1.0, 0.0, 1.0, 0.0, 0.0,
			0.5,  0.5, -0.5,  1.0, 1.0, 1.0, 1.0, 0.0,
			0.5, -0.5, -0.5,  0.0, 1.0, 0.0, 1.0, 1.0,
			0.5, -0.5, -0.5,  0.0, 1.0, 0.0, 1.0, 1.0,
			0.5, -0.5,  0.5,  0.0, 0.0, 0.0, 0.0, 1.0,
			0.5,  0.5,  0.5,  1.0, 0.0, 1.0, 0.0, 0.0,

			-0.5, -0.5, -0.5,  0.0, 1.0, 0.0, 0.0, 0.0,
			0.5, -0.5, -0.5,  1.0, 1.0, 1.0, 1.0, 0.0,
			0.5, -0.5,  0.5,  1.0, 0.0, 1.0, 1.0, 1.0,
			0.5, -0.5,  0.5,  1.0, 0.0, 1.0, 1.0, 1.0,
			-0.5, -0.5,  0.5,  0.0, 0.0, 0.0, 0.0, 1.0,
			-0.5, -0.5, -0.5,  0.0, 1.0, 0.0, 0.0, 0.0,

			-0.5,  0.5, -0.5,  0.0, 1.0, 0.0, 0.0, 0.0,
			0.5,  0.5, -0.5,  1.0, 1.0, 1.0, 1.0, 0.0,
			0.5,  0.5,  0.5,  1.0, 0.0, 1.0, 1.0, 1.0,
			0.5,  0.5,  0.5,  1.0, 0.0, 1.0, 1.0, 1.0,
			-0.5,  0.5,  0.5,  0.0, 0.0, 0.0, 0.0, 1.0,
			-0.5,  0.5, -0.5,  0.0, 1.0, 0.0, 0.0, 0.0,
		];

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


		n_draw=punkty_;
	}

	function ustawKamere() {
		let cameraSpeed = 0.02;

		if (pressedKey["38"]) {
			cameraPos.x+=cameraSpeed * cameraFront.x;
			cameraPos.y+=cameraSpeed * cameraFront.y;
			cameraPos.z+=cameraSpeed * cameraFront.z;
		}

		if (pressedKey["40"]) {
			cameraPos.x-=cameraSpeed * cameraFront.x;
			cameraPos.y-=cameraSpeed * cameraFront.y;
			cameraPos.z-=cameraSpeed * cameraFront.z;
		}

		if (pressedKey["37"]) { //left
			let cameraPos_tmp = glm.normalize(glm.cross(cameraFront, cameraUp));
			cameraPos.x-=cameraPos_tmp.x * cameraSpeed;
			cameraPos.y-=cameraPos_tmp.y * cameraSpeed;
			cameraPos.z-=cameraPos_tmp.z * cameraSpeed;
		}

		if (pressedKey["39"]) { //right
			let cameraPos_tmp = glm.normalize(glm.cross(cameraFront, cameraUp));
			cameraPos.x+=cameraPos_tmp.x * cameraSpeed;
			cameraPos.y+=cameraPos_tmp.y * cameraSpeed;
			cameraPos.z+=cameraPos_tmp.z * cameraSpeed;
		}

		let cameraFront_tmp = glm.vec3(1,1,1);
		cameraFront_tmp.x = cameraPos.x+cameraFront.x;
		cameraFront_tmp.y = cameraPos.y+cameraFront.y;
		cameraFront_tmp.z = cameraPos.z+cameraFront.z;
		mat4.lookAt(view, cameraPos, cameraFront_tmp, cameraUp);
		gl.uniformMatrix4fv( uniView, false, view);

	}

	let x = 50; //zmiana położenia w kierunku x
	let y = 50; //zmiana położenia w kierunku y
	let yaw =-90; //obrót względem osi X
	let pitch=0; //obrót względem osi Y

	function ustaw_kamere_mysz(e) {
		let xoffset = e.movementX;
		let yoffset = e.movementY;

		let sensitivity = 0.1;
		let cameraSpeed = 0.05*elapsedTime;

		xoffset *= sensitivity;
		yoffset *= sensitivity;

		yaw += xoffset * cameraSpeed;
		pitch -= yoffset*cameraSpeed;

		if (pitch > 89.0)
			pitch = 89.0;
		if (pitch < -89.0)
			pitch = -89.0;
		let front = glm.vec3(1,1,1);

		front.x = Math.cos(glm.radians(yaw))*Math.cos(glm.radians(pitch));
		front.y = Math.sin(glm.radians(pitch));
		front.z = Math.sin(glm.radians(yaw)) * Math.cos(glm.radians(pitch));
		cameraFront = glm.normalize(front);
	}

	function StereoProjection(_left, _right, _bottom, _top, _near, _far, _zero_plane, _dist, _eye)
	{
		//    Perform the perspective projection for one eye's subfield.
//    The projection is in the direction of the negative z-axis.
		//            _left=-6.0;
		//            _right=6.0;
		//            _bottom=-4.8;
// _top=4.8;
//    [default: -6.0, 6.0, -4.8, 4.8]
//    left, right, bottom, top = the coordinate range, in the plane of zero parallax setting,
//         which will be displayed on the screen.
//         The ratio between (right-left) and (top-bottom) should equal the aspect
//    ratio of the display.
		//                  _near=6.0;
		//                  _far=-20.0;
//    [default: 6.0, -6.0]
//    near, far = the z-coordinate values of the clipping planes.
		//                  _zero_plane=0.0;
//    [default: 0.0]
//    zero_plane = the z-coordinate of the plane of zero parallax setting.
//    [default: 14.5]
		//                     _dist=10.5;
//   dist = the distance from the center of projection to the plane of zero parallax.
//    [default: -0.3]
		//                 _eye=-0.3;
//    eye = half the eye separation; positive for the right eye subfield,
//    negative for the left eye subfield.
		let   _dx = _right - _left;
		let   _dy = _top - _bottom;
		let   _xmid = (_right + _left) / 2.0;
		let   _ymid = (_top + _bottom) / 2.0;
		let   _clip_near = _dist + _zero_plane - _near;
		let   _clip_far = _dist + _zero_plane - _far;
		let  _n_over_d = (_clip_near / _dist);
		let   _topw = _n_over_d * _dy / 2.0;
		let   _bottomw = -_topw;
		let   _rightw = _n_over_d * (_dx / 2.0 - _eye);
		let   _leftw = _n_over_d * (-_dx / 2.0 - _eye);
		const proj = mat4.create();
		mat4.frustum(proj, _leftw, _rightw, _bottomw, _topw, _clip_near, _clip_far)
		mat4.translate(proj, proj, [-_xmid - _eye, -_ymid, 0]);
		let uniProj = gl.getUniformLocation(program, 'proj');
		gl.uniformMatrix4fv( uniProj, false, proj);
	}





}
