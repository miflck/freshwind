var vanes = [];
let img; // Declare variable 'img'.


function preload() {
  img = loadImage('assets/rot.png');
}


function setup() {
  //createCanvas(710, 400);
    createCanvas(windowWidth, windowHeight);
 img.loadPixels();
 //	colorMode(HSB, 255);

  //loadPixels();
  
  var res = 20;
  var countX = ceil(width/res) + 1;
  var countY = ceil(height/res) + 1;

  for (var j = 0; j < countY; j++) {
    for (var i = 0; i < countX; i++) {
      vanes.push( new WindVane(res*i, res*j) );
    }
  };
}

function draw() {
  background(255);
   // image(img, 0, 0);

    for (var i = 0; i < vanes.length; i++) {
         
colorMode(RGB);
     let loc = (vanes[i].x + vanes[i].y * img.width) * 4;
      var c=  img.get(vanes[i].x , vanes[i].y);
      let value = alpha(c); // Sets 'value' to 255
      let b=red(c);
      noStroke();
        fill(b);
          rect(vanes[i].x,vanes[i].y,20,20);

       //vanes[i].move();
      vanes[i].display();
    }
}


function mouseMoved(){
for (var i = 0; i < vanes.length; i++) {
		var h = new p5.Vector(mouseX-vanes[i].x,mouseY-vanes[i].y);
		//vanes[i].targetAngle=h.heading();
 	//vanes[i].targetAngle=random(0,2*PI);
    }
}



function getAlphaVal(posx, posy, image){
    var c=  image.get(posx,posy);
    let value = red(c); 
    return value;
}

function mousePressed(event) {
  console.log(mouseX);
	for (var i = 0; i < vanes.length; i++) {

    let alph=getAlphaVal(vanes[i].x , vanes[i].y,img);

		 let loc = (vanes[i].x + vanes[i].y * img.width) * 4;
      var c=  img.get(vanes[i].x , vanes[i].y);
			let value = alpha(c); // Sets 'value' to 255
			noStroke();
     //     fill(c);
     	  //   rect(vanes[i].x,vanes[i].y,20,20);
          
     	//let r = img.pixels[loc];
     	//console.log(c);
     //	if(value>100){
     	//vanes[i].targetAngle=5;
     		var h = new p5.Vector(mouseX-vanes[i].x,mouseY-vanes[i].y);
        let m=map(alph,255,0,0,PI/2);
        vanes[i].targetAngle=m;

		//vanes[i].targetAngle=h.heading();
     //	}
    }
}


function calcVec(x, y) {
  return new p5.Vector(y - x, - x - y);
}

// Jitter class
class WindVane {

  constructor(iX,iY) {
    this.x = iX;
    this.y =iY;
    this.diameter = 20;
    this.speed = 1;
    this.position=new p5.Vector(this.x, this.y);
		this.angle=0;
		this.targetAngle=0;
  }

  move() {
    this.x += random(-this.speed, this.speed);
    this.y += random(-this.speed, this.speed);
  }

  display() {
	//	var h = calcVec(  mouseX-this.x,  mouseY-this.y);
		
		var h = new p5.Vector(mouseX-this.x,mouseY-this.y);
		
		this.rotateTo(this.targetAngle);
    push();
    stroke(0,0,0);
    strokeWeight(2);
    translate(this.x,this.y);
		//rotate(h.heading());

		rotate(this.angle);
    line(-this.diameter/2,0,this.diameter/2,0);
    pop();
  }
  
  setPosition(x,y){
    this.position=new p5.Vector(x, y);
    this.x=x;
    this.y=y;
  }
	
	rotateTo(theta){
		 this.angle = lerp(this.angle, theta, 0.1);
	}

	

  
  
}