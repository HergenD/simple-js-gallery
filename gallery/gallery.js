// Firing functions
detectswipe('slider', mobileSlide);
window.onresize = exec;
window.onload = exec;

// variables needed in functions and getting amount of images in gallery
var numImg = document.getElementsByClassName("slide").length;
var marginL;
var windowWidth;
var imgWidth;
var sliderWidth;
var onScreenA;
var onSide;
var middleImg;

// All functions to execute on load / resize/ reset functions
function exec() {
    windowWidth = document.documentElement.clientWidth;
    imgWidth = document.getElementById("slideimg").getBoundingClientRect().width
    onScreenA = windowWidth / imgWidth;
    onSide = (onScreenA - 1) / 2;
    sliderWidth = imgWidth * numImg;
    sliderSize();
    initialPosition();
	show();
}

// Hides loading icon and shows image slider
function show() {
	document.getElementById('loading').style.display="none";
	document.getElementById('slider').style.opacity="1";
}

// Sets width of slider based on amount of images and image width
function sliderSize() {
    var sliderW = sliderWidth.toString() + "px";
    document.getElementById("slider").style.width = sliderW;
}

// Sets initial slider position to center the middle (if amount of images is odd) image, if amount images is even, sets the higher number of the middle set as center
function initialPosition() {
    // Checks if amount of images is even
	if (numImg % 2 == 0) {
        // Sets middle image (even) and calculates slider position based on amount of images and image width
		middleImg = (numImg + 2) / 2;
        var imgLeft = numImg - middleImg;
        var widthLeft = imgLeft * imgWidth;
        var widthOnScreenLeft = onSide * imgWidth;
        marginL = widthOnScreenLeft - widthLeft;
    } else {
        // Sets middle image (odd) and calculates slider position based on amount of images and image width
		middleImg = (numImg + 1) / 2;
        var imgLeft = numImg - middleImg;
        var widthLeft = imgLeft * imgWidth;
        var widthOnScreenLeft = onSide * imgWidth;
        marginL = widthOnScreenLeft - widthLeft;
    }
	// Sets margin-left of slider to set slider position
    var mL = marginL.toString() + "px";
    document.getElementById("slider").style.marginLeft = mL;
}

// Moves the gallery slider to the left, images on the right will move into view
function moveRight() {
    // Checks if we're not at last image yet, if not, moves slider more to the left
	if (marginL > (sliderWidth - (onSide + 1) * imgWidth) * -1) {
        marginL -= imgWidth;
    // If at last image, moves slider all the way to the right, centering the first image
	} else {
        marginL = imgWidth * onSide;
    };
	// Sets margin-left of slider to set slider position
    var mL = marginL.toString() + "px";
    document.getElementById("slider").style.marginLeft = mL;
}

// Moves the gallery slider to the right, images on the left will move into view
function moveLeft() {
	// Checks if we're not at first image yet, if not, moves slider more to the right
    if (marginL < imgWidth * onSide) {
        marginL += imgWidth;
    // If at first image, moves slider all the way to the left, centering the last image
	} else {
        marginL = (sliderWidth - (onSide + 1) * imgWidth) * -1;
    };
	// Sets margin-left of slider to set slider position
    var mL = marginL.toString() + "px";
    document.getElementById("slider").style.marginLeft = mL;
}

// Opens modal, receives full image path from clicked image due to onlick="this.src"
function openModal(path) {
	// Set higher than mobile width if you don't want to use modal on mobile version
	if(windowWidth > 0) {
	// Opens modal window
	document.getElementById('modal').style.display="block";
	// Gets filename from full filepath
	var filename = path.replace(/^.*[\\\/]/, '');
	// Sets image in modal window
	var previewImg = 'img/preview/'+filename;
	document.getElementById('modalImg').src=previewImg;
	// Sets 'Open in new tab' link to full image
	var fullImg = 'img/full/'+filename;
	document.getElementById('fullLink').href=fullImg;
	}
}

// Closes modal
function closeModal() {
	document.getElementById('modal').style.display="none";
}

// Makes sure that onclick of parent element won't get executed if element is clicked (to prevent model from closing when clicking on image)
function noThing() {
	if (!e) var e = window.event;
	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
}

// Function for swipe detection, all credit goes to https://stackoverflow.com/users/2689455/escapenetscape for this one
function detectswipe(el, func) {
    swipe_det = new Object();
    swipe_det.sX = 0;
    swipe_det.sY = 0;
    swipe_det.eX = 0;
    swipe_det.eY = 0;
    var min_x = 30; //min x swipe for horizontal swipe
    var max_x = 30; //max x difference for vertical swipe
    var min_y = 50; //min y swipe for vertical swipe
    var max_y = 500; //max y difference for horizontal swipe
    var direc = "";
    ele = document.getElementById(el);
    ele.addEventListener('touchstart', function(e) {
        var t = e.touches[0];
        swipe_det.sX = t.screenX;
        swipe_det.sY = t.screenY;
    }, false);
    ele.addEventListener('touchmove', function(e) {
        e.preventDefault();
        var t = e.touches[0];
        swipe_det.eX = t.screenX;
        swipe_det.eY = t.screenY;
    }, false);
    ele.addEventListener('touchend', function(e) {
        //horizontal detection
        if ((((swipe_det.eX - min_x > swipe_det.sX) || (swipe_det.eX + min_x < swipe_det.sX)) && ((swipe_det.eY < swipe_det.sY + max_y) && (swipe_det.sY > swipe_det.eY - max_y) && (swipe_det.eX > 0)))) {
            if (swipe_det.eX > swipe_det.sX) direc = "r";
            else direc = "l";
        }
        //vertical detection
        else if ((((swipe_det.eY - min_y > swipe_det.sY) || (swipe_det.eY + min_y < swipe_det.sY)) && ((swipe_det.eX < swipe_det.sX + max_x) && (swipe_det.sX > swipe_det.eX - max_x) && (swipe_det.eY > 0)))) {
            if (swipe_det.eY > swipe_det.sY) direc = "d";
            else direc = "u";
        }
        if (direc != "") {
            if (typeof func == 'function') func(el, direc);
        }
        direc = "";
        swipe_det.sX = 0;
        swipe_det.sY = 0;
        swipe_det.eX = 0;
        swipe_det.eY = 0;
    }, false);
}

// Used by detectswipe, executes moveLeft or Right functions based on swipe input
function mobileSlide(el, d) {
    if (d === "r") {
        moveLeft()
    } else if (d === "l") {
        moveRight()
    }
}