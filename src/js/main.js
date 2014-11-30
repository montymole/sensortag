/*--------------------------------------*/
/*  App initilization and setup        */
/*------------------------------------*/
var el = {};

function init() {
    //AOO ROOT DIV POINTER
    el.app = gEl("#app");
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
