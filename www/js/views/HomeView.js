var HomeView = function () {

    // this.initialize = function () {
    //     // Define a div wrapper for the view (used to attach events)
    //     this.$el = $('<div/>');      
    //     // this.render();
    // };    

    // this.render = function() {
    //     // this.$el.html(this.template()); 
    //     // $('.content', this.$el).html();
    //     return this;
    // }

    // this.initialize();
    // this.render();
    
    // return $('<div>').html(this.template()); 
    $.ajax({
        url: 'assets/lang/',
        // type:'HEAD',
        error: function(data)
        {
            console.log('error ')
            $.each(data, function(k,v){
                console.log(v)
            })
        },
        success: function(data)
        {
            console.log('success ' + data)
        }
    })
}