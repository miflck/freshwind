var vanes = [];
  var countX;
  var countY;

let img1; // Declare variable 'img'.
let img2; // Declare variable 'img'.
let img3; // Declare variable 'img'.
let img4; // Declare variable 'img'.
let img5; // Declare variable 'img'.
let imageArray=[];

let actualImage;

let nullImage; // Declare variable 'img'.



var theta = 0;
var rasterwidth = 18;
var rasterwidthMin=10;
var rasterwidthMax=100;
var rasterwidthBefore=rasterwidth;

var weight=10;



var unmaskedAlphaMin=0;
var unmaskedAlphaMax=255;
var unmaskedAlpha=80;


var alphaTraceMin=0;
var alphaTraceMax=255;
var alphaTrace=110;



// gui params
var strokeWidth = 4;

var strokeWidthMin = 1;
var strokeWidthMax = 20;

var globalStrokeColor = '#0000dd';

var radius = 20;
var images = ['img1', 'img2', 'img3', 'img4', 'img5'];




var durationBlack = 2500;
var durationBlackMin=100;
var durationBlackMax=10000;
var durationAlpha = 2000;
var durationAlphaMin=100;
var durationAlphaMax=10000;


var durationDilitation = 200;
var durationDilitationMin = 0;
var durationDilitationMax = 5000;


var intervall=1;
var intervallMin=1;
var intervallMax=100;

var howMuchRows=1;
var howMuchRowsMin=1;
var howMuchRowsMax=20;

var inverted =false;

var off =false;

var isFlutter =true;


var center = false;


var fade = false;



var waveNum=0;

var waveIsRunning=false;
var waveAngleFactor=2*Math.PI;
var startWaveMillis;

var zerowaveIsRunning=false;



var flutterWaveNum=0;
var flutterFact=0;


p5.disableFriendlyErrors = true; // disables FES


var numVanes;



var winds=[];
var windObjects=[];

let latestAngle=0;


// Buffer
let buffer;
var isOffscreen=true ;


//var fixedWindowWidth=1920;
//var fixedWindowHeight=1200;


var fixedWindowWidth=1280
var fixedWindowHeight=720;

var scaleFact=1;

//var fixedBufferWidth=1280*scaleFact;
//var fixedBufferHeight=800*scaleFact;


var fixedBufferWidth=1280;
var fixedBufferHeight=720;


var state;
let oldstate;
const WAVE =0;
const CONTENT=1;

var zeroStartX=fixedWindowWidth-50;
var zeroStartY=0;


function preload() {
    img1 = loadImage('assets/1111.png');
    img2 = loadImage('assets/2222.png');
    img3 = loadImage('assets/3333.png');
    nullImage=loadImage('assets/null.png');
}


let colors;


let bIsTimed=false;

let eraseWaveInitTime;
let eraseWaveTimerDuration;

let waveInitTime;
let waveTimerDuration;


function setup() {

  createCanvas(fixedWindowWidth, fixedWindowHeight);
  //buffer = createGraphics(fixedBufferWidth, fixedBufferHeight);
   buffer = createGraphics(fixedWindowWidth, fixedWindowHeight);

  buffer.smooth(8);

  frameRate(60);

  // Create Layout GUI
  gui = createGui('P5 GUI');
  gui.addGlobals( 'rasterwidth','strokeWidth','center','unmaskedAlpha','fade','alphaTrace','isOffscreen','inverted','isFlutter');

  img1.loadPixels();
  img2.loadPixels();
  img3.loadPixels();


  imageArray.push(img1);
  imageArray.push(img2);
  imageArray.push(img3);




  createVanes();

  colors=[];
  colors.push(color('#5EC29C'));
  colors.push(color('#3DAA9A'));
  colors.push(color('#2A9192'));
  colors.push(color('#287884'));
  colors.push(color('#2D5F70'));
  colors.push(color('#008FBD'));
  colors.push(color('#007AC0'));
  colors.push(color('#0062B8'));

  waveInitTime=millis();
  eraseWaveInitTime=millis();
  eraseWaveTimerDuration=random(500,1000);
  waveTimerDuration=random(2000,4000);


  actualImage=img1;
  actualImageIndex=0;
  setMask(actualImage);
  pixelDensity(1);
  gui.hide();

  state=WAVE;


    buffer.strokeWeight(strokeWidth);


}


function createVanes(){
  vanes =[];
  res = rasterwidth;
   countX = ceil(fixedBufferWidth/res) + 1;
   countY = ceil(fixedBufferHeight/res) + 1;
  for (var j = 0; j < countY; j++) {
    for (var i = 0; i < countX; i++) {
      vanes.push( new WindVane(res*i, res*j) );
    }
  };
  numVanes=vanes.length;
  console.log("num Vanes"+numVanes);
}






function draw() {
var mil=millis();
if(bIsTimed){
  if(mil>eraseWaveInitTime+eraseWaveTimerDuration){
   makeEraseWave(false);
    eraseWaveInitTime=millis();
    eraseWaveTimerDuration=random(500,4000);
  }
    if(mil>waveInitTime+waveTimerDuration){
    actualImageIndex++;
    actualImage=imageArray[actualImageIndex%imageArray.length];
    setMask(actualImage);
    makeWave(false);
    waveInitTime=millis();
    waveTimerDuration=random(10000,20000);
    eraseWaveInitTime=millis();
    eraseWaveTimerDuration=random(4000,6000);
  }
}
/*
  switch(images){
        case 'img1':
          actualImage=img1;
        break;
        case 'img2':
          actualImage=img2;
        break;
        case 'img3':
          actualImage=img3;
        break;
        case 'img4':
          actualImage=img4;
        break;
        case 'img5':
          actualImage=img5;
        break;
        case 'img6':
          actualImage=img6;
        break;
  }*/


  buffer.background(255,alphaTrace);
  clear();
        
  updateWind();


  switch(state){
        case WAVE:
          updateVanes(mil);
        break;

        case CONTENT:
          updateVanesInverse(mil);
        break;
        
  }




  // Gui changes
  if(rasterwidth!=rasterwidthBefore){
      createVanes();
  }

/*
//var intervall=1;
  if(waveIsRunning){
   if(millis()>intervall+startWaveMillis){
      for(var i=0;i<howMuchRows;i++){
        wave();
      }
      startWaveMillis=millis();
    }
  }

if(zerowaveIsRunning){
   if(millis()>intervall+startWaveMillis){
      for(var i=0;i<howMuchRows;i++){
        zeroWave();
      }
      startWaveMillis=millis();
    }
  }

*/


//flutterWave();

  //background(255,255);




 // push();



  

  //pop();
  // blendMode(MULTIPLY);
  // if(!off)if(isOffscreen)image(buffer,0,0,width,height);
  // if(!off)if(isOffscreen)image(buffer,0,0,fixedWindowWidth,fixedWindowHeight);





     
    image(buffer,0,0);
    theta-=0.2;
    rasterwidthBefore=rasterwidth;
    
    let fps = frameRate();
    fill(255,0,0);
    noStroke();
    text("FPS: " + fps.toFixed(2), 10, height - 10);


}


function changeState(newState){
  oldstate=state;
  state=newState;


    switch(state){
        case WAVE:
        setMask(actualImage);
        makeEraseWave(false);
       // makeWave(false);

        var c=select("#content");
        c.removeClass('fadeIn');
        c.addClass('fadeOut');

        break;

        case CONTENT:
        setMask(nullImage);
        makeWaveWithPosition(zeroStartX,zeroStartY);

        var c=select("#content");
        c.addClass('fadeIn');
        c.removeClass('fadeOut');

        break;
      }
}


function updateWind(){

    winds.map((wind,i) =>{
    wind.move();
    if(wind.getDeleteMe()){
      console.log("delete "+i);
      winds.splice(i,1);
    }
  })
}


function updateVanes(millis){
  for(var i=0;i<vanes.length;i++) {       
      var vane=vanes[i];
          winds.map((wind,i) =>{

            //var wind=winds[w];
            if (wind.windobject==true){
                let outer=check_a_point(vane.x,vane.y,wind.pos.x,wind.pos.y,wind.radius);

                if(outer){
                  setActiveDebug(vane,wind);
                }

            }else{
              let outer=check_a_point(vane.x,vane.y,wind.x,wind.y,wind.radius);
              let inner=check_a_point(vane.x,vane.y,wind.x,wind.y,wind.currentInnerRadius);
             
             // Circles
             if(outer &! inner){
               setActive(vane,wind);
              };
         }
      })
        
        vane.update(millis);
        vane.fadeTo(vane.targetAlpha,0.09);
        vane.strokeColor.setAlpha(vane.currentAlpha);
        buffer.stroke(vane.strokeColor);

        var dX=Math.cos(vane.getCurrentAngle()+vane.flutter())*rasterwidth;
        var dY=Math.sin(vane.getCurrentAngle()+vane.flutter())*rasterwidth;

      buffer.line(vane.x,vane.y,vane.x+dX,vane.y+dY);
      vane.hasDisplayed();
    }
}



function updateVanesInverse(millis){
  for(var i=0;i<vanes.length;i++) {       
      var vane=vanes[i];
          winds.map((wind,i) =>{
              let outer=check_a_point(vane.x,vane.y,wind.x,wind.y,wind.radius);
              let inner=check_a_point(vane.x,vane.y,wind.x,wind.y,wind.currentInnerRadius);
             
             if(outer &! inner){
               setActiveInverse(vane,wind);
              };
          })
        
        vane.update(millis);
        vane.fadeTo(vane.targetAlpha,0.09);
        vane.strokeColor.setAlpha(vane.currentAlpha);
        buffer.stroke(vane.strokeColor);

        var dX=Math.cos(vane.getCurrentAngle()+vane.flutter())*rasterwidth;
        var dY=Math.sin(vane.getCurrentAngle()+vane.flutter())*rasterwidth;

      buffer.line(vane.x,vane.y,vane.x+dX,vane.y+dY);
      vane.hasDisplayed();
    }
}

function setActive(vane,wind){
  //if(!vane.isActive){
  //vane.isActive=true;
   var angle=wind.angle
    var duration=wind.duration
    vane.setDuration(duration);
    vane.setTargetAngle(angle); 
    vane.setEasingType(wind.easingType);
    vane.setColor(wind.color);
    if(wind.isMasked){
      if(vane.isOnMask){
        vane.setDuration(duration+500);
        vane.setTargetAngle(angle+PI/4); 
        vane.setAlphaDuration(duration-500);
        vane.setTargetAlpha(255);
        vane.setFlutterParams(500,50,0.5)
      }else{
        vane.setAlphaDuration(duration-500);
        vane.setTargetAlpha(unmaskedAlpha);
        if(fade)vane.setTargetAlpha(0);
        vane.setFlutterParams(500,100,0.05)
      }
    }else{
        vane.setTargetAlpha(255);
    }
 // }
}


function setActiveInverse(vane,wind){
  //if(!vane.isActive){
  //vane.isActive=true;
   var angle=wind.angle
    var duration=wind.duration
    vane.setDuration(duration);
    vane.setTargetAngle(angle); 
    vane.setEasingType(wind.easingType);
    vane.setColor(wind.color);
    if(wind.isMasked){
      if(vane.isOnMask){
        vane.setDuration(duration+500);
        vane.setTargetAngle(angle+PI/4); 
        vane.setAlphaDuration(duration-500);
        vane.setTargetAlpha(0);
        vane.setFlutterParams(500,50,0.5)
      }else{
        vane.setAlphaDuration(duration-500);
        //vane.setTargetAlpha(unmaskedAlpha);
        vane.setTargetAlpha(255);
        vane.setFlutterParams(500,100,0.05)
      }
    }else{
        vane.setTargetAlpha(255);
    }
 // }
}



function setActiveDebug(vane,wind){
   var angle=wind.angle
              var duration=wind.duration
              vane.setDuration(duration);
              //vane.setTargetAngle(angle); 
              vane.setEasingType(wind.easingType);
              vane.setColor(wind.color);

              if(wind.isMasked){
                if(vane.isOnMask){
                  vane.setDuration(duration+500);
                  vane.setTargetAngle(angle+PI/4); 
                  vane.setAlphaDuration(duration-500);
                  vane.setTargetAlpha(255);
                  vane.setFlutterParams(500,50,0.5)
                }else{
                  vane.setAlphaDuration(duration-500);
                  vane.setTargetAngle(angle); 
                  vane.setTargetAlpha(unmaskedAlpha);
                  if(fade)vane.setTargetAlpha(0);
                  vane.setFlutterParams(500,100,0.05)
                }
              }else{
                  vane.setTargetAlpha(255);
                  vane.setTargetAngle(angle); 
              }
}


function mouseMoved(){
  /*for (var i = 0; i < vanes.length; i++) {
		var h = new p5.Vector(mouseX-vanes[i].x,mouseY-vanes[i].y);
		vanes[i].setAngle(h.heading());
 	//vanes[i].targetAngle=random(0,2*PI);
    }*/

//winds.push(new Wind(mouseX,mouseY))

}


function mouseClicked(){
//actualImageIndex++;
//actualImage=imageArray[actualImageIndex%imageArray.length];
//winds.push(new Wind(mouseX,mouseY));
}

function calcXWave(posX,theta,waveLength){
  dx=map(posX,0,width,0,waveLength);
  dx+=theta;
  return sin(dx);
}


/*function getAlphaVal(posx, posy, image){
  var fact=image.width/fixedWindowWidth;
  var factH=image.height/fixedWindowHeight;
  var off=((image.height*fact)-fixedWindowHeight)/2;
  var c=  image.get(posx*fact,(posy*fact)-off/2);
  let value = alpha(c); 
  return value;
}*/


/*
function getAlphaVal(posx, posy, image){
  var fact=image.width/fixedBufferWidth;
  var factH=image.height/fixedBufferHeight;
  var off=((image.height*fact)-fixedBufferHeight)/2;
  var c=  image.get(posx*fact,(posy*fact));
  let value = alpha(c); 
  return value;
}*/

function getAlphaVal(posx, posy, image){
  var fact=image.width/fixedBufferWidth;
  var factH=image.height/fixedBufferHeight;
  var off=((image.height*fact)-fixedBufferHeight)/2;
  var c=  image.get(posx*fact,(posy*fact));
  let value = alpha(c); 
  return value;
}

function getRow(num){

  var returnV=[];
  for (var i = num; i < vanes.length; i+=countX) {
      returnV.push(vanes[i]);
    }
    return returnV;
}

function mousePressed(event) {

/*	for (var i = 0; i < vanes.length; i++) {

    let alph=getAlphaVal(vanes[i].x , vanes[i].y,img);

		let loc = (vanes[i].x + vanes[i].y * img.width) * 4;
    var c=  img.get(vanes[i].x , vanes[i].y);
		let value = alpha(c); // Sets 'value' to 255
		
    var h = new p5.Vector(mouseX-vanes[i].x,mouseY-vanes[i].y);
    let m=map(alph,0,255,-PI,2*PI+PI/4);
    if(alph>200){
        vanes[i].targetAngle=m;
      }
    let transparency=map(alph,255,0,255,0);
      if(alph<255){
       vanes[i].setAlpha(transparency);
      }
       // vanes[i].setColor(color(0,0,0));

		//vanes[i].targetAngle=h.heading();
     	
    }*/
}


function makeWaveWithZero(){
    var vel =20;//random(50,70);
    var col=floor(random(0,colors.length-0.9));
    var ang=int(random(10,15));
    if(ang%4==0)ang+=PI/2;
    var dur=map(ang,3,5,500,1000);//random(500,3000);
    var wait=dur;
    winds.push(new WindWidthParameters(mouseX,mouseY,vel,ang,dur,0,'easeInQuad',col,false));
    winds.push(new WindWidthParameters(mouseX,mouseY,vel,ang,dur,wait,'easeOutQuad',col,true));
}


function makeWave(isMouse){
    var vel =20;//random(10,20);
    var col=floor(random(0,colors.length-0.9));
    var ang=int(random(3,5));
    if(ang%4==0)ang+=PI/2;
    var dur=map(ang,3,5,500,1000);//random(500,3000);
    var wait=dur;
    var xPos=random(-100,0);
    var yPos=random(fixedWindowHeight);
    if(isMouse){
      winds.push(new WindWidthParameters(mouseX,mouseY,vel,ang,dur,0,'easeOutQuad',col,true));
    }else{
      winds.push(new WindWidthParameters(xPos,yPos,vel,ang,dur,0,'easeOutQuad',col,true));
    }
}



function makeWaveWithPosition(posX,posY){
    var vel =20;//random(10,20);
    var col=floor(random(0,colors.length-0.9));
    var ang=int(random(3,5));
    if(ang%4==0)ang+=PI/2;
    var dur=map(ang,3,5,500,1000);//random(500,3000);
    var wait=dur;
    var xPos=posX;
    var yPos=posY;
    winds.push(new WindWidthParameters(xPos,yPos,vel,ang,dur,0,'easeOutQuad',col,true));
}


function makeEraseWave(isMouse){
    var vel =20;//random(10,20);
    var col=floor(random(0,colors.length-0.9));
    var ang=int(random(3,5));
    if(ang%4==0)ang+=PI/2;
    var dur=map(ang,3,5,500,1000);//random(500,3000);
    var wait=dur;
    var xPos=random(-100,0);
    var yPos=random(fixedWindowHeight);
    if(isMouse){
      winds.push(new WindWidthParameters(mouseX,mouseY,vel,ang,dur,0,'easeOutQuad',col,false));
    }else{
      winds.push(new WindWidthParameters(xPos,yPos,vel,ang,dur,0,'easeOutQuad',col,false));
    }
}


function setMask(image){
for(var i=0;i<vanes.length;i++) {       
    var vane=vanes[i];
    let alph=getAlphaVal(vane.x , vane.y,image);
      if(alph>5 ){
        vane.isOnMask=true;
      }else{
        vane.isOnMask=false;
        }
    }
}


function keyPressed(event){
  if(event.key=='x'){
    actualImageIndex++;
    actualImage=imageArray[actualImageIndex%imageArray.length];

    setMask(actualImage);
  }


  if(event.key=='W'){

      makeWaveWithZero();

  }




  if(event.key=='w'){
    makeWave(false);
  }



  if(event.key=='z'){
    makeEraseWave(false);
  }
/*
    if(event.key=='z'){
    winds.push(new Wind(mouseX,mouseY,false));
  }
*/


  if(event.key=='h'){
    changeState(CONTENT);
  }
 if(event.key=='H'){
         changeState(WAVE);

  }

if(event.key=="o"){
      var vel =5;//random(10,20);
    var col=floor(random(0,colors.length-0.9));
    var ang=int(random(1,2));
    if(ang%4==0)ang+=PI/2;
    var dur=map(ang,1,2,500,800);//random(500,3000);
    var wait=dur;
  winds.push(new WindObjectWithParameters(mouseX,mouseY,random(400,800),random(400,800),vel,20,ang,dur,0,'easeInQuad',col,false));
}


}

function touchEnded() {
    // makeWaveWithZero();
}





function calcVec(x, y) {
  return new p5.Vector(y - x, - x - y);
}




// Jitter class
class WindVane {

  constructor(iX,iY) {
    this.x = iX;
    this.y =iY;
    this.diameter = rasterwidth;

    this.position=new p5.Vector(this.x, this.y);

    this.strokeColor=color(0,100,200);
    this.alpha=255;
    
    this.startAngle=0;
    this.thetaAngle=0;//this.targetAngle-this.startAngle;
    this.currentAngle=0;
    this.targetAngle=0;


   
   // if(iY<height/2)this.duration = map(iY,0,height/2,4000,3000);
   // if(iY>height/2)this.duration = map(iY,height/2,height,3000,4000);
    this.duration=4000;
    this.endAnimation=millis()+this.duration;
    this.startAnimation=millis();



    this.startAlpha=255;
    this.currentAlpha=255;
    this.thetaAlpha=0;
    this.targetAlpha=255;
    this.alphaDuration=4000;
    this.startAlphaAnimation=millis();
    this.endAlphaAnimation=millis+this.alphaDuration;


    this.circleDistance=500;
    this.circleRadius=100; 
    this.circleRot=0; 
    //this.rotspeed=0; 
    this.rotspeed=random(0.3,0.1); 
    this.rotMax=0;


    this.debug=false;
    this.hasWind=false;
    this.isOnMask=false;
    this.easingType='easeInOutSine';


this.cropPos=sin(iX);
this.cropSpeed=0.1;
this.cropSine=sin(map(iX,0,fixedWindowWidth,-1,1));


this.isActive=false;



//  if(iY<height/2)this.rotspeed = map(iY,0,height/2,0.1,0.4);
//   if(iY>height/2)this.rotspeed = map(iY,height/2,height,0.4,0.1);

  }

  move() {
    this.x += random(-this.speed, this.speed);
    this.y += random(-this.speed, this.speed);
  }





update(millis){
  if(millis<this.endAnimation){
    switch (this.easingType) {
      case 'easeInOutSine':
          this.currentAngle=easeInOutSine(millis-this.startAnimation,this.startAngle,this.thetaAngle,this.duration);
        break;

        case 'easeInQuad':
          this.currentAngle=easeInQuad(millis-this.startAnimation,this.startAngle,this.thetaAngle,this.duration);
        break;

        case 'easeOutQuad':
          this.currentAngle=easeOutQuad(millis-this.startAnimation,this.startAngle,this.thetaAngle,this.duration);
        break;
    }

      
     }else {
      this.currentAngle=this.targetAngle;
      this.isActive=false;
     }

    if(millis<this.endAlphaAnimation){
     // this.currentAlpha=easeInOutQuad(millis()-this.startAlphaAnimation,this.startAlpha,this.thetaAlpha,this.alphaDuration);
      this.currentAlpha=easeInOutSine(millis-this.startAlphaAnimation,this.startAlpha,this.thetaAlpha,this.alphaDuration);

     /* switch (this.easingType) {
        case 'easeInOutSine':
      this.currentAlpha=easeInOutSine(millis()-this.startAlphaAnimation,this.startAlpha,this.thetaAlpha,this.alphaDuration);
          break;

          case 'easeInQuad':
      this.currentAlpha=easeInQuad(millis()-this.startAlphaAnimation,this.startAlpha,this.thetaAlpha,this.alphaDuration);
          break;

          case 'easeOutQuad':
      this.currentAlpha=easeInQuad(millis()-this.startAlphaAnimation,this.startAlpha,this.thetaAlpha,this.alphaDuration);
          break;

      }*/



    }else{
     this.currentAlpha=this.targetAlpha;
    }


  //  this.cropPos=map(sin(this.cropSine),-1,1,0,this.diameter);
    //this.cropSine+=this.cropSpeed;

}

  

hasDisplayed(){
    //this.circleRot+=this.rotspeed; 

   // this.isActive=false;


  }






  flutter(){
    /*let c=createVector(this.circleDistance,0);
      let v=createVector(this.circleRadius/2,0);      
      v.rotate(this.circleRot);
      let p=c.add(v);
      if(this.debug){
        strokeWeight(1)
        noFill();
        ellipse(this.circleDistance, 0, this.circleRadius,this.circleRadius);
        ellipse(p.x,p.y,5,5);
        stroke(255,0,0);
        line(0,0,p.x,p.y);
      }
      //rotate(p.heading());
      return p.heading();*/
      return 0;
  }



setEasingType(easingType){
  this.easingType=easingType;
}

  setPosition(x,y){
    this.position=new p5.Vector(x, y);
    this.x=x;
    this.y=y;
  }
	


  setColor(color){
    this.strokeColor=color;
  }

  fadeTo(alpha,speed){
    this.alpha = lerp(this.alpha, alpha, speed);
  }

  setAlpha(alpha){
    this.targetAlpha=alpha;
  }  




  startAnimation(duration){
    this.endAnimation=millis()+duration;
  }

  setTargetAngle(angle){
    if(angle!=this.targetAngle){
    this.startAngle=this.currentAngle;
    this.targetAngle=angle;
    this.thetaAngle= this.targetAngle-this.startAngle;
    this.endAnimation=millis()+this.duration;
    this.startAnimation=millis();
    }
  }


  setTargetAlpha(alpha){
   if(alpha!=this.targetAlpha){
      this.startAlpha=this.currentAlpha;
      this.targetAlpha=alpha;
      this.thetaAlpha= this.targetAlpha-this.startAlpha;
      this.endAlphaAnimation=millis()+this.alphaDuration;
      this.startAlphaAnimation=millis();
      }
  }  

    setDuration(duration){
    this.duration=duration;
  }

setAlphaDuration(duration){
  this.alphaDuration=duration;
}

  resetCircleRot(){
    this.circleRot=0;
  }

  setCircleRotMax(rotmax){
    this.rotMax=rotmax;
  }

  setAngle(angle){
    this.currentAngle=angle;

  }


  getCurrentAngle(){
    return this.currentAngle;
  }

  getCurrentAlpha(){
    return this.currentAlpha;
  }

  getPosition(){
    return new PVector(this.x,this.y);
  }

  getTargetAngle(){
    return this.targetAngle;
  }
  
  setRotationInRad(angle){
    this.startAngle=this.currentAngle;
    this.thetaAngle=angle;
    this.endAnimation=millis()+this.duration;
    this.startAnimation=millis();

  }



  setFlutterParams(dis,rad,speed){
    this.circleDistance=dis;
    this.circleRadius=rad;
    this.rotspeed=speed;
  }

  getFlutterDistance(){
    return this.circleDistance;
  }
  getFlutterRadius(){
    return this.circleRadius;
  }
  getFlutterSpeed(){
    return this.rotspeed;
  }

  getStrokecolor(){
    return this.strokeColor;
 }


}



class Wind {
  constructor(iX,iY,isMasked) {
      this.x = iX;
      this.y =iY;
      this.radius = 0;
      this.velocity=random(10,20);
      this.maxRadius=2500;
      this.innerradius=rasterwidth;
      this.currentInnerRadius=0;
      this.isMasked=isMasked;
      this.deleteMe=false;
      //var rand=int(random(3,10));
      var rand=int(random(3,5));

      if(rand%4==0)rand+=PI/2;
      this.angle=latestAngle+(rand*PI/2);//random(2*PI);
      latestAngle=this.angle;
      this.duration=map(rand,3,5,1000,2000);//random(500,3000);
      var rn=floor(random(0,colors.length-0.9));
      this.color=color(colors[rn]);
      this.flutterDistance=random(200,500);
      this.flutterRadius=random(50,200);
      this.flutterSpeed=random(0.1,0.5);
      this.rotMax=random(5*PI);//*int(random(5));
      this.easingType='easeOutQuad';


  }

  move(){
    this.radius+=this.velocity;
    if(this.radius>this.maxRadius)this.deleteMe=true;
    this.currentInnerRadius=this.radius-this.innerradius;
    if(this.currentInnerRadius<0)this.currentInnerRadius=0;
  }

  display(){
    push();
    strokeWeight(1);
    stroke(255,0,0,50);
    noFill();
    translate(this.x,this.y);
    //ellipse(0,0, this.radius*2,this.radius*2);
    //ellipse(0,0, this.currentInnerRadius*2,this.currentInnerRadius*2);
    pop();
  }

  getDeleteMe(){
    return this.deleteMe;
  }

}

class WindWidthParameters {
  constructor(iX,iY,velocity,angle,dur,wait,easingType,col,isMasked) {
      this.x = iX;
      this.y =iY;
      this.radius = 0;
      this.velocity=velocity;
      this.maxRadius=2500;
      this.innerradius=rasterwidth+100;
      this.currentInnerRadius=0;
      this.isMasked=isMasked;
      this.deleteMe=false;

      this.angle=latestAngle+(angle*PI/2);//random(2*PI);
      latestAngle=this.angle;
      this.duration=dur;//random(500,3000);
      this.color=color(colors[col]);
           // this.color=color(colors[col]);
      //this.color=color(colors[0]);
      this.initTime=millis();
      this.wait=wait;
      this.easingType=easingType;

  }

  move(){
    if(millis()>this.initTime+this.wait){
      this.radius+=this.velocity;
      if(this.radius>this.maxRadius)this.deleteMe=true;
      this.currentInnerRadius=this.radius-this.innerradius;
      if(this.currentInnerRadius<0)this.currentInnerRadius=0;
    }
  }

  display(){
    push();
    strokeWeight(1);
    stroke(255,0,0,50);
    noFill();
    translate(this.x,this.y);
    ellipse(0,0, this.radius*2,this.radius*2);
    ellipse(0,0, this.currentInnerRadius*2,this.currentInnerRadius*2);
    pop();
  }

  getDeleteMe(){
    return this.deleteMe;
  }

}


class WindObjectWithParameters {
  constructor(iX,iY,width,height,velocity,limit,angle,dur,wait,easingType,col,isMasked) {
      this.x = iX;
      this.y =iY;
      this.radius = 0;
      this.velocity=velocity;
      this.maxRadius=2500;
      this.innerradius=rasterwidth+100;
      this.currentInnerRadius=0;
      this.isMasked=isMasked;
      this.deleteMe=false;

      this.angle=latestAngle+(angle*PI/2);//random(2*PI);
      latestAngle=this.angle;
      this.duration=dur;//random(500,3000);
      this.color=color(colors[col]);
     // this.color=color(colors[0]);

      this.initTime=millis();
      this.wait=wait;
      this.easingType=easingType;
      this.pos = createVector(this.x,this.y);
      this.width=width;
      this.height=height;
      this.radius=this.width;
      this.windobject=true;
      this.circleDistance=200;
      this.circleRadius=500;
      this.debug=false;

      let p=createVector(0,0);
      this.rotspeed=0.5;
      this.circleRot=0;
      this.acceleration=createVector(0,0);
      this.vel=createVector(0,0);
      this.limit=limit;


  }

  move(){




  let c=createVector(this.circleDistance,0);
  let v=createVector(this.circleRadius/2,0);      
      v.rotate(this.circleRot);
  this.p=c.add(v);


  this.acceleration.set(this.p.x,this.p.y);
  this.vel.add(this.acceleration);
  this.vel.limit(this.limit);

  /*
    if(millis()>this.initTime+this.wait){
      this.radius+=this.velocity;
      if(this.radius>this.maxRadius)this.deleteMe=true;
      this.currentInnerRadius=this.radius-this.innerradius;
      if(this.currentInnerRadius<0)this.currentInnerRadius=0;
    }*/
    //this.pos.set(mouseX,mouseY);
   // this.pos.x+=random(-50,50);
    //    this.pos.y+=random(-50,50);
        this.pos.add(this.vel);



    this.circleRot+=random(-this.rotspeed,this.rotspeed); 


  }

  display(){
        if(this.debug){

    push();
    strokeWeight(1);
    stroke(255,0,0,50);
    noFill();
    translate(this.pos.x,this.pos.y);
    ellipse(0,0, this.radius*2,this.radius*2);


      push();
        strokeWeight(1)
        noFill();
        ellipse(this.circleDistance, 0, this.circleRadius,this.circleRadius);
        stroke(255,0,0);
        line(0,0,this.p.x,this.p.y);
        ellipse(this.p.x,this.p.y,5,5);

        pop();
      }

   // ellipse(0,0, this.currentInnerRadius*2,this.currentInnerRadius*2);
    pop();
  }

  getDeleteMe(){
    return this.deleteMe;
  }

}


function check_a_point(a, b, x, y, r) {
    var dist_points = (a - x) * (a - x) + (b - y) * (b - y);
    r *= r;
    if (dist_points < r ) {
        return true;
    }
    return false;
}


// dynamically adjust the canvas to the window
function windowResized() {

//   fixedWindowWidth=windowWidth;
// fixedWindowHeight=windowHeight;

// alert(fixedWindowWidth+" "+fixedWindowHeight)
 // resizeCanvas(fixedWindowWidth, fixedWindowHeight);
 // createVanes();
}
