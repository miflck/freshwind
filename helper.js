/*t is current time
b is start value
c is change in value
d is duration*/


function easeInOutQuad(t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
};




function easeInOutQuint (t, b, c, d) {
	if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
	return c/2*((t-=2)*t*t*t*t + 2) + b;
};



function easeInOutSine (t, b, c, d) {
	return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
};




function easeInCubic(t) {
    return Math.pow(t,3);
}

//easeInOutQuad2: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
 function cubicInOut(t) {
     if(t < 0.5) return easeInCubic(t*2.0)/2.0;
     return 1-easeInCubic((1-t)*2)/2;                
 }