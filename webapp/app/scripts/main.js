var Router = require('./router.js').Router;

var GR = {
  savedProjects: {},
  headerTitle: 'GRADE NMA Visualization Tools',
  headerTitleShort: 'GRADE',
  init: () =>{
    var headertmpl = GRADE.templates.header(Router);
    var abouttmpl = GRADE.templates.about();
    $('.header').html(headertmpl);
    $('#about').html(abouttmpl);

  },
};


//Rendering functions
$(document).ready(function () {
  GR.init();
  Router.init();
});
