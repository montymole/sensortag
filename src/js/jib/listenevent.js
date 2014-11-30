function listenEvent(win, evt, cb) {

    var doc = win.document,
        add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
        pre = doc.addEventListener ? '' : 'on';

    doc[add](pre + evt, cb, false);

}
