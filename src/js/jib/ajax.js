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
