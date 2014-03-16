$( document ).ready(function() {

    var paiva = new Date().getDayName();

    haeMenu(paiva);

    $(function() {
        $( "#lowerpart" ).sortable();
        $( "#lowerpart" ).disableSelection();
    });
    
    
    $('a.paiva').on('click', function() {
        paiva = $(this).text();
        $('#lowerpart').empty();
        haeMenu(paiva);
    });

});


Date.prototype.getDayName = function() {
    var d = ['Sunnuntai','Maanantai','Tiistai','Keskiviikko','Torstai','Perjantai','Lauantai'];
    return d[this.getDay()];
};

function haeMenu(paiva) {

    var menusisalto = "";

    $.ajax({url: "ravintolat.txt"}).done(function(data){
        $.each($.parseJSON(data), function(idx, obj) {

            //alert(obj.nimi);

            $.each((obj.menu), function(idx, obj2) {
                //alert(obj2.paiva);
                if (obj2.paiva === paiva) {menusisalto = haeRuoka(obj2);}
            });

            $('#lowerpart').append(
                    '<div class="menuwindow">\n\
                     <div class="menuwindowtitle">' + obj.nimi      +'</div>\n\
                     <div class="menuwindowmiddle">'+ menusisalto   +'</div>\n\
                     <div class="menuwindowbottom">'+ obj.ketju     +'</div>'
            );
            menusisalto = "";
        });
    });

}


function haeRuoka(obj2){
    
    var menusisalto = "";
    var paivaruoka = "";
    
    $.each((obj2.ruoka), function(idx, obj3) {
        paivaruoka = paivaruoka + '<div class="menufooditem">'  + obj3.ruokalaji    +'</div>';
    });

    menusisalto = menusisalto   + paivaruoka;

    paivaruoka = "";
    
    return menusisalto;
    

}