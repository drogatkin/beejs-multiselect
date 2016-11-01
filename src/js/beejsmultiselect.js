var MultiSelect = function(settings) {
	var that = this;
	this.settings = settings
	this.tags_list = document.getElementById(settings.list_name)
	this.tag_inp = document.getElementById(settings.input_name)
	//this.tag_inp.onkeyup = keyHan
	this.tag_inp.addEventListener("keyup", keyHan)
	this.auto_sgst = document.getElementById(settings.asuggest_name)
	//deb('inp:'+this.tag_inp)

	function insertTag(tag) {
		tags_list.insertBefore(tag, tag_inp)
		tag_inp.focus()
	}	
	
	function keyHan(evt) {
		if (window.event)
			evt = window.event
		var val = (tag_inp.value).trim()
		if (evt.which == 13 || evt.which == 32) { // 44 59
			if (val != '' && !hasTag(val)) {
				insertTag(that.createTag(val))
				tag_inp.value = ''
				flipAS(null)
			}
		} else if (evt.which == 38) { // up
			moveHiglight(true);
		} else if (evt.which == 40) { // down
			moveHiglight(false);
		} else {
			fillAutoSuggest(val)
		}
	}
	
	function removeTag(name) {	    
		var ta = hasTag(name);
		if (ta)
			tags_list.removeChild(ta)
	}
	
	function hasTag(name) {
		for (var i = 0; i < tags_list.childNodes.length; i++) {
			if (tags_list.childNodes[i].nodeName == 'DIV'
					&& tags_list.childNodes[i].getAttribute('data') == name) {
				return tags_list.childNodes[i]
			}
		}
		return null;
	}
	
	function flipAS(show) {
		if (!show) {
			if (!auto_sgst.classList.contains('hid'))
				auto_sgst.classList.add('hid')
		} else if (auto_sgst.classList.contains('hid'))
			auto_sgst.classList.remove('hid')
	}
	function fillAutoSuggest(val) {
		flipAS(true)
		deb(val)
		while (auto_sgst.firstChild) {
			auto_sgst.removeChild(auto_sgst.firstChild);
		}
		var vars = settings.getAutoSuggest(val);
		if (vars.length == 0) {
			flipAS();
			return
		}
		for (var i = 0; i < vars.length; i++) {
		    // TODO do not add in the list already selected
			// Create the list item:
			var item = document.createElement('li'); // TODO use autosuggest element factory
			item.className = 'aus'
			item.setAttribute('data', vars[i].tag)
			item.title = vars[i].descr
			item.onclick = function(e) {
				var target = (e.target) ? e.target : e.srcElement;
				deb('clicked')
				if (hasTag(target.getAttribute('data')))
				    return
				//insertTag(createTag(target.getAttribute('data')))
				insertTag(that.createTag(target.getAttribute('data')))
				flipAS()
				tag_inp.value = ''
			}
			item.appendChild(document.createTextNode(vars[i].tag));
			auto_sgst.appendChild(item);
		}
	}
	function moveHiglight(up) {
		var se = findSelected(auto_sgst);
		if (!up) {
			if (se < 0)
				select(auto_sgst, 0)
			else if (se < auto_sgst.childNodes.length-1){
				unselect(auto_sgst, se)
				select(auto_sgst, se + 1)
			}
		} else {
			if (se <= 0) {
				flipAS()
				// TODO clear list
			} else {
				unselect(auto_sgst, se)
				select(auto_sgst, se - 1)
			}
		}
	}
	function findSelected(co) {
		for (var i = 0; i < co.childNodes.length; i++) {
			if (co.childNodes[i].nodeName == 'LI'
					&& co.childNodes[i].classList.contains('foas'))
				return i;
		}
		return -1;
	}
	function select(co, i) {
		if (i >= 0 && i < co.childNodes.length
				&& !co.childNodes[i].classList.contains('foas')) {
			co.childNodes[i].classList.add('foas');
			tag_inp.value = co.childNodes[i]
					.getAttribute('data')
			if (!isScrolledIntoView(co.childNodes[i]))
			     co.childNodes[i].scrollIntoView(false)
		}
	}
	function unselect(co, i) {
		if (i >= 0 && i < co.childNodes.length
				&& co.childNodes[i].classList.contains('foas'))
			co.childNodes[i].classList.remove('foas');
	}
}

MultiSelect.prototype.createTag = 
function (name) {
	var t = document.createElement('template');
	
	t.innerHTML = '<div class="brd nonl rgtsp" data="'+name+'">' + name
			+ '<span class="lftsp clk redc" onclick="removeTag(\'' + name
			+ '\')">x</span></div>';
	// TODO add custom attr with tag name
	if (this.settings.tagTemplate) {
		t.innerHTM = this.settings.tagTemplate.replace('{{}}', name)	
	}
	return t.content.firstChild;
}


function isScrolledIntoView(element, percentX, percentY) {
	var tolerance = 0.01; //needed because the rects returned by getBoundingClientRect provide the position up to 10 decimals
	if (percentX == null) {
		percentX = 100;
	}
	if (percentY == null) {
		percentY = 100;
	}

	var elementRect = element.getBoundingClientRect();
	var parentRects = [];

	while (element.parentElement != null) {
		parentRects.push(element.parentElement.getBoundingClientRect());
		element = element.parentElement;
	}

	var visibleInAllParents = parentRects.every(function(parentRect) {
		var visiblePixelX = Math.min(elementRect.right, parentRect.right)
				- Math.max(elementRect.left, parentRect.left);
		var visiblePixelY = Math.min(elementRect.bottom, parentRect.bottom)
				- Math.max(elementRect.top, parentRect.top);
		var visiblePercentageX = visiblePixelX / elementRect.width * 100;
		var visiblePercentageY = visiblePixelY / elementRect.height * 100;
		return visiblePercentageX + tolerance > percentX
				&& visiblePercentageY + tolerance > percentY;
	});
	return visibleInAllParents;
}
function deb(s) {
	console.log( s )
}