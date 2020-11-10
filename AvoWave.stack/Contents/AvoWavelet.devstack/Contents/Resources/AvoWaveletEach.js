
function %id%init() {
	var ctx;											// drawing context
	var canvasWidth;
	var canvasHeight;

	var canvas = document.getElementById('AvoWaveCanvas%parentId%');
    if (canvas.getContext) {
			container = document.getElementById("AvoWaveCanvasContainer%parentId%");
			canvasWidth =  canvas.width = container.offsetWidth;
			canvasHeight =  container.offsetHeight;
// Set the context variable so it can be re-used
//        function Wave(
//			ctx = context
//			width,
//			height,
//          nP = number of peaks horizontally, 
//          yP height as percentace of container height, 
//          pT = period turbulance (0->2.0), 
//          pMt = period mid point turbulance (0-1.0) 
//          aT = Amplitude turbulance
//           yT = ystart turbluance, sC, eC, lW, nS)
//          end color, start color, line width, # steps.
//

            ctx = canvas.getContext('2d');
            stacks.%parentId%.addWave(new stacks.com_RHS_AvoWave.Wave(ctx, canvasWidth, canvasHeight, 
				%id=numPeaks%, %id=yHeightPercent%, %id=periodTurbulance%, %id=periodMidTurbulance%,
				%id=ampTurbulance%, %id=yStartTurbulance%,"%id=startColor%", "%id=endColor%",
				%id=lineWidth%, %id=numSteps%, %id=numEchos%));
    }

}

// Initialize the scene
%id%init();
