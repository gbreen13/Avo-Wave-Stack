<img width="1503" alt="Screen Shot 2020-11-10 at 5 13 46 PM" src="https://user-images.githubusercontent.com/6044221/98740828-aae3c180-2379-11eb-9e69-cf11cd1451aa.png">

# Avo-Wave-Stack
This is a Rapid Weaver/Stacks 4.0 compatible stack for generating moving horizontal ornamental waves in Web Sites created with Rapid Weaver
using the YourHead Stacks 4.0 plugin.

## Requirements
Mac
Rapid Weaver ver 8 from RealMac Software
Stacks 4 from YourHead
I use with Joe Workman's Foundation.  Doesn't seem to work otherwise.  I haven't bothered to find out why.

## Install
download the folder, unzip and drag onto the Rapid Weaver icon.

## to Install and Use
simply drag the AvoWave stack onto the page.   This stack has parameters for background color and target frames/per second which tell teh animatino loop how frequently to run.
When the stack is added, one Wavelet is added as well.  You can add move wavelets to this canvas by hitting the + icon.

## Wave Parameters
<img width="329" alt="Screen Shot 2020-11-10 at 5 35 56 PM" src="https://user-images.githubusercontent.com/6044221/98741765-3dd12b80-237b-11eb-96d8-30fe08f150b8.png">

The parameters for the Wavelet allow random behavior of the wave.

**Start Color and End Color**
The waves are setup to draw echos of themselves as they randomly mutate.  The echo representations will transition smoothly from the Start Color to the End Color.  Opacity is enabled so a common use would be to have the end color be the same as the start color but with opacity turned way down.  That way the wave fades into the background.

**# wave peaks per canvas width**
low numbers are best: 2 to 4 for smooth waves

**amp Height**
real number from 0-.5 represents the nominal height and depth of a wave as a percentage of the canvas height.

**period turbulance**
real number 0-.9 modifies thelocation of the wave periods

**mid-period turbulance**
similar to above for the half distance

**amp turbulance**
random modifer for the wave height

**y Start Turbulance**
normall wave begins at half the canvas height.  this randomly modifies that start position.

**Line Width**
normally 1 but can be higher for fatter lines.

**Number of Steps**
this represents the tweening interval between wave animations.

**Number of Echos**
Hw many waves we will track
