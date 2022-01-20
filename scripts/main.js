// slides
var carousel = document.querySelector('.carousel');
var carouselContent = document.querySelector('.carousel-content');
var slides = document.querySelectorAll('.slide');
var arrayOfSlides = Array.prototype.slice.call(slides);
var carouselDisplaying;
var screenSize;
setScreenSize();
var lengthOfSlide;

const reload = () => {
	setTimeout(()=>{
		document.location.reload()
	},1000)
}


setTimeout(()=>{
	$(".vjs-modal-dialog").hide()
},5000)

let addr = localStorage.getItem("server_ip")

/*START SOCKET */

const sio = io(`http://${addr}:5500/`);


sio.on('connect', () => {
	console.log('connected');
  });
  
  sio.on('disconnect', () => {
	console.log('disconnected');
  });
  
  sio.on('hello_data', () => {
	console.log('hello_data');
	getActiveTickets_side()
	getActiveTickets()
  });

  sio.on("next_ticket_data",()=>{
	console.log("next_ticket_data")
	getActiveTickets_side()
	getActiveTickets()
  })

// video_refresh_data
sio.on("video_refresh_data",()=>{
	console.log("video reload")
	getAllVideosEvt()
})
  
/*END SOCKET */

function addClone() {
   var lastSlide = carouselContent.lastElementChild.cloneNode(true);
   lastSlide.style.left = (-lengthOfSlide) + "px";
   carouselContent.insertBefore(lastSlide, carouselContent.firstChild);
}

function removeClone() {
  var firstSlide = carouselContent.firstElementChild;
  firstSlide.parentNode.removeChild(firstSlide);
}

function moveSlidesRight() {
  var slides = document.querySelectorAll('.slide');
  var slidesArray = Array.prototype.slice.call(slides);
  var width = 0;

  slidesArray.forEach(function(el, i){
    el.style.left = width + "px";
    width += lengthOfSlide;
  });
  addClone();
}
moveSlidesRight();

function moveSlidesLeft() {
  var slides = document.querySelectorAll('.slide');
  var slidesArray = Array.prototype.slice.call(slides);
  slidesArray = slidesArray.reverse();
  var maxWidth = (slidesArray.length - 1) * lengthOfSlide;

  slidesArray.forEach(function(el, i){
    maxWidth -= lengthOfSlide;
    el.style.left = maxWidth + "px";
  });
}

window.addEventListener('resize', setScreenSize);

function setScreenSize() {
  if ( window.innerWidth >= 500 ) {
    carouselDisplaying = 5;
  } else if ( window.innerWidth >= 300 ) {
    carouselDisplaying = 4;
  } else {
    carouselDisplaying = 1;
  }
  getScreenSize();
}

function getScreenSize() {
  var slides = document.querySelectorAll('.slide');
  var slidesArray = Array.prototype.slice.call(slides);
  lengthOfSlide = ( carousel.offsetWidth  / carouselDisplaying );
  var initialWidth = -lengthOfSlide;
  slidesArray.forEach(function(el) {
    el.style.width = lengthOfSlide + "px";
    el.style.left = initialWidth + "px";
    initialWidth += lengthOfSlide;
  });
}

var rightNav = document.querySelector('.nav-right');
setInterval(()=>{
  moveLeft()
},3000)


var moving = true;
function moveRight() {
  if ( moving ) {
    moving = false;
    var lastSlide = carouselContent.lastElementChild;
    lastSlide.parentNode.removeChild(lastSlide);
    carouselContent.insertBefore(lastSlide, carouselContent.firstChild);
    removeClone();
    var firstSlide = carouselContent.firstElementChild;
    firstSlide.addEventListener('transitionend', activateAgain);
    moveSlidesRight();
  }
}

function activateAgain() {
  var firstSlide = carouselContent.firstElementChild;
  moving = true;
  firstSlide.removeEventListener('transitionend', activateAgain);
}

var leftNav = document.querySelector('.nav-left');

// var moveLeftAgain = true;

function moveLeft() {
  if ( moving ) {
    moving = false;
    removeClone();
    var firstSlide = carouselContent.firstElementChild;
    firstSlide.addEventListener('transitionend', replaceToEnd);
    moveSlidesLeft();
  }
}

function replaceToEnd() {
  var firstSlide = carouselContent.firstElementChild;
  firstSlide.parentNode.removeChild(firstSlide);
  carouselContent.appendChild(firstSlide);
  firstSlide.style.left = ( (arrayOfSlides.length -1) * lengthOfSlide) + "px";
  addClone();
  moving = true;
  firstSlide.removeEventListener('transitionend', replaceToEnd);
}

carouselContent.addEventListener('mousedown', seeMovement);

var initialX;
var initialPos;
function seeMovement(e) {
  initialX = e.clientX;
  getInitialPos();
  carouselContent.addEventListener('mousemove', slightMove);
  document.addEventListener('mouseup', moveBasedOnMouse);
}

function slightMove(e) {
  if ( moving ) {
    var movingX = e.clientX;
    var difference = initialX - movingX;
    if ( Math.abs(difference) < (lengthOfSlide/4) ) {
      slightMoveSlides(difference);
    }  
  }
}

function getInitialPos() {
  var slides = document.querySelectorAll('.slide');
  var slidesArray = Array.prototype.slice.call(slides);
  initialPos = [];
  slidesArray.forEach(function(el){
    var left = Math.floor( parseInt( el.style.left.slice(0, -2 ) ) ); 
    initialPos.push( left );
  });
}

function slightMoveSlides(newX) {
  var slides = document.querySelectorAll('.slide');
  var slidesArray = Array.prototype.slice.call(slides);
  slidesArray.forEach(function(el, i){
    var oldLeft = initialPos[i];
    el.style.left = (oldLeft + newX) + "px";
  });
}

function moveBasedOnMouse(e) { 
  var finalX = e.clientX;
  if ( initialX - finalX > 0) {
    moveRight();
  } else if ( initialX - finalX < 0 ) {
    moveLeft();
  }
  document.removeEventListener('mouseup', moveBasedOnMouse);
  carouselContent.removeEventListener('mousemove', slightMove);
}
// end slides

sessionStorage.setItem("source","0")
// const { session } = require("electron");

let country_id = 1;
const key = "080b988760e1b4e769be96a125bc38d381d41a8133539fe03a1de1bccafc7a79dad93e987e5505d78ff53b128df7564255509e7de2950cb5e957e78355fa09a5f77a10787f12bf4f4066223225dca3f1f162665cbcb3b936aab784b34be80fe3b68ea195c156cc0272cc28902b2fefc44e96508e5553734a06e3b085bca8907cfdeb2e6cfd2786ca27cbc7876318e3eb9d7c9b40cf4287ca6857615435b53bcfc46db3718c57e07b3be9951a97615e981d33b4611be6011a8f4d39de82a21a3382fdaa3531a3a610b64740515f840512472347297fcb9caebffffec35aa24abb0f9d2dd94595e3190db4897b1e205ae129feca90f8abd785428867e238bb4013484f978c83d30fa7fdbfcd3115ca87fc84d03ec6e9e7a1dacbe83300711581ee7edc6d843b22eda5a0cdd80d8b83d729b4505075329017d663e56990391aaaebe25bc90c075b5bdf824db7562550713c1215d7b623f5d7cbd07bb6e6f4783984e577b833daf17dcafb4d45638f655098d0852e2cfc3fccc05409ae9b7396786cd45f01d11dd6e11a6d3715359a7bb9bfa6ab28b993c6700177dd41aa5a076023a6324ff8f9a538ff4597c25d9e5784de256b44f6152d482759b4f61666e1a710bd9e644f3f9e98ad066658bde80f5f4aa0e3aac7fced121292042d0bfb19d425dda8bd5defbaa069e04ce012d573300bf77a9fc5cd7c697b2744b38acc2957db0fb64a9fdb91dc6d96825976f1a1ab6cb17598ecc14a79138e7fe421105b4bce660981ec8172fb4cab6fc5579b1cc5a8d32872ca3b69a290e618fa90355733993cc23cde190710d9db7f4ff1e467846a02898a1f4e88340c8d81b26215512743a6036b1fc1fbac7698861298c4dec15c2572162ea3c2331fc7a650c8917447134632058d37b9de9b552fe6e5583b839d686fca20bc5098f06758d93bcad8ab6f54d2592e7aecfd2f2e7cc8c62e25dabefe70fb3d8903956f86eadb72a49079a047bfe4183b922fdd73c8278b3d2cc450320edf7e8e7e97dafc7a79c1b5e83594fa5bfce1c0bf7ac2999399850c49a13b637725b66d54cfc9129eb8a26091fef7755573076858bfa534b7076fedda1429a0c8a5f8b650d71408d80419d15afca8bded6e4ef0355101b5c80115600da758b2255832b0700c26f9f4457bb2e131726130faa7e4232a0933fb863bf3d8af497331d3c1d6b7332b9f4d1e3a420f6af9329840cb763e2486f7932c87d9f6fc4939891d6a4d4a244b6b7c387adb6e9fbc83dd0e93cc970e40e8856a88c83ab319f349172bba8c91a643b4513addff812771899ccd13a061eb896a5736d8b7e1206ae7ed00b8f2b36e26de5b99f9e05636a5dd4f3b50cbddc34f88d9938d0dce152bfde1f70c022700b310a10e7cf7eee55961f720d97f6752e46eb50d5e8330f5815b88abe5c8e8d4c2466af4e35d4cff"



let link = `http://${addr}:1000`

//setting the key
setTimeout(()=>{
	console.log(addr)
	if(addr){
		$("#server_ip").attr("placeholder",`Currently Set As '${addr}'`)
	}else{
		$("#server_ip").attr("placeholder",`Please Set Address Before using app.`)
	}
},500)


$("#set_server_ip").on("click",()=>{
	let server_ip = $("#server_ip").val()
	if(server_ip){
		localStorage.setItem("server_ip",server_ip)
		$("#server_ip").attr("placeholder",`Currently Set As '${addr}'`)
		$("#message_ip").html(`<div class="alert alert-success" role="alert">Success! Make sure to restart app.<br> for changes to take effect</div>`)
		reload()
	}
})



let teller = 1;
let online_status = $(".status");
online_status.removeClass("offline");

let branch_id;
try {
  branch_id = JSON.parse(localStorage.getItem("branch_info")).id
}
catch(error) {
	branch_id = 2 || 1
}

const getData = (url,methods,data,handle) => {
	fetch(url,{
	  method: methods,
	  headers: {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json'
	  },
	  body: JSON.stringify(data)
	})
	.then(res=>res.json())
	.then(res => handle(res));
};

const getActiveTickets_side = (call=12) => {
	getData(`${link}/get/active/tickets/side`,"POST",{"branch_id":branch_id},(data)=>{
		let final = "";
		let count = 0;
		for(x in data){count++;}
		if(count){
			let handle = $("#ticketsOne")
			let activesHandle = $("#list")
			// count data final
			let final = ""
			let actives = ""

			data.map((item,index)=>{

				if(data.length - 1 === index){
					actives += `<div>${item.code}${item.ticket}  — ${item.teller_.callout_name}</div>`
				}else{
					actives += `<div>${item.code}${item.ticket}  —  ${item.teller_.callout_name}</div>`
				}
			})
			// handle.html(final)
			activesHandle.html(actives)
		}else{
			let activesHandle = $("#list")
			let actives = `<div>RM 00 —  qsft 00</div>`
			activesHandle.html(actives)
		}
	})
};

getActiveTickets_side()

setTimeout(()=>{
	let key = localStorage.getItem("key")
	getData(`${link}/branch/by/key`,"POST",{"key" : key},(data)=>{
		if(data.status){
			$("#branch").html(data.name)
			$("#date").html(new Date())
		}else{
			$("#branch").html("——")
		}
	})
},10)


let mapper = ["tellerOne","tellerTwo","tellerThree","tellerFour"]
let tickets = ["ticketsOne","ticketsTwo","ticketsThree","ticketsFour"]


const slider = ()=>{
	var carousel = document.querySelector('.carousel');
	var carouselContent = document.querySelector('.carousel-content');
	var slides = document.querySelectorAll('.slide');
	var arrayOfSlides = Array.prototype.slice.call(slides);
	var carouselDisplaying;
	var screenSize;
	setScreenSize();
	var lengthOfSlide;

	function addClone() {
	var lastSlide = carouselContent.lastElementChild.cloneNode(true);
	lastSlide.style.left = (-lengthOfSlide) + "px";
	carouselContent.insertBefore(lastSlide, carouselContent.firstChild);
	}

	function removeClone() {
	var firstSlide = carouselContent.firstElementChild;
	firstSlide.parentNode.removeChild(firstSlide);
	}

	function moveSlidesRight() {
	var slides = document.querySelectorAll('.slide');
	var slidesArray = Array.prototype.slice.call(slides);
	var width = 0;

	slidesArray.forEach(function(el, i){
		el.style.left = width + "px";
		width += lengthOfSlide;
	});
	addClone();
	}
	moveSlidesRight();

	function moveSlidesLeft() {
	var slides = document.querySelectorAll('.slide');
	var slidesArray = Array.prototype.slice.call(slides);
	slidesArray = slidesArray.reverse();
	var maxWidth = (slidesArray.length - 1) * lengthOfSlide;

	slidesArray.forEach(function(el, i){
		maxWidth -= lengthOfSlide;
		el.style.left = maxWidth + "px";
	});
	}

	window.addEventListener('resize', setScreenSize);

	function setScreenSize() {
	if ( window.innerWidth >= 500 ) {
		carouselDisplaying = 5;
	} else if ( window.innerWidth >= 300 ) {
		carouselDisplaying = 4;
	} else {
		carouselDisplaying = 1;
	}
	getScreenSize();
	}

	function getScreenSize() {
	var slides = document.querySelectorAll('.slide');
	var slidesArray = Array.prototype.slice.call(slides);
	lengthOfSlide = ( carousel.offsetWidth  / carouselDisplaying );
	var initialWidth = -lengthOfSlide;
	slidesArray.forEach(function(el) {
		el.style.width = lengthOfSlide + "px";
		el.style.left = initialWidth + "px";
		initialWidth += lengthOfSlide;
	});
	}


	var rightNav = document.querySelector('.nav-right');
	setInterval(()=>{
		moveLeft()
	},3000)

	var moving = true;
	function moveRight() {
	if ( moving ) {
		moving = false;
		var lastSlide = carouselContent.lastElementChild;
		lastSlide.parentNode.removeChild(lastSlide);
		carouselContent.insertBefore(lastSlide, carouselContent.firstChild);
		removeClone();
		var firstSlide = carouselContent.firstElementChild;
		firstSlide.addEventListener('transitionend', activateAgain);
		moveSlidesRight();
	}
	}

	function activateAgain() {
	var firstSlide = carouselContent.firstElementChild;
	moving = true;
	firstSlide.removeEventListener('transitionend', activateAgain);
	}

	var leftNav = document.querySelector('.nav-left');

	// var moveLeftAgain = true;

	function moveLeft() {
	if ( moving ) {
		moving = false;
		removeClone();
		var firstSlide = carouselContent.firstElementChild;
		firstSlide.addEventListener('transitionend', replaceToEnd);
		moveSlidesLeft();
	}
	}

	function replaceToEnd() {
	var firstSlide = carouselContent.firstElementChild;
	firstSlide.parentNode.removeChild(firstSlide);
	carouselContent.appendChild(firstSlide);
	firstSlide.style.left = ( (arrayOfSlides.length -1) * lengthOfSlide) + "px";
	addClone();
	moving = true;
	firstSlide.removeEventListener('transitionend', replaceToEnd);
	}

	carouselContent.addEventListener('mousedown', seeMovement);

	var initialX;
	var initialPos;
	function seeMovement(e) {
	initialX = e.clientX;
	getInitialPos();
	carouselContent.addEventListener('mousemove', slightMove);
	document.addEventListener('mouseup', moveBasedOnMouse);
	}

	function slightMove(e) {
		if ( moving ) {
			var movingX = e.clientX;
			var difference = initialX - movingX;
			if ( Math.abs(difference) < (lengthOfSlide/4) ) {
			slightMoveSlides(difference);
			}  
		}
	}

	function getInitialPos() {
	var slides = document.querySelectorAll('.slide');
	var slidesArray = Array.prototype.slice.call(slides);
	initialPos = [];
	slidesArray.forEach(function(el){
		var left = Math.floor( parseInt( el.style.left.slice(0, -2 ) ) ); 
		initialPos.push( left );
	});
	}

	function slightMoveSlides(newX) {
	var slides = document.querySelectorAll('.slide');
	var slidesArray = Array.prototype.slice.call(slides);
	slidesArray.forEach(function(el, i){
		var oldLeft = initialPos[i];
		el.style.left = (oldLeft + newX) + "px";
	});
	}

	function moveBasedOnMouse(e) { 
	var finalX = e.clientX;
	if ( initialX - finalX > 0) {
		moveRight();
	} else if ( initialX - finalX < 0 ) {
		moveLeft();
	}
	document.removeEventListener('mouseup', moveBasedOnMouse);
	carouselContent.removeEventListener('mousemove', slightMove);
	}
}

const getActiveTickets = (call=12) => {
		getData(`${link}/get/active/tickets`,"POST",{"branch_id":branch_id},(data)=>{
		let final = "";
		let count = 0;
		for(x in data){count++;}
		console.log("CURRENT COUNT ",count)
		if(count >0){
			
			let handle = $("#ticketsOne")
			let activesHandle = $("#actives")
			// count data final
			let final = ""
			let actives = ""
			
			let roller = Array()
			let child = Array()
			
			let str = String()

			str += `<div class="carousel-content">`
			data.map((item,index)=>{


				str += `<div class="slide">
					<div class="radii" >
							<p class="headers" style="font-size:22px;">${item.teller_.callout_name}</p>
							<p class="sep"> — </p>
							<p class="tickets">${item.code}${item.ticket}</p>
					</div>
				</div>`
				
			})
			str += `</div>`
			child.push(str)
			roller.push(child)
			sessionStorage.setItem("roller_list",roller)
			console.log(Number(sessionStorage.getItem("actives_number")) !== data.length,Number(sessionStorage.getItem("actives_number")), data.length)
			if(Number(sessionStorage.getItem("actives_number")) !== data.length || data.length === 1  ){
				sessionStorage.setItem("actives_number",data.length)
				$("#roller_list").html(sessionStorage.getItem("roller_list"))
				slider()
			}else{
				
			}
		}else{
			sessionStorage.setItem('roller_list',Array(Array(`
			<div class="carousel-content">
				<div class="slide">
					<div class="radii" >
							<p class="headers">RM 00</p>
							<p class="sep"> — </p>
							<p class="tickets">qsft 00</p>
					</div>
				</div>
			</div>
			`)))
			$("#roller_list").html(sessionStorage.getItem("roller_list"))
			slider()
		}
	})
};

getActiveTickets()

// sessionStorage.setItem('roller_list',Array(Array(`
// <div class="carousel-content">
// 	<div class="slide">
// 		<div class="radii" >
// 		<p class="headers">RM 00</p>
// 		<p class="sep"> — </p>
// 		<p class="tickets">qsft 00</p>
// 		</div>
// 	</div>
// </div>
// `)))



setTimeout(()=>{
	$("#roller_list").html(sessionStorage.getItem("roller_list"))
	slider()
},1000)




// setInterval(()=>{
// 	getActiveTickets()
// },1000)

// setInterval(()=>{
// 	getActiveTickets_side()
// },1000)

$("#settings").on("click",()=>{
	$("#myModal").show()
});

$(".close").on("click",()=>{
	$("#myModal").hide()
});

// getting the local storage key
if(localStorage.getItem("key")){
	//gettingthe key info
	let key = localStorage.getItem("key")
	if (key.length !== 64){
		//	 there is an issue with the key
		$("#key").attr("placeholder","Activation Key Error!")
		$("#key").addClass("is-invalid")
		$("#verifyKey").prop("disabled",false)
		$("#key").removeClass("is-invalid")
	}else{
		//	key is valid
		$("#key").attr("placeholder",key)
		$("#verifyKey").prop("disabled",true)
	}
}else{
//	no key
}

$("#key").on("input",(e)=>{
	$("#verifyKey").prop("disabled",false)
})



const verifyKey = (me) => {
	let key = $("#key").val()
	getData(`${link}/app/activate`,"POST",{"key" : key},(data)=>{
		console.log(data)
		if(data){
			console.log("Data available")
			localStorage.setItem("key",data["key_"])
			localStorage.setItem("branch_info",JSON.stringify(data))
			$("#branch").html(data.name)
			$("#date_").html(data["today"])
			$("#services").show()

		}else{
			// app not activated
			$("#branch").html(`
			<img src="./images/key.png" alt="" height="40px" class="mt-3">
			<div class="mt-2">Error! Application not activated</div>
			<div class="text-muted">Please make sure you active the application from the backend provided</div>
			`)
			$("#services").hide()
		}
	})
}

verifyKey()



var index = 1;
// get all vids 
// get the video location
// setInterval(()=>{
	
// },3000)
sio.on("update_vids_data",()=>{
	getAllVideos()
})
// working with video.js 
// ------------------

var myPlayer = videojs('myVideo');
// setting the player volume
myPlayer.volume(0)

const getAllVideos = () =>{
	getData(`${link}/video/active`,"POST","",(data)=>{
		sessionStorage.setItem("videoList",JSON.stringify([]))
		sessionStorage.setItem("videoList",JSON.stringify(data))
	})
}


const getAllVideosEvt = () =>{
	getData(`${link}/video/active`,"POST","",(data)=>{
		sessionStorage.setItem("videoList",JSON.stringify([]))
		sessionStorage.setItem("videoList",JSON.stringify(data))
		if(! JSON.parse(sessionStorage.getItem("videoList")).length >=1){
			reload()
		}
	})
}

const prepareEncoding = (videoData) =>{
	let type = videoData.type
	// modify DOM
	let handle = $("#myVideo")
	// here we are going to add and remove elements from the DOM
	if(type === 1){
		// video link
		myPlayer.src(videoData.link+"/"+videoData.name);
	}else if(type === 2){
		// youtube 
		setTimeout(()=>{
			myPlayer.src([
				{type: "video/youtube", src: `${videoData.name}`, "techOrder": ["youtube", "html5"]}
			]);
			$(".vjs-modal-dialog").hide()
		},100)

	}else if(type === 3){
		// live streams
		// the SRC should be replace with >>>> videoData.name
		myPlayer.src([
			{type: "application/x-mpegURL", src: "https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8"}
		]);
	}
}

// get all videos
getAllVideos()

myPlayer.on("ready",()=>{
	prepareEncoding(JSON.parse(sessionStorage.videoList)[0])
})


let vid_count=1
myPlayer.on("ended",()=>{
	// get the next video 
	sio.emit("update_videos",{})
	
	if (vid_count === JSON.parse(sessionStorage.videoList).length){
		vid_count = 1;
	}
	prepareEncoding(JSON.parse(sessionStorage.videoList)[vid_count])
	vid_count++;
});



const flavoursContainer = document.getElementById("the_divs")
const flavoursScrollWidth = flavoursContainer.scrollWidth

window.addEventListener("load", () => {
  self.setInterval(() => {
    if (flavoursContainer.scrollLeft !== flavoursScrollWidth) {
      flavoursContainer.scrollTo(flavoursContainer.scrollLeft + 1, 0);
    }
  }, 15);
})


// var div = $('#activess');
// // var div = $('div.autoscrolling');
// var scroller = setInterval(function(){
// 	var pos = div.scrollTop();
// 	div.scrollTop(++pos);
// }, 100)



// $('#activess').stop().animate({scrollTop:40}, 400, 'swing', function(){
// 	console.log("ssdsd")
// });
setTimeout(()=>{
	setInterval(function(){
		let handle = $('#list')
		console.log(handle.length)
		if(handle.length > 10){
			handle.stop().animate({scrollTop:40}, 400, 'swing', function(){
				$(this).find('div:last').after($('div:first', this));
			});
		}
	}, 3000);
},3000)

