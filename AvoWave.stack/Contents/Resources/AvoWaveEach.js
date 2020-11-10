//
//	AvoWaveEach.js - contains code for the container of wavelets.
//

var allWaves = [];					// All waves will go here.
var targetFPS = %id=AWFPS%;
var backgroundColor = "%id=AWbackgroundColor%"

//
//	Create an observer for when the window changes.
//
//	When ever the window changes, we need to recalculate the waves to reflect the window.
//	we create a second list of waves with the new parameters and then replace allWaves with new waves.
//
function %id%restart() {

	var tmpWaves = [];

	var canvas = document.getElementById('AvoWaveCanvas%id%');

    if (canvas.getContext) {
		container = document.getElementById("AvoWaveCanvasContainer%id%");
		canvasWidth =  canvas.width = container.offsetWidth;
		canvasHeight =  container.offsetHeight;
		allWaves.forEach(function(wave) {

            tmpWaves.push(new stacks.com_RHS_AvoWave.Wave(wave.ctx, canvasWidth, canvasHeight, 
				wave.nP, wave.nA, wave.pT, wave.pMTP, wave.aT, wave.yT, wave.sC, wave.eC, wave.lW, wave.nS, wave.nE));
		});
	}

	allWaves = [];

	tmpWaves.forEach(function(wave) {
		allWaves.push(wave);
		});
}


function %id%draw() 
{
	var canvas = document.getElementById('AvoWaveCanvas%id%');
    if (canvas.getContext) {
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(0,0,canvas.width, canvas.height);
		 allWaves.forEach(function(wave) {
			wave.draw(ctx);
		});

	}
}


function %id%update()
{
    allWaves.forEach(function(wave) {
        wave.update()
    });
}

$( document ).ready(function() {
	window.addEventListener("resize", %id%restart);

	// Main animatino loop for this collection of waves.

	setInterval(function() {
			// Update the scene befoe drawing
			%id%update();

			// Draw the scene
			%id%draw();
	}, 1000 / targetFPS);
});

//
//	Add a wave and initialize the animation if it has not been started.
//
return { addWave: function(wave) {
	allWaves.push(wave);
	}
}


