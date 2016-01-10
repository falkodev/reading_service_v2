var slider = new PageSlider($('#tmplContent'));

function loadTemplate(tmpl_name) {
    var tmpl_url = 'js/templates/' + tmpl_name + 'Template.html';
    var htmlContent;
    $.ajax({
        url: tmpl_url,
        method: 'GET',
        dataType: 'html',
        async: false,
        success: function(data) {
            htmlContent = Handlebars.compile(data);
        } 
    });
    return htmlContent;
}

function displayTemplate(tmpl_name) {
    slider.slidePage($('<div>').html(loadTemplate(tmpl_name)));
}