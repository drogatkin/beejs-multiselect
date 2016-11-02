var MultiSelect = function(settings) {
	var that = this;
	this.settings = settings
	this.tags_list = document.getElementById(settings.list_name)
	this.tag_inp = document.getElementById(settings.input_name)
	//this.tag_inp.onkeyup = keyHan
	this.tag_inp.addEventListener("keyup", keyHan)
	this.auto_sgst = document.getElementById(settings.asuggest_name)
	//deb('inp:'+this.tag_inp)
	this.insertTag = insertTag
	this.addRemoveHan = addRemoveHan

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
				insertTag(addRemoveHan(that.createTag(val), val))
				tag_inp.value = ''
				flipAS(null)
			}
		} else if (evt.which == 38) { // up
			moveHiglight(true);
		} else if (evt.which == 40) { // down
			moveHiglight(false);
		} else {
			if (settings.callBackAutoSuggest) // && typeof == 'function'
				settings.callBackAutoSuggest(val, fillASCallback)
			 else
				 fillAutoSuggest(val)
		}
	}
	
	function removeTag(name) {
		return function() {
		    var ta = hasTag(name);
		    if (ta)
			   tags_list.removeChild(ta)
			tag_inp.focus()
	    }
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
		if (!settings.getAutoSuggest)
			return
		//deb(val)
		while (auto_sgst.firstChild) {
			auto_sgst.removeChild(auto_sgst.firstChild);
		}
		var vars = settings.getAutoSuggest(val);
		if (vars.length == 0) {
			return
		}
		flipAS(true)
		for (var i = 0; i < vars.length; i++) {
		    // TODO do not add in the list already selected
			// Create the list item:
			var item = document.createElement('li'); // TODO use autosuggest element factory
			item.className = 'aus'
			item.setAttribute('data', vars[i].tag)
			item.title = vars[i].descr
			item.onclick = function(e) {
				var target = (e.target) ? e.target : e.srcElement;
				//deb('clicked')
				if (hasTag(target.getAttribute('data')))
				    return
				//insertTag(createTag(target.getAttribute('data')))
				insertTag(addRemoveHan(that.createTag(target.getAttribute('data')), target.getAttribute('data')))
				flipAS()
				tag_inp.value = ''
			}
			item.appendChild(document.createTextNode(vars[i].tag));
			auto_sgst.appendChild(item);
		}
	}
	function fillASCallback(asv) {
		while (auto_sgst.firstChild) {
			auto_sgst.removeChild(auto_sgst.firstChild);
		}
		if (asv.length == 0) {
			flipAS();
			return
		}
		for (var i = 0; i < asv.length; i++) {
		    // TODO do not add in the list already selected
			// Create the list item:
			var item = document.createElement('li'); // TODO use autosuggest element factory
			item.className = 'aus'
			item.setAttribute('data', asv[i].tag)
			item.title = asv[i].descr
			item.onclick = function(e) {
				var target = (e.target) ? e.target : e.srcElement;
				//deb('clicked')
				if (hasTag(target.getAttribute('data')))
				    return
				//insertTag(createTag(target.getAttribute('data')))
				insertTag(addRemoveHan(that.createTag(target.getAttribute('data')), target.getAttribute('data')))
				flipAS()
				tag_inp.value = ''
			}
			item.appendChild(document.createTextNode(asv[i].tag));
			auto_sgst.appendChild(item);
		}
		flipAS(true)
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
	function addRemoveHan(tag, name) {
		// TODO get selector from settings
		tag.querySelector("div > span").onclick = removeTag(name)
		return tag;
	}
}

MultiSelect.prototype.createTag =
	// TODO customize the function to change selection appearance
function (name) {
	var t = document.createElement('template');
	t.innerHTML = '<div class="brd nonl rgtsp" data=""><span class="lftsp clk redc">x</span></div>';
	t.content.firstChild.setAttribute('data', name)
	t.content.firstChild.insertBefore(document.createTextNode(name), t.content.firstChild.firstChild)
	return t.content.firstChild;
}

MultiSelect.prototype. getSelected = function() {
	var res = []
	
	for (var i = 0; i < tags_list.childNodes.length; i++) {
		if (tags_list.childNodes[i].nodeName == 'DIV'
				&& tags_list.childNodes[i].getAttribute('data'))
			res.push(tags_list.childNodes[i].getAttribute('data'))
	}
	return res
}

MultiSelect.prototype. putSelected = function(tags) {
  for (var i = 0; i < tags.length; i++) {
		this.insertTag(this.addRemoveHan(this.createTag(tags[i].tag), tags[i].tag))
  }
}


function isScrolledIntoView(element) {
	var elementRect = element.getBoundingClientRect();
	var parentRect = element.parentElement?element.parentElement.getBoundingClientRect() :null;
    if (parentRect) {
    	//deb('e '+elementRect.top +'-'+parentRect.top+', '+elementRect.bottom+' '+parentRect.bottom)
    	return elementRect.top < parentRect.bottom && elementRect.bottom >  parentRect.top;
    }
	return true;
}
function deb(s) {
	console.log( s )
}