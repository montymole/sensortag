/*--------------------------------------*/
/*  App initilization and setup        */
/*------------------------------------*/
var el = {},
    draw;

function init() {
    //AOO ROOT DIV POINTER
    el.app = gEl("#app");
    el.graph = gEl('#graph');
    //GRAPH
    initGraph(model.IRTemperatureData);
    //start poll

    setTimeout(function() {
        window.location.reload();
    }, 5000);

}


function initGraph(data) {

    draw = SVG(el.graph);

    var polylineStr = '',
        stepSize = el.graph.
        d;

    for (var i = 0; i < data.length; i++) {
        d = data[i].value.objectTemp;
        if (polylineStr.length) polylineStr+= ' ';
        polylineStr += [i*10,d*10].join(',');
    }

    var polyline = draw.polyline(polylineStr).fill('none').stroke({
        color:'#f00',
        width: 5
    });

}

function initEventHandlers() {

    //Listen clicks
    listenEvent(window, "click", function(e) {
        var target = e.target || e.srcElement,
            clicked = findCmdAttribute(target);

        if (clicked && clicked.cmd) {

            switch (clicked.cmd.cid) {
                default: console.log('CMD->', clicked.cmd);
                break;
            }

        }

    });
}

contentLoaded(window, init);
