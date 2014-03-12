var loop = 0;

var menusisalto = "";
var paivaruoka = "";

Date.prototype.getDayName = function() {
    var d = ['Sunnuntai','Maanantai','Tiistai','Keskiviikko','Torstai','Perjantai','Lauantai'];
    return d[this.getDay()];
}

var paiva = new Date().getDayName();


$.ajax({url: "ravintolat.txt"}).done(function(data){
    $.each($.parseJSON(data), function(idx, obj) {
        
        //alert(obj.nimi);

        $.each((obj.menu), function(idx, obj2) {
            //alert(obj2.paiva);
            if (obj2.paiva == paiva) {haeRuoka(obj2);}
        });
        
        $('#lowerpart').append(
                '<div class="menuwindow">\n\
                 <div class="menuwindowtitle">' + obj.nimi      +'</div>\n\
                 <div class="menuwindowmiddle">'+ menusisalto   +'</div>\n\
                 <div class="menuwindowbottom">'+ obj.ketju     +'</div></div>'
        );
        menusisalto = "";
    });
});

function haeRuoka(obj2){
    $.each((obj2.ruoka), function(idx, obj3) {
        paivaruoka = paivaruoka + '<div class="menufooditem">'  + obj3.ruokalaji    +'</div>';
    });

    menusisalto = menusisalto   +'<div class="menufood">'   + paivaruoka    +'</div>' ;
    
    paivaruoka = "";
    
}

