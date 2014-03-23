Date.prototype.getDayName = function() {
    var d = ['Sunnuntai','Maanantai','Tiistai','Keskiviikko','Torstai','Perjantai','Lauantai'];
    return d[this.getDay()];
};


$( document ).ready(function() { 

    var paiva = new Date().getDayName(); //Hae tämä päivä
    
    if (paiva === "Lauantai" || paiva === "Sunnuntai") { //Jos lauantai tai sunnuntai niin päivä on maanantai
        paiva = "Maanantai";
    }
    
    haeMenu(paiva); //Hae ruokalistat

    $(function() {  //Muuta ruokaikkunat liikutettaviksi
        $( "#lowerpart" ).sortable();
        $( "#lowerpart" ).disableSelection();
    });
    
    $('#paivat').on('click', 'a',function() { //Vaihda päivä, muuta boldausta
        
        $('#paivat').children().css("font-weight","normal");
             
        
        paiva = $(this).text();
        $('#lowerpart').empty();

        haeMenu(paiva);
    });

	 $(function() {
    	$('#rinfo').dialog({
      		autoOpen: false,
      		show: {
        		effect: 'blind',
        		duration: 200
      		},
      		hide: {
        		effect: 'blind',
        		duration: 200
      		}
    	});

    	$('#lowerpart').on('click', 'a', function(e) {
			target = $(this).text();
			$.ajax({url: "ravintolat.txt"}).done(function(data){
        		$.each($.parseJSON(data), function(idx, obj) {
					if (obj.nimi === target) { ytiedot = haeYhteystiedot( obj ); }
				});
			});
			$('#rinfo').empty();
      		$('#rinfo').append('<p>' + ytiedot + '</p>');	
			$('#rinfo').dialog("option", { position: [e.pageX+5, e.pageY+5] });
			$('#rinfo').dialog('open');
    	})
  	});
});

$( window ).load(function() { 
    
    $("div").on('click', "span", function() { //Suosikkikeksit
        //alert($(this).text());
        
		this.classList.toggle("icon-off");
		this.classList.toggle("icon-on");
		
        var cookies = $.cookie("fav");  
        var newcookie = $(this).text();
        
        if (!cookies) { 
            $.cookie("fav", newcookie); 
        }
        
        else if(cookies.indexOf(newcookie) === -1) {
            $.cookie("fav", cookies + newcookie);
        }
    });   
    
    $('div.suosikit').on('click', function() {
        
        var keksit = $.cookie("fav");
        
        $('#lowerpart').empty();
        
        haeMenu(paiva,keksit);
        
    });
    

    

    
});

function haeMenu(paiva) {

    var menusisalto = "";
    
    var paivaclass = '.paiva_'+paiva.toLowerCase();
    
    //alert(paivaclass);
    
    $(paivaclass).css("font-weight","bold");

    $.ajax({url: "ravintolat.txt"}).done(function(data){
        $.each($.parseJSON(data), function(idx, obj) {
            
                //alert(obj.nimi);

                $.each((obj.menu), function(idx, obj2) {
                    //alert(obj2.paiva);
                    if (obj2.paiva === paiva) {menusisalto = haeRuoka(obj2);}
                });

                $('#lowerpart').append(
                        '<div class="menuwindow">\n\
                         <div class="menuwindowtop">\n\
                            <div class="menuwindowtitle"><a href="#">' + obj.nimi + '</a></div>\n\
                            <div class="menuwindowfavourite"><span id="favorite-button" class="favorite-button icon-off">' + obj.id + '</span></div>\n\
                         </div>\n\
                         \n\
                         <div class="menuwindowmiddle">'+ menusisalto   +'</div>\n\
                         <div class="menuwindowbottom">'+ obj.ketju     +'</div></div>'
                );
                menusisalto = "";
            
        });
    });
}

function haeYhteystiedot(obj) {
	var yhteystiedot = "";
    osoite = "";
    puh = "";
	email = "";
	
    $.each((obj.yhteystiedot), function(idx, obj2) {
		yhteystiedot = 	'<div class="ytitem">' + obj2.osoite + '</div>' + 
						'<div class="ytitem">' + obj2.puh + '</div>' + 
						'<div class="ytitem">' + obj2.email + '</div>' + 
						'<div class="ytitem">' + obj2.aukioloajat + '</div>' +
						'<div class="ytitem">' + obj2.lounasajat + '</div>';
    });

    osoite = "";
    puh = "";
	email = "";
    return yhteystiedot; 
}

function haeRuoka(obj2){
    
    var menusisalto = "";
    var paivaruoka = "";
    
    $.each((obj2.ruoka), function(idx, obj3) {
        paivaruoka = paivaruoka + '<div class="menufooditem">'  + obj3.title_fi    +'</div>';
    });

    menusisalto = menusisalto   + paivaruoka;

    paivaruoka = "";
    
    return menusisalto;
}