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


var theta = 0;
var rasterwidth = 30;
var rasterwidthMin=15;
var rasterwidthMax=100;
var rasterwidthBefore=rasterwidth;

var weight=10;

var alphaTraceMin=0;
var alphaTraceMax=255;
var alphaTrace=100;



// gui params
var strokeWidth = 3;

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


// performance
let pg;

var winds=[];
let latestAngle=0;


// Buffer
let buffer;
var isOffscreen=true ;



function preload() {
    img1 = loadImage('assets/1.png');
    img2 = loadImage('assets/2.png');
    img3 = loadImage('assets/3.png');
    img4 = loadImage('assets/4.png');
    img5 = loadImage('assets/5.png');
}


let colors;


function setup() {

     // winds.push( new Wind(windowWidth/2,windowHeight/2) );


  //createCanvas(710, 400);
    createCanvas(windowWidth, windowHeight);
    buffer = createGraphics(windowWidth, windowHeight);

    frameRate(60);

  // Create Layout GUI
  gui = createGui('P5 GUI');
  //gui.addGlobals( 'images','globalStrokeColor', 'rasterwidth','strokeWidth','fade','center','inverted','durationBlack','durationAlpha','durationDilitation','intervall','howMuchRows');
  gui.addGlobals( 'rasterwidth','strokeWidth','center','fade','alphaTrace','isOffscreen','inverted');


  img1.loadPixels();
  img2.loadPixels();
  img3.loadPixels();
  img4.loadPixels();
  img5.loadPixels();

  imageArray.push(img1);
  imageArray.push(img2);
  imageArray.push(img3);
  imageArray.push(img4);
  imageArray.push(img5);

  actualImage=img1;
  actualImageIndex=0;

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


}


function createVanes(){
  vanes =[];
  res = rasterwidth;
   countX = ceil(width/res) + 1;
   countY = ceil(height/res) + 1;

  for (var j = 0; j < countY; j++) {
    for (var i = 0; i < countX; i++) {
      vanes.push( new WindVane(res*i, res*j) );
    }
  };
  numVanes=vanes.length;
  console.log("num Vanes"+numVanes);

  pg = createGraphics(rasterwidth, rasterwidth);
  pg.noFill();
  pg.stroke(255,0,0);
  pg.line(-rasterwidth/2,0,rasterwidth/2,0);
}

function draw() {
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

  background(255);
  buffer.background(255,alphaTrace);

  winds.map((wind,i) =>{
    wind.move();
    wind.display();
    if(wind.getDeleteMe()){
      console.log("delete "+i);
      winds.splice(i,1);
    }
  })

  push();


   // strokeWeight(strokeWidth);




   // noStroke();
  

      buffer.strokeWeight(strokeWidth);
    


     vanes.map(vane =>{
        let alph=getAlphaVal(vane.x , vane.y,actualImage);
        vane.hasWind=false;

         // if(alph>5){
           // vane.setTargetAlpha(255);
          //}

        buffer.stroke(vane.getStrokecolor());
        
        winds.map((wind,i) =>{

        let outer=check_a_point(vane.x,vane.y,wind.x,wind.y,wind.radius);
        let inner=check_a_point(vane.x,vane.y,wind.x,wind.y,wind.currentInnerRadius);
       
       if(outer &! inner){

          var angle=wind.angle
          var duration=wind.duration
          vane.setDuration(duration);
          vane.setTargetAngle(angle); 

          vane.setColor(wind.color);
          if(alph>5){
            vane.setDuration(duration+500);
            vane.setTargetAngle(angle+PI/4); 
            vane.setAlphaDuration(duration-500);
            vane.setTargetAlpha(255);
            vane.setFlutterParams(500,50,0.5)
          }else{
            //vane.setAlphaDuration(duration-500);
            vane.setAlphaDuration(duration+500);

            vane.setTargetAlpha(160);
            if(fade)vane.setTargetAlpha(0);
            vane.setFlutterParams(500,100,0.09)

          }

       
      
          //vane.resetCircleRot();
          //vane.setCircleRotMax(vane.rotMax+wind.rotMax);
          //vane.setFlutterParams(wind.flutterDistance,wind.flutterRadius,wind.flutterSpeed);
         //vane.setColor(wind.color);
          //console.log(wind.angle)
        };
      })

      vane.update();
      

      if(isOffscreen){
          //buffer.push();
       

            if(fade) {
              vane.fadeTo(vane.targetAlpha,0.09);
              vane.strokeColor.setAlpha(vane.currentAlpha);
              buffer.stroke(vane.strokeColor);
            }

           // buffer.translate(vane.x,vane.y);
           //buffer.rotate(vane.getCurrentAngle());

          //if(this.hasWind){
             // buffer.rotate(vane.flutter());

         // }

          if(center){
            buffer.line(-vane.diameter/2,0,vane.diameter/2,0);
          }else{
            if(vane.debug){
              buffer.stroke(vane.strokeColor);
              buffer.strokeWeight(strokeWidth);
            }
            //PVector(this.x,this.y);
            
            let pos = createVector(vane.x,vane.y);
            let diff=createVector(vane.diameter,0);
            diff.rotate(vane.getCurrentAngle());
            let pos2=pos.add(diff);
            //pos2.rotate(vane.getCurrentAngle());
            //buffer.beginShape(POINTS);
            buffer.line(vane.x,vane.y,pos2.x,pos2.y);
              //buffer.rect(vane.x,vane.y,pos2.x-vane.x,pos2.y-vane.y);
                  //buffer.line(vane.x,vane.y,pos2.x,pos2.y);
            //buffer.ellipse(pos2.x,pos2.y,10,10);
          //  buffer.rect(pos.x,pos.y,pos2.x-pos.x,pos2.y-pos.y);

           // buffer.image(pg,0,0);
           //buffer.beginShape(LINES);
              //buffer.vertex(vane.x,vane.y);
              //buffer.vertex(pos2.x,pos2.y);
          //buffer.endShape();

          }
        // buffer.pop();

      }else{
  
          vane.display();

      }

      vane.hasDisplayed();

     })

//buffer.endShape();

    //for (var i = 0; i < numVanes; i++) {
      //let loc = (vanes[i].x + vanes[i].y * img.width) * 4;
      //var c=  img.get(vanes[i].x , vanes[i].y);
     // let value = alpha(c); // Sets 'value' to 255
     // let b=red(c);
    //fill(value);
    //rect(vanes[i].x,vanes[i].y,20,20);
      //vanes[i].targetAngle=map(sin(theta),-1,1,0,2*PI);

     /* var angle=calcXWave(vanes[i].x,theta,PI/2);
      if(vanes[i].y<height/2){
      angle=map(vanes[i].y,0,height/2,0,angle);
      }else{
        angle=map(vanes[i].y,height/2,height,angle,0);

      }
      vanes[i].targetAngle=angle;
      */

    //  vanes[i].setColor(color(globalStrokeColor));

    //  vanes[i].display();
    //}
    pop();


   if(isOffscreen)image(buffer,0,0);

      theta-=0.2;
      rasterwidthBefore=rasterwidth;

        let fps = frameRate();
        fill(255,0,0);
        noStroke();
        text("FPS: " + fps.toFixed(2), 10, windowHeight - 10);


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
actualImageIndex++;
actualImage=imageArray[actualImageIndex%imageArray.length];
winds.push(new Wind(mouseX,mouseY));
}

function calcXWave(posX,theta,waveLength){
  dx=map(posX,0,width,0,waveLength);
  dx+=theta;
  return sin(dx);
}


function getAlphaVal(posx, posy, image){
  var fact=image.width/windowWidth;
  var factH=image.height/windowHeight;
  var off=((image.height*fact)-windowHeight)/2;
  var c=  image.get(posx*fact,(posy*fact)-off/2);
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

function keyPressed(event){
  if(event.key=='x'){
      for (var i = 0; i < vanes.length; i++) {
        vanes[i].targetAngle=0;
        vanes[i].setAlpha(255);
        vanes[i].setDuration(100);

    }
  }

  if(event.key=='5'){
    var v=getRow(10);
      for (var i = 0; i < v.length; i++) {
        v[i].targetAngle=PI;
      }
  }

    if(event.key=='6'){
    var v=getRow(11);
      for (var i = 0; i < v.length; i++) {
        v[i].targetAngle=PI;
      }
  }

  if(event.key=='w'){
   startWave();
  }

  if(event.key=='a'){
    startZeroWave();
  }


  if(event.key=='b'){
   for (var i = 0; i < vanes.length; i++) {
      vanes[i].setDuration(1000);
      //var a=vanes[i].getAngle();
      //var at=a%0;
      vanes[i].setAlpha(255);
      vanes[i].setTargetAngle(0);
    }
  }


  if(event.key=='s'){
    //var v=getRow(5);
    for (var i = 0; i < vanes.length; i++) {
      var a=vanes[i].getAngle();
      a=a%PI
      vanes[i].setTargetAngle(vanes[i].getAngle()-a);
    }
  }


  if(event.key=='h'){
      localStorage.setItem("rasterwidth", rasterwidth);
  }
 if(event.key=='H'){
      alert(localStorage.getItem("rasterwidth"));
      rasterwidth=localStorage.getItem("rasterwidth");
  }

}


function calcVec(x, y) {
  return new p5.Vector(y - x, - x - y);
}

function wave(){
  if(waveNum<countX){
    var v=getRow(waveNum);
         for (var i = 0; i < v.length; i++) {
          //get aloha
          let alph=getAlphaVal(v[i].x , v[i].y,actualImage);
          //scale to rotation
         /* let m=map(alph,0,255,(2*PI),(2*PI+PI/4));
          if(inverted){
           m=map(alph,255,0,(2*PI),(2*PI+PI/4));
          }*/

          let m=map(alph,0,255,0,2*PI+(PI/4));
          if(inverted){
           m=map(alph,255,0,0,2*PI+(PI/4));
          }
          v[i].hasWind=false;

        if(alph>5){
          v[i].hasWind=true;
        
        }
          let d=map(alph,0,255,durationAlpha,durationBlack);

        if(fade){
          let transparency=map(alph,255,0,255,0);
          v[i].setAlpha(transparency);
        }

          v[i].setDuration(d+Math.random()*durationDilitation);
          v[i].setTargetAngle(m); 
    }
      waveNum++;
  }else{
    waveNum=0;
    waveIsRunning=false;
  }
}



function flutterWave(){
 let dist=500;
 let rad=sin(flutterFact)*800;
 let speed=0.3;
 if(flutterWaveNum<countX){
    var v=getRow(flutterWaveNum);
         for (var i = 0; i < v.length; i++) {
            let alph=getAlphaVal(v[i].x , v[i].y,actualImage);
            if(alph>5){
              v[i].hasWind=true;
              v[i].setFlutterParams(dist,rad,speed);

            }
         }
         flutterWaveNum++;
       }else{
        flutterWaveNum=0;
        flutterFact+=0.5;
       }

}



function zeroWave(){
  if(waveNum<countX){
    var v=getRow(waveNum);
         for (var i = 0; i < v.length; i++) {
          let alph=getAlphaVal(v[i].x , v[i].y,actualImage);
          let m=map(alph,0,255,(2*PI)-PI/8,(2*PI+PI/4));
          let d=map(alph,0,255,durationAlpha,durationBlack);

        if(fade){
          v[i].setAlpha(255);
        }
          v[i].setDuration(d+Math.random()*durationDilitation);
          v[i].setTargetAngle(0); 
    }
      waveNum++;
  }else{
    waveNum=0;
    zerowaveIsRunning=false;
  }
}


function startZeroWave(){
  waveIsRunning=false;
  zerowaveIsRunning=true;
  startWaveMillis=millis();
  waveNum=0;
}


function startWave(){
  waveNum=0;
  waveIsRunning=true;
  zerowaveIsRunning=false;
  waveAngleFactor+=PI;
  startWaveMillis=millis();
}












// Jitter class
class WindVane {

  constructor(iX,iY) {
    this.x = iX;
    this.y =iY;
    this.diameter = rasterwidth;

    this.position=new p5.Vector(this.x, this.y);
		//this.angle=-PI/4;

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


//  if(iY<height/2)this.rotspeed = map(iY,0,height/2,0.1,0.4);
//   if(iY>height/2)this.rotspeed = map(iY,height/2,height,0.4,0.1);

  }

  move() {
    this.x += random(-this.speed, this.speed);
    this.y += random(-this.speed, this.speed);
  }





update(){
  if(millis()<this.endAnimation){
      //this.currentAngle=easeInOutQuad(millis()-this.startAnimation,this.startAngle,this.thetaAngle,this.duration);
      this.currentAngle=easeInOutSine(millis()-this.startAnimation,this.startAngle,this.thetaAngle,this.duration);
     }else{
      this.currentAngle=this.targetAngle;
     }

    if(millis()<this.endAlphaAnimation){
     // this.currentAlpha=easeInOutQuad(millis()-this.startAlphaAnimation,this.startAlpha,this.thetaAlpha,this.alphaDuration);
      this.currentAlpha=easeInOutSine(millis()-this.startAlphaAnimation,this.startAlpha,this.thetaAlpha,this.alphaDuration);

    }else{
    // this.currentAlpha=this.targetAlpha;
    }

}

  display() {

  

    //strokeCap(SQUARE);
if(isOffscreen){
  

}else{
      push();
      stroke(this.strokeColor);
      if(fade) {
        this.fadeTo(this.targetAlpha,0.09);
        this.strokeColor.setAlpha(this.currentAlpha);
        stroke(this.strokeColor);
      }

      translate(this.x,this.y);
      rotate(this.currentAngle);

    //if(this.hasWind){
        this.flutter();
   // }

    if(center){
      line(-this.diameter/2,0,this.diameter/2,0);
    }else{
      if(this.debug){
        stroke(this.strokeColor);
        strokeWeight(strokeWidth);
      }

          

      line(0,0,this.diameter,0);
    }
    pop();
}

    //debug target angle
    /*
    push()
        translate(this.x,this.y);

        stroke(255,0,0);
        rotate(this.targetAngle);
        line(0,0,this.diameter,0);
      pop()
*/
    //flutter
  
  //      if(this.circleRot<this.rotMax) this.circleRot+=this.rotspeed; 
  }

hasDisplayed(){
    this.circleRot+=this.rotspeed; 


  }






  flutter(){
    let c=createVector(this.circleDistance,0);
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
      rotate(p.heading());
      //return p.heading();
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
  resizeCanvas(windowWidth, windowHeight);
  createVanes();
}
