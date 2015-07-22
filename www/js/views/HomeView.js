var HomeView = function () {
    var lines
    $.ajax({
        url: 'assets/lang/langs.txt',
        async: false,
        complete: function(data)
        {
            // console.log('always ')
            $.each(data, function(k,v){
                if(k == 'responseText') {
                    // console.log(v)
                    lines = v.split("\n")
                    // $.each(lines, function(key, value){
                    //     console.log(value)
                    // })
                }
            })
        }
    })
    return lines
}