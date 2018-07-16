function debounce(func,wait, immediate) {
	var timer = null;
	var debounced = function () {
		var argus = arguments,
			_this = this;
		clearTimeout(timer);
		if(immediate){
			if(!timer){
				func.apply(_this,argus);
			}
			timer = setTimeout(function () {
				timer = null;
			},wait);
		}else{
			timer = setTimeout(function () {
				var value = _this.value;
				func.apply(_this,argus);
			},wait);
		}
	}
	debounced.cancel = function () {
		clearTimeout(timer);
		timer = null;
	}
	return debounced;
}
var setUserAction = debounce(show, 3000, false);
$('.input').on('input', setUserAction);
function show(){
	var value = $(this).css('color','#333').val();
	$.ajax({
		type: 'GET',
		url: 'https://api.douban.com/v2/music/search',
		data: 'q=' + value + '&count=7',
		dataType: 'jsonp',
		// jsonp: 'callback',
		// jsonpCallback: addList,
		success: addList,
		error: function (e) {
			console.log(e);
		}
	});
	
	// $.ajax({
	// 	type: 'GET',
	// 	url: 'http://localhost/duyi/douban/js/data.txt',
	// 	data: 'q=' + value + '&start=0&count =7',
	// 	success: addList,
	// 	error: function (e) {
	// 		console.log(e);
	// 	}
	// });
}
function addList(data){
	// var data = JSON.parse(data),
		var data = data,
		value = data.musics,
		str = '';
		console.log(data);
	$('.middle-nav-top .search ul').html('');
	$.each(value,function (index, ele) {
		str += '<li>\
					<a href="http://localhost/duyi/douban/itemPage.html?id='+ele.id+'">\
						<img src='+ele.image+' alt="">\
						<div>\
							<span>' + ele.title + ' </span> <i>(音乐人)</i>\
							<p>表演者：' + ele.author[0].name + '</p> \
						</div>\
					</a>\
				</li>';
	});
	$('.middle-nav-top .search ul').append(str);
}
function getStyle(obj,attr) {
	if(obj.currentStyle) {
		return obj.currentStyle[attr];
	}else {
		return window.getComputedStyle(obj,false)[attr];
	}
}
function startMove(obj, targetObj, callback) {
	clearInterval(obj.timer);
	var iSpeed,
		iCur;
	obj.timer = setInterval(function () {
		var bStop = true;
		for(var prop in targetObj){
			if(prop === 'opacity') {
				iCur = parseFloat(getStyle(obj,'opacity')) * 100;
			}else {
				iCur = parseInt(getStyle(obj,prop));
			}
			iSpeed = (targetObj[prop] - iCur) / 7;
			iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
			if(prop === 'opacity'){
				obj.style.opacity =( iCur + iSpeed ) / 100;
				console.log('stop');
			}else {
				obj.style[prop] = iCur + iSpeed + 'px';
				console.log('run');
			}
			if(targetObj[prop] != iCur){
				bStop = false;
			}
		}
		if(bStop){
			clearInterval(obj.timer);
			// typeof callback === 'function' ? callback() : '';
			typeof callback === 'function' && callback();
			console.log('stop');
		}
		
	}, 20);
}
var timer = null,
	sliderPage = document.getElementsByClassName('sliderPage')[0],
	moveWidth = sliderPage.children[0].offsetWidth,
	num = sliderPage.children.length - 1,
	leftBtn = document.getElementsByClassName('leftBtn')[0],
	rightBtn = document.getElementsByClassName('rightBtn')[0],
	oSpanArray = document.getElementsByClassName('sliderIndex')[0].getElementsByTagName('span'),
	lock = true,
	index = 0;
leftBtn.onclick = function () {
	autoMove('right->left');
}
rightBtn.onclick = function () {
	autoMove('left->right');
}
for(var i = 0; i < oSpanArray.length; i++){
	(function (myIndex) {
		oSpanArray[i].onclick = function () {
			lock = false;
			clearTimeout(timer);
			index = myIndex;
			startMove(sliderPage,{left: - index * moveWidth},function () {
				lock = true;
				timer = setTimeout(startMove,1500);
				changeIndex(index);
			});
		}
	})(i);
}
function autoMove(direction,){
	if(lock){
		lock = false;
		clearTimeout(timer);
		if(!direction || direction == 'left->right'){
			index ++;
			startMove(sliderPage, {left:sliderPage.offsetLeft - moveWidth}, function () {
				if(sliderPage.offsetLeft == - num * moveWidth){
					index = 0;
					sliderPage.style.left = '0px';
				}
				timer = setTimeout(autoMove, 2000);
				lock = true;
				changeIndex(index);
			});
		}else if (direction == 'right->left') {
			if(sliderPage.offsetLeft == 0){
				sliderPage.style.left = - num * moveWidth + 'px';
				console.log(sliderPage.style.left);
				index = num;
			}
			index --;
			startMove(sliderPage, {left:sliderPage.offsetLeft + moveWidth}, function () {
				timer = setTimeout(autoMove, 2000);
				lock = true;
				changeIndex(index);
			});
		}
	}
}
timer = setTimeout(autoMove ,1500);
function changeIndex (_index) {
	for(var i = 0; i < oSpanArray.length; i++){
		oSpanArray[i].className = '';
	}
	oSpanArray[_index].className = 'active';
}
		