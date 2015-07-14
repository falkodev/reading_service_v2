var FaqView = function () {

    this.initialize = function () {
        // Define a div wrapper for the view (used to attach events)
        this.$el = $('<div/>');      
        // this.render();
    };    

    this.render = function() {
        this.$el.html(this.template());
        $('.content', this.$el).html();
        return this;
    }

    this.initialize();
    this.render();
}