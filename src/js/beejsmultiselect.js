var MultiSelect = function(settings) {
	var that = this;
	this.settings = settings;
	if (settings.list_name) {
	    this.tags_list = isElement(settings.list_name)?settings.list_name:document.querySelector(settings.list_name);
	    if (this.tags_list) {
	    	if (!settings.selectAction)
	    		settings.selectAction = selectAction;
	    }
	}
	
	this.tag_inp = isElement(settings.input_name)?settings.input_name:document.querySelector(settings.input_name);
	//this.tag_inp.onkeyup = keyHan
	this.tag_inp.addEventListener("keyup", keyHan);
	this.auto_sgst = createAutosuggestBox(this.tags_list || this.tag_inp); //document.getElementById(settings.asuggest_name)
	
	var tag_inp = this.tag_inp
	var auto_sgst = this.auto_sgst
	var tags_list = this.tags_list
	//deb('as:'+this.auto_sgst)
	this.insertTag = insertTag
	tag_inp.onblur = function() {
	    if (that.settings.selectAction) {
	        var val = (tag_inp.value).trim()
	        that.settings.selectAction(val)
	    }
	}
	this.addRemoveHan = addRemoveHan
	this.disconnect = disconnect

	function insertTag(tag) {
		tags_list.insertBefore(tag, tag_inp)
		tag_inp.focus()
	}	
	
	function keyHan(evt) {
		if (window.event)
			evt = window.event
		var val = (tag_inp.value).trim()
		// TODO make tag separator keys configurable
		if (evt.which == 13 || evt.which == 32 || evt.which == 188 || evt.which == 59) { // 44
			if (that.settings.selectAction)
				that.settings.selectAction(val)
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
	function selectAction(val) {
		if (val !== '' && !hasTag(val)) {				
			insertTag(addRemoveHan(that.createTag(val), val))
			tag_inp.value = ''
			flipAS(null)
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
		} else if (auto_sgst.classList.contains('hid')) {
			auto_sgst.classList.remove('hid')
			auto_sgst.alignFun()
		}
	}
	function fillAutoSuggest(val) {		
		if (!settings.getAutoSuggest)
			return
		//deb(val)
		while (auto_sgst.firstChild) {
			auto_sgst.removeChild(auto_sgst.firstChild);
		}
		var vars = settings.getAutoSuggest(val);
		if (vars.length === 0) {
			return
		}
		flipAS(true)
		var clicfunc = function(e) {
				var target = (e.target) ? e.target : e.srcElement;
				//deb('clicked')
				//insertTag(createTag(target.getAttribute('data')))
				if (that.settings.selectAction)
     				that.settings.selectAction(target.getAttribute('data'))
			}
		for (var i = 0; i < vars.length; i++) {
		    // TODO do not add in the list already selected
			// Create the list item:
			var item = document.createElement('li'); // TODO use an autosuggest element factory
			item.className = 'aus'
			item.setAttribute('data', vars[i].tag)
			item.title = vars[i].descr
			item.onclick = clicfunc
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
				if (that.settings.selectAction)
     				that.settings.selectAction(target.getAttribute('data'))
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
	function isElement(obj) {
		  try {
		    //Using W3 DOM2 (works for FF, Opera and Chrom)
		    return obj instanceof HTMLElement;
		  }
		  catch(e){
		    //Browsers not supporting W3 DOM2 don't have HTMLElement and
		    //an exception is thrown and we end up here. Testing some
		    //properties that all elements have. (works on IE7)
		    return (typeof obj==="object") &&
		      (obj.nodeType===1) && (typeof obj.style === "object") &&
		      (typeof obj.ownerDocument ==="object");
		  }
    }
	function createAutosuggestBox(attTo) {
		var res = document.createElement('div');
        res.className = 'ubrd popu hid';

        res.alignFun = function(){
            var rect = attTo.getBoundingClientRect();
            res.style.left = Math.round(rect.left + (window.pageXOffset || document.documentElement.scrollLeft) + (settings.offsetLeft?settings.offsetLeft:0)) + 'px';
            res.style.top = Math.round(rect.bottom + (window.pageYOffset || document.documentElement.scrollTop) + (settings.offsetTop?settings.offsetTop:1)) + 'px';
            res.style.width = Math.round(rect.right - rect.left) + 'px'; // outerWidth
        }
        window.addEventListener('resize', res.alignFun)
        document.body.appendChild(res);
        return res;
	}
	function disconnect() {
		if (auto_sgst) {
		   document.body.removeChild(auto_sgst)
		   window.removeEventListener('resize', auto_sgst.alignFun)
		}
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
	  var n = tags[i].tag || tags[i][this.settings.tagMap] || tags[i] 
		this.insertTag(this.addRemoveHan(this.createTag(n), n))
  }
}

function isScrolledIntoView(element) {
	var elementRect = element.getBoundingClientRect();
	var parentRect = element.parentElement?element.parentElement.getBoundingClientRect() :null;
    if (parentRect) {
    	//deb('e '+elementRect.top +'<'+parentRect.bottom+', '+elementRect.bottom+'> '+parentRect.top)
    	return elementRect.top + 1 < parentRect.bottom && elementRect.bottom >  parentRect.top;
    }
	return true;
}
function deb(s) {
	console.log( s )
}