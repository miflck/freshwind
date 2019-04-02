var vanes = [];
  var countX;
  var countY;

let img1; // Declare variable 'img'.
let img2; // Declare variable 'img'.
let img3; // Declare variable 'img'.
let img4; // Declare variable 'img'.
let img5; // Declare variable 'img'.
let img6; // Declare variable 'img'.

let actualImage;


var theta = 0;
var rasterwidth = 50;
var rasterwidthMin=15;
var rasterwidthMax=100;
var rasterwidthBefore=rasterwidth;

var weight=10;


// gui params
var strokeWidth = 3;

var strokeWidthMin = 1;
var strokeWidthMax = 20;

var globalStrokeColor = '#0000dd';

var radius = 20;
var images = ['img1', 'img2', 'img3', 'img4', 'img5','img6'];




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



function preload() {
    img1 = loadImage('assets/1.png');
    img2 = loadImage('assets/2.png');
    img3 = loadImage('assets/3.png');
    img4 = loadImage('assets/4.png');
    img5 = loadImage('assets/5.png');
    img6 = loadImage('assets/6.png');

}


function setup() {

     // winds.push( new Wind(windowWidth/2,windowHeight/2) );


  //createCanvas(710, 400);
    createCanvas(windowWidth, windowHeight);
    frameRate(30);

  // Create Layout GUI
  gui = createGui('P5 GUI');
  gui.addGlobals(  'images','globalStrokeColor', 'rasterwidth','strokeWidth','fade','center','inverted','durationBlack','durationAlpha','durationDilitation','intervall','howMuchRows');


  img1.loadPixels();
  img2.loadPixels();
  img3.loadPixels();
  img4.loadPixels();
  img5.loadPixels();
  img6. loadPixels();

  actualImage=img1;
  createVanes();
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
  }

  // Gui changes
  if(rasterwidth!=rasterwidthBefore){
      createVanes();
  }


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




//flutterWave();

  background(255);

  winds.map((wind,i) =>{
    wind.move();
    wind.display();
    if(wind.getDeleteMe()){
      console.log("delete "+i);
      winds.splice(i,1);
    }
  })

  push();
 //translate(-windowWidth/2,-windowHeight/2);


    strokeWeight(strokeWidth);
    noStroke();
    colorMode(RGB);

    if(!fade)stroke(globalStrokeColor);
     //if(!fade)stroke(globalStrokeColor);


     vanes.map(vane =>{
      vane.setColor(color(globalStrokeColor));
      winds.map((wind,i) =>{

        let outer=check_a_point(vane.x,vane.y,wind.x,wind.y,wind.radius);
        let inner=check_a_point(vane.x,vane.y,wind.x,wind.y,wind.currentInnerRadius);
        if(outer &! inner){
          //vane.rotateTo(wind.angle);
          vane.setDuration(wind.duration);
         // vane.setColor(color(255,0,0));

          vane.setTargetAngle(wind.angle); 
          //console.log(wind.angle)
          vane.hasWind=true;
        };
      })
      vane.display();
     })

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
}


function mouseClicked(){
winds.push(new Wind(mouseX,mouseY))
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
   // this.speed = 0.1;//map(iX,0,width,0.1,0.01);
 //   if(iY<height/2)this.speed = map(iY,0,height/2,0.08,0.2);
  //  if(iY>height/2)this.speed = map(iY,height/2,height,0.2,0.08);
this.speed=0.1;

    this.position=new p5.Vector(this.x, this.y);
		//this.angle=-PI/4;

    this.strokeColor=color(0,100,200);
    this.alpha=255;
    this.targetAlpha=255;
    
    this.startAngle=0;
    //this.targetAngle=PI/2;
    this.thetaAngle=0;//this.targetAngle-this.startAngle;
    this.currentAngle=0;


   
   // if(iY<height/2)this.duration = map(iY,0,height/2,4000,3000);
   // if(iY>height/2)this.duration = map(iY,height/2,height,3000,4000);
    this.duration=4000;
    this.endAnimation=millis()+this.duration;
    this.startAnimation=millis();


    this.circleDistance=500;
    this.circleRadius=100; 
    this.circleRot=0; 
    //this.rotspeed=0; 
    this.rotspeed=random(0.5,0.1); 



    this.debug=false;
    this.hasWind=false;


//  if(iY<height/2)this.rotspeed = map(iY,0,height/2,0.1,0.4);
//   if(iY>height/2)this.rotspeed = map(iY,height/2,height,0.4,0.1);

  }

  move() {
    this.x += random(-this.speed, this.speed);
    this.y += random(-this.speed, this.speed);
  }





  display() {
	//	var h = calcVec(  mouseX-this.x,  mouseY-this.y);
		
		//var h = new p5.Vector(mouseX-this.x,mouseY-this.y);

    if(millis()<this.endAnimation){
      //this.currentAngle=easeInOutQuad(millis(),this.startAngle,this.thetaAngle,this.duration);
      //this.currentAngle=easeInOutSine(this.endAnimation-millis(),this.startAngle,this.thetaAngle,this.duration);
      this.currentAngle=easeInOutQuad(millis()-this.startAnimation,this.startAngle,this.thetaAngle,this.duration);


     }

     if(Math.abs( this.currentAngle-this.thetaAngle)>0.01)
     {
      //this.currentAngle=easeInOutQuad(millis()-this.startAnimation,this.startAngle,this.thetaAngle,this.duration);


     }

     //this.flutter();




		//this.rotateTo(this.targetAngle,this.speed);
      //  this.rotateTo(this.targetAngle,this.speed);



    strokeCap(SQUARE);
    push();
          stroke(this.strokeColor);

    if(fade) {
      this.fadeTo(this.targetAlpha,0.09);
      this.strokeColor.setAlpha(this.alpha);
      stroke(this.strokeColor);
    }

    translate(this.x,this.y);
		//rotate(h.heading());
		//rotate(this.angle);
    if(this.hasWind){
    rotate(this.currentAngle);
    this.flutter();
    }

    if(center){
      line(-this.diameter/2,0,this.diameter/2,0);
    }else{
      //line(0,0,this.diameter,0);


     
     // stroke(255,0,0);
      //line(0,0,50,50);
      if(this.debug){
        stroke(this.strokeColor);
        strokeWeight(strokeWidth);
        }

            line(0,0,this.diameter,0);



    //(p.heading());



    }
  //  image(pg,0,0);
   // rect(-this.diameter/2,-this.diameter/2,5,5);
    pop();


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
  }


  setPosition(x,y){
    this.position=new p5.Vector(x, y);
    this.x=x;
    this.y=y;
  }
	
	rotateTo(theta,speed){
		 this.angle = lerp(this.angle, theta, speed);
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


  setAngle(angle){
    this.currentAngle=angle;

  }


  getAngle(){
    return this.currentAngle;
  }
  
  setRotationInRad(angle){
    this.startAngle=this.currentAngle;
    this.thetaAngle=angle;
    this.endAnimation=millis()+this.duration;
    this.startAnimation=millis();

  }

  setDuration(duration){
    this.duration=duration;
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


}



class Wind {
  constructor(iX,iY) {
      this.x = iX;
      this.y =iY;
      this.radius = 0;
      this.velocity=random(5,20);
      this.maxRadius=2000;
      this.innerradius=rasterwidth;
      this.currentInnerRadius=0;

      this.deleteMe=false;
      this.angle=random(10*PI);
      this.duration=random(500,3000);
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
    ellipse(0,0, this.radius*2,this.radius*2);
    ellipse(0,0, this.currentInnerRadius*2,this.currentInnerRadius*2);

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

function check_a_pointInner(a, b, x, y, r) {
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
