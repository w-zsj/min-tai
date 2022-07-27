function endebug(a) {
	function doCheck(a) {
		if (("" + a / a)["length"] !== 1 || a % 20 === 0) {
			(function() {}
				["constructor"]("debugger")())
		} else {
			(function() {}
				["constructor"]("debugger")())
		}
		doCheck(++a)
	}
	try {
		doCheck(0)
	} catch (err) {}
}

//禁止鼠标右键菜单和F12打开控制台看源码
function click(e) {
	if (document.all) {
		if (event.button == 2 || event.button == 3) {
			oncontextmenu = 'return false';
		}
	}
	if (document.layers) {
		if (e.which == 3) {
			oncontextmenu = 'return false';
		}
	}
}
if (process.env.NODE_ENV !== 'development') {
	setInterval(function() {
		endebug()
	}, 1000);
	endebug()
	if (document.layers) {
		document.captureEvents(Event.MOUSEDOWN);
	}
	document.onmousedown = click;
	document.oncontextmenu = new Function("return false;")
	document.onkeydown = document.onkeyup = document.onkeypress = function() {
		if (window.event.keyCode == 123) {
			window.event.returnValue = false;
			return (false);
		}
	}
}
