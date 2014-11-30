function j(a) {
    for ( // for all a
        a = 0; // from 0
        a < 4; // to 4,
        a++ // incrementing
    ) try { // try
            return a ? new ActiveXObject( // a new ActiveXObject
                    [ // reflecting
                        , // (elided)
                        "Msxml2", // the various
                        "Msxml3", // working
                        "Microsoft" // options
                    ][a] + // for Microsoft implementations, and
                    ".XMLHTTP" // the appropriate suffix,
                ) // but make sure to
                : new XMLHttpRequest(); // try the w3c standard first, and
        } catch (e) {} // ignore when it fails.
}

function ajaxGet(url, callback) {

    var xmlhttp = j();
    xmlhttp.onreadystatechange = function() {

        var o;

        if (xmlhttp.readyState != 4) return;

        try {
            //TODO set headers so that we don't need to try parse always
            o = JSON.parse(xmlhttp.responseText);
        } catch (err) {
            o = {
                responseText: xmlhttp.responseText
            }
        }

        if (xmlhttp.status != 200)
            o.error = {
                code: xmlhttp.status,
                text: xmlhttp.statusText
            };

        callback(o);
    };
    xmlhttp.open('GET', url, true);
    xmlhttp.setRequestHeader("Accept", "json");
    xmlhttp.send();
}

function ajaxPost(url, data, callback) {

    var xmlhttp = j();
    xmlhttp.onreadystatechange = function() {

        if (xmlhttp.readyState != 4) return;

        var o;

        try {
            o = JSON.parse(xmlhttp.responseText);
        } catch (error) {
            o = {
                Message: xmlhttp.responseText
            };
        }

        if (xmlhttp.status != 200)
            o.error = {
                code: xmlhttp.status,
                text: xmlhttp.statusText
            };

        callback(o);
    };
    xmlhttp.open('POST', url, true);
    xmlhttp.setRequestHeader('Content-type', 'application/json');
    xmlhttp.send(JSON.stringify(data));

}

function ApiCaller(url, maxage, q) {
    this.isApi = true;
    this.maxage = maxage ? maxage * 1000 : 1000;
    this.url = url;
    this.q = q; //query params array
    this.ckey = this.url;
}

ApiCaller.prototype = {

    post: function(data, cb) {

        var a = this,
            now = new Date().getTime(),
            q = '?' + now; //init query string with timestamp

        //check required params
        if (a.q && data) {
            for (var k in data) {
                if (a.q.indexOf(k) == -1) {
                    alert('Puuttuva parametri ' + k);
                    return;
                }
                //add to query
                q += '&' + k + '=' + data[k];
                //remove from query
                delete data[k];
            }
        }

        ajaxPost(a.url + q, data, cb);

    },

    //localstorage cached get
    get: function(opts, cb) {

        var a = this,
            ma = a.maxage,
            k = a.ckey,
            c = s.get(k),
            d = false,
            now = new Date().getTime(),
            q = '?' + now; //init query string with timestamp

        //check required params
        if (a.q && opts.q) {
            for (var k in opts.q) {
                if (a.q.indexOf(k) == -1) {
                    alert('Puuttuva parametri ' + k);
                    return;
                }
                //add to query
                q += '&' + k + '=' + opts.q[k];
            }
        }

        if (c && c.goodbefore > now) {
            //send cached
            cb(c.data);
            //flag don't send
            d = true;
        }

        ajaxGet(a.url + q, function(r) {
            //cache result if its good
            if (!r.error) {
                //remember for a while minute
                s.set(k, {
                    data: r,
                    goodbefore: new Date().getTime() + ma
                });

            }
            //send result
            if (!d) cb(r);
        });

    }
}

/*!
 * contentloaded.js
 *
 * Author: Diego Perini (diego.perini at gmail.com)
 * Summary: cross-browser wrapper for DOMContentLoaded
 * Updated: 20101020
 * License: MIT
 * Version: 1.2
 *
 * URL:
 * http://javascript.nwbox.com/ContentLoaded/
 * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
 *
 */
// @win window reference
// @fn function reference
function contentLoaded(win, fn) {

	var done = false, top = true,

	doc = win.document, root = doc.documentElement,

	add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
	rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
	pre = doc.addEventListener ? '' : 'on',

	init = function(e) {
		if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
		(e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
		if (!done && (done = true)) fn.call(win, e.type || e);
	},

	poll = function() {
		try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
		init('poll');
	};

	if (doc.readyState == 'complete') fn.call(win, 'lazy');
	else {
		if (doc.createEventObject && root.doScroll) {
			try { top = !win.frameElement; } catch(e) { }
			if (top) poll();
		}
		doc[add](pre + 'DOMContentLoaded', init, false);
		doc[add](pre + 'readystatechange', init, false);
		win[add](pre + 'load', init, false);
	}

}
/*--------------------------------------------------*/
/*  Finds parent element with data-cmd attribute    */ 
/*--------------------------------------------------*/
function findCmdAttribute(element,        cmdAttr, hrefAttr, foundAttr, foundLink, foundTab ) {
	
	foundLink = foundAttr = foundTab = false;

	while(element && element.nodeName && element.getAttribute) {

		//find a foundation type of tab
		if (!foundTab) {
			if (element.hasAttribute("data-tab")) {
				foundTab = element;
			}
		}

		//find data cmds

		if (!foundAttr) {
			cmdAttr = element.getAttribute("data-cmd");

			if (cmdAttr) {

				foundAttr = { cid:cmdAttr, el:element };

			}
		}

		//find links

		if (!foundLink) {

			hrefAttr  = element.getAttribute("href");

			if (hrefAttr) {
			
				foundLink = { href:hrefAttr, el:element };

			}

		}

		element = element.parentNode;

	}

	return {
		cmd : foundAttr,
		link : foundLink,
		tab : foundTab
	}

}

//foreach caller minimal

function foreach(arr, cb, l) {
    for (var i = 0; l = arr.length, i < l; i++) {
        cb(arr[i]);
    }
}

function gEl(selector, context, cmd, found) {
    selector = selector.match(/^(\W)?(.*)/);
    cmd = "getElement" + ( selector[1] ? selector[1] == "#" ? "ById" : "sByClassName" : "sByTagName");
    found = (context || document)[cmd]( selector[2] );
    return (found && found.length) ? arrafy(found) : found;
}


function getByName(name, items) {
    return arrafy(document.getElementsByName(name));
}

/// return collection as array
function arrafy(items, i, l, r) {

    l = items.length;

    i = 0;
    r = [];

    while (i < l) {
        r[i] = items[i];
        i++;
    }

    return r;
}

function listenEvent(win, evt, cb) {

    var doc = win.document,
        add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
        pre = doc.addEventListener ? '' : 'on';

    doc[add](pre + evt, cb, false);

}

/*
 * LocalStorage
 *
 * Copyright (C) 2011 Jed Schmidt <http://jed.is> - WTFPL
 * More: https://gist.github.com/966030
 *
 */

var s = function(
    a, // placeholder for storage object
    b // placeholder for JSON
) {
    return b ? { // if JSON is supported
        get: function( // provide a getter function
            c // that takes a key
        ) {
            return a[c] && // and if the key exists
            b.parse(a[c]); // parses and returns it,
        },

        set: function( // and a setter function
            c, // that takes a key
            d // and a value
        ) {
            a[c] = // and sets
            b.stringify(d); // its serialization.
        }
    } : {}; // if JSON isn't supported, provide a shim.
}( this.localStorage || {}, JSON );

function stopEvt(evt) {

	evt.stopped = true;

    if (evt.preventDefault) {
        evt.preventDefault();
    } else {
        evt.returnValue = false;
    }

}
/*--------------------------------------*/
/* 2014 Jussi Löf
/*--------------------------------------*/
/* VOW, mega simple way to do
/* yielding promises
/*--------------------------------------*/

function Vow(obj) {

    this.obj = obj;
    this.oaths = {};
    this.oathsTotal = 0;
    this.oathsToFill = 0;
    this.oathsFilled = 0;

}

Vow.prototype.promise = function(property, getter, opts) {

    if (this.oaths[property]) {
        this.unPromise(property);
    }

    this.oaths[property] = {
        property: property,
        getter: getter,
        opts: opts
    };

     this.oathsTotal ++;
};

Vow.prototype.unPromise = function(property) {
    delete this.oaths[property];
    this.oathsTotal --;
}

Vow.prototype.get = function(oath) {

    var vow = this;

    oath.getter.get(oath.opts, function(result) {
        //eval in not always evil, we do this to suppoert trees of properties
        eval('vow.obj'+oath.property+'=result;');

        vow.oathsFilled ++;

        if(vow.onOathFill) { vow.onOathFill(oath, result); }

        if (vow.oathsFilled == vow.oathsToFill) {
          vow.callback(vow.obj);
        }
    });
};

Vow.prototype.yield = function(callback) {

    this.callback = callback;
    this.oathsFilled = 0;
    this.oathsToFill = this.oathsTotal;

    if ( this.oathsToFill == 0 ) {
        //no oaths just pass on
        callback(this.obj);
        return;
    }

    for (var o in this.oaths) {
        this.get(this.oaths[o]);
    }
};