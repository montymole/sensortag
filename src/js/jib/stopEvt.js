function stopEvt(evt) {

	evt.stopped = true;

    if (evt.preventDefault) {
        evt.preventDefault();
    } else {
        evt.returnValue = false;
    }

}