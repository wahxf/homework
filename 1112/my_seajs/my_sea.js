var chache = {}

function define(fn) {
    let module = {
        exports: {}
    }
    fn(null, module.exports, module)
    console.log(module)
}
var sea = {
    use(path, fn_end) {
        console.log(path)
            // $.ajax({
            //     url: path,
            //     success: function(str) {
            //         chache[path] = str;
            //         // eval(str)
            //         fn_end()
            //     },
            //     error: function(err) {
            //         console.log('error', path, err)
            //     }
            // })
        var node = document.createElement('script');
        node.onload = node.onreadystatechange = function() {
            console.log('img loaded')
        };
        node.onerror = function() {
            console.log('img load error')
        }
        node.src = path;
        document.querySelector('head')[0].insertBefore(node)
    }
}