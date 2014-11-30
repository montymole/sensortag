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
