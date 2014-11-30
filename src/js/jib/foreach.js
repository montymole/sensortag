//foreach caller minimal

function foreach(arr, cb, l) {
    for (var i = 0; l = arr.length, i < l; i++) {
        cb(arr[i]);
    }
}
