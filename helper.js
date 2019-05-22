/*t is current time
b is start value
c is change in value
d is duration*/


//https://gist.github.com/creotiv/effdedbe7c5526a493bf

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


function easeInQuad (t, b, c, d) {
    return c*(t/=d)*t + b;
};



// quadratic easing out - decelerating to zero velocity
function easeOutQuad (t, b, c, d) {
    return -c *(t/=d)*(t-2) + b;
};


function easeInCubic(t) {
    return Math.pow(t,3);
}

