//
//	AvoWavePage.js
//
//	This is loaded once per page and contains the Wave object, the wave array for this container, 
//	the container variables that are good for all included wavelets (FPS, background color, etc.) 
//	and some utility code.
//
//	The code in here is contained in the Page Stack referred to as stacks.com_RHS_AvoWave
//	This is the CFBundleIdentifier for the AvoWave stack.
//
 
//
//	utilites.
//
function min(a,b)
{
    return((a<b)? a: b);
}
function max(a,b)
{
    return((a>b)? a: b);
}function abs(a)
{
    return ((a < 0)  ?-a : a);
}

function weighted(val1, val2, num, den)
{
    return (val1 + (((val2 - val1) * num) / den));
}

function gradient(a, b) { 
            return (b.y-a.y)/(b.x-a.x); 
} 

//
//	Drawing code
//

function bzCurve(ctx, points, f, t) { 
    if (typeof(f) == 'undefined') f = 0.3; 
    if (typeof(t) == 'undefined') t = 0.6; 
    
    ctx.beginPath(); 
    ctx.moveTo(points[0].x, points[0].y); 
    
    var m = 0; 
    var dx1 = 0; 
    var dy1 = 0; 

    var preP = points[0]; 

    for (var i = 1; i < points.length; i++) { 
        var curP = points[i]; 
        nexP = points[i + 1]; 
        if (nexP) { 
            m = gradient(preP, nexP); 
            dx2 = (nexP.x - curP.x) * -f; 
            dy2 = dx2 * m * t; 
        } else { 
            dx2 = 0; 
            dy2 = 0; 
        } 
            
        ctx.bezierCurveTo( 
            preP.x - dx1, preP.y - dy1, 
            curP.x + dx2, curP.y + dy2, 
            curP.x, curP.y 
        ); 
        
        dx1 = dx2; 
        dy1 = dy2; 
        preP = curP; 
    } 
    ctx.stroke(); 
} 

//  Color manipulation routines

function getRGBA(str){
  var match = str.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d*)?)\))?/);
  return match ? {
    red: parseInt(match[1]),
    green: parseInt(match[2]),
    blue: parseInt(match[3]),
    alpha: parseFloat(match[4])
  } : {};
}

//
//	since the wave echos, we also change the color of the wave echos between the start and the end color of the
//	wavelet.
//
function weightedColor(val1, val2, num, den)
{
    var m1 = getRGBA(val1);
    var m2 = getRGBA(val2);

    if(m1 && m2) {
        var alpha = weighted(m1.alpha, m2.alpha, num, den);
        return { colorStr: "rgba("+
                    weighted(m1.red, m2.red, num, den) + "," +
                    weighted(m1.green, m2.green, num, den) + "," +
                    weighted(m1.blue, m2.blue, num, den) + "," +
                    alpha +")" ,
            alpha: alpha};
    }
    return {colorStr: val1, alpha: 1.0}
}
    

//
//	A single Wave.
//

return {  Wave : function(ctx, w, h, nP, nA, pT, pMTP, aT, yT, sC, eC, lW, nS, nE) {

//
//	Save creation parameters for later regeneration when the window size changes.
//
	this.ctx = ctx;
	this.width = w; this.height = h; this.nP = nP; this.nA = nA; this.pT = pT; this.pMTP = pMTP;
	this.aT = aT; this.yT = yT; this.sC = sC; this.eC = eC; this.lW = lW; this.nS = nS;
	this.nE = nE;
//
//	Calculate the rest of the variables off the calling parameters.
//
    this.nominalPeriod = (this.width/nP)/2;	  	// number Periods converted to pixel distance.
    this.nominalAmplitude = this.height*nA;  		// amplitude as a function of height.
    this.periodTurbulance = pT * this.nominalPeriod;		        // if we decide to vary the distances between points
    this.periodMidTurbulancePercent = pMTP * this.nominalPeriod;	// how the mid point slides around as percentage
    this.amplitudeTurbulance = aT * this.nominalAmplitude;
    this.startColor = sC;
    this.endColor = eC;
    this.yTurbulance = yT*this.nominalAmplitude;
    this.lineWidth = lW;
    this.steps = nS;                        // number of steps in a cycle.
    this.curBias = true;
//
//	echo variables
//
    this.numberEchos = nE;					// how many echos we will draw.
    this.echoArrays = [];					// the array to store echos
    this.startDisplayEcho = 0;              // first echo to draw;
    this.nextEcho = 0;						// slot to put the next echo in. (rolling)
//
//	stepping variables
//
    this.sideSteps = 5;                     // side steps is the shift left or right between waves to create
                                            // the effect of panning.
    this.curSideSteps = 0;
    this.showNodes = false;
    
    this.currentStep=0;
 
    this.setEcho = function(count)
    {
        this.echoArrays = [];           // empty.
        this.numberEchos = count;
        this.startDisplayEcho = 0;
        this.nextEcho = 0;
        while(count--)
            this.echoArrays.push([]);       // empty array.
    }
	//
	//	Each wave has two wavelet arrays and the drawing animates between the two based on the number of steps
	//	when the wave object is created.  As we animate through tweening of the endpoints and colors, we save
	//	each captured array in the echo array.
	//	
	//	All of the animated movement between wave is calculated in this routine.  If you want to use a different
	//	algorithm to create the waves, this is where you'd do it.
	//
	//	This algorithm uses variations on a SIN wave.  This bias should toggle each time this is called so that
	//	the waves are flipped in the y direction.:w
	//
    this.makeWave = function(bias)
    {
        var ptsArray = [];
        var ymid = this.height/2;
        var y = ymid + (this.amplitudeTurbulance * Math.random() - (this.amplitudeTurbulance/2));
        var lasty = y;
        var lastx = -(this.nominalPeriod * (this.sideSteps - this.curSideSteps))/this.sideSteps;
//      if(++this.curSideSteps >= this.sideSteps) 
//      {
//          this.curSideSteps=0;
            ptsArray.push({ x:lastx, y:lasty});
//      }
//      else {
//          ptsArray.push({ x:lastx, y:lasty}); 
//      }        // push the first

        while(lastx < this.width + this.nominalPeriod) {
            var period =this.nominalPeriod + (this.periodTurbulance * Math.random() - (this.periodTurbulance/2));
            var nextx = lastx + period;
            var yvar = this.nominalAmplitude + (this.amplitudeTurbulance * Math.random() - (this.amplitudeTurbulance/2));
            var nexty = lasty + this.yTurbulance * Math.random() - this.yTurbulance/2;
            var midx = lastx + (nextx - lastx)/2;
            var midy = lasty + (nexty - lasty)/2;
            if (bias) {
                midy += yvar;
            } else {
                midy -= yvar;
            }
            var xx = (this.periodMidTurbulancePercent * this.periodTurbulance/100);
            xx = xx * Math.random() - xx/2;    // slide the midpoint;
            midx += xx;
            ptsArray.push({x:midx, y:midy});
            ptsArray.push({x:nextx, y:nexty});
            lastx = nextx; lasty = nexty;
            bias = ! bias;

        }
        return ptsArray;
    }


	this.showPt = function(x,y,fillStyle) 
	{
		this.ctx.save();
		this.ctx.beginPath();
		if (fillStyle) {
			this.ctx.fillStyle = fillStyle;
		}
		this.ctx.arc(x, y, 5, 0, 2*Math.PI);
		this.ctx.fill();
		this.ctx.restore();
	}

    this.updateArray = function()
    {
        var addLenght = min(this.pts1.lenght, this.pts2.lenght);
    }

	this.addWaveToEchos = function(arr)
	{
		this.echoArrays[this.nextEcho] = [];
		for(i= 0; i < arr.length; i++) {
			this.echoArrays[this.nextEcho].push(arr[i]);    // copy the curve array to the echo line.
		}
		this.nextEcho = (this.nextEcho + 1) % this.numberEchos;
	}
		
    this.drawWaveArray = function(ctx, arr, color)
    {
		this.ctx = ctx;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = this.lineWidth;

		this.ctx.strokeStyle = this.startColor;
		var m1 = getRGBA(this.startColor);
		this.ctx.globalAlpha = m1.alpha;
		bzCurve(this.ctx,arr);
	
//
//	Save this to the echo array if we are saving echos.
//
		if(this.numberEchos > 0 )  {
			this.addWaveToEchos(arr);

			for(var i=0; i < this.echoArrays.length; i++) {
				
				var index = (this.startDisplayEcho + i) % this.echoArrays.length;;
				var retColor =  weightedColor(this.endColor, this.startColor, i, this.numberEchos); 
				this.ctx.strokeStyle = retColor.colorStr;
				this.ctx.globalAlpha = retColor.alpha;
				bzCurve(this.ctx,this.echoArrays[index]);
			}

//
//	If we have all of the echos we need, loop around and reuse slots.
//
			if(this.echoArrays.length >= this.numberEchos) 
				this.startDisplayEcho = (this.startDisplayEcho + 1) % this.numberEchos;
		}
        
        this.ctx.restore();

        if(this.showNodes) {
            for(var i = 1; i < arr.length-1; i+= 2 ) {
                this.showPt(arr[i].x,arr[i].y,"rgba(255,0,0,1");
                this.showPt(arr[i+1].x,arr[i+1].y,"rgba(255,255,0,1");
            }
        }
      
    }

    this.draw = function(ctx) 
    {
        this.drawWaveArray(ctx, this.currentPts,this.startColor);
    }
     
    this.update = function()
    {
        this.currentPts = [];
        var lengthPts =  min(this.pts1.length, this.pts2.length);

        for(var i =  0; i < lengthPts; i++) {
            if(i >= this.pts1.lenght || i >= this.pts2.length) {
                console.log("HELP");
            }
            var newx = weighted(this.pts1[i].x, this.pts2[i].x, this.currentStep, this.steps);
            var newy = weighted(this.pts1[i].y, this.pts2[i].y, this.currentStep, this.steps);
            this.currentPts.push({x:newx, y:newy});
        }
        if(++this.currentStep == this.steps) {
            this.currentStep = 0;
            this.pts1 = []
            for(var i = 0; i < this.pts2.length; i++) {
                this.pts1.push(this.pts2[i]);
            }
            this.pts2 = [];
            this.pts2 = this.makeWave(this.curBias);
            this.curBias  = ! this.curBias;
        }
    }

    this.pts1 = this.makeWave(true);                                // array of first points
 	this.pts2 = this.makeWave(false);								// array of second points.
    
}
}


