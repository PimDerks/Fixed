function init(){

    // get toggles
    var fixed = document.querySelectorAll('.fixed');

    // initialize toggles
    [].slice.call(fixed).forEach(function(f){
        new Fixed(f);
    });

};

document.addEventListener('DOMContentLoaded', init, false);