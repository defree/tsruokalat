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
		$( "#lowerpart" ).on("sortupdate",function( event, ui ) { //Tässä tarkoituksen on säilöä sortablen tila localStorageen, jotta tila säilyy sivulatausten välissä. Ei kuitenkaan toimi odotetusti.
			  var lajiteltu = $( this ).sortable( "serialize");
			  console.log(lajiteltu);
			  localStorage.setItem('lajiteltu', lajiteltu) ;
		});
		
		if(localStorage.getItem("lajiteltu") !== null){
		  var jarjnumerot = localStorage.getItem('lajiteltu').substring(4).split("&div[]="); 		
		  var $ul = $("#lowerpart");
		  $items = $("#lowerpart").children();
		
		  for (var i = jarjnumerot.length - 1; i >= 0; i--) {
			$ul.prepend( $items.get((jarjnumerot[i] - 1)));
		  }
		}
		$( "#lowerpart" ).disableSelection();
	});
	
    $('#paivat').on('click', 'a',function() { //Vaihda päivä, muuta boldausta
        
        $('#paivat').children().css("font-weight","normal"); 
        
        paiva = $(this).text();
        $('#lowerpart').empty();

        haeMenu(paiva);
    });
	
	
    $('#rinfo').dialog({ //JQueryUI dialogin asetukset. Liittyy lisätietoikkunaan.
    	autoOpen: false,
		maxWidth: 450,
        maxHeight: 250,
        width: 450,
        height: 250,
      	show: {
        	effect: 'blind',
        	duration: 200
      	},
      	hide: {
        	effect: 'blind',
        	duration: 200
      	}
    });

    $('#lowerpart').on('click', 'a', function(e) { //Infoikkunan näyttäminen
    	var ytiedot = "";
            
        target = $(this).text();
            
        $('#rinfo').empty();
        $('#rinfo').dialog("option", { position: [e.pageX+5, e.pageY+5] });
            
        $.ajax({url: "ravintolat.txt"}).done(function(data){
        	$.each($.parseJSON(data), function(idx, obj) {
            	if (obj.nimi === target) { ytiedot = haeYhteystiedot( obj ); }
            });
                
            $('#rinfo').append('<p>' + ytiedot + '</p>');	
            $('#rinfo').dialog('open');
           });
    });
    
    
    $("div").on('click', "span", function() { //Suosikkikeksit
        //alert($(this).text());
        
        this.classList.toggle("icon-off");
        this.classList.toggle("icon-on");
		
        var cookies = $.cookie("fav");  
        var newcookie = $(this).text();
        
        if (!cookies) { 
            $.cookie("fav", newcookie); 
        }
        
        if(cookies.indexOf(newcookie) === -1) {
            $.cookie("fav", cookies + newcookie); //Lisätään uusi id keksiin
        }
        else {
            cookies = cookies.replace(newcookie,""); //Poistetaan id keksistä jos se esiintyy siellä, aka suosikin poisto.
            $.cookie("fav", cookies);
        }
    });
    
    $('#suosikit').on('click', function(e) {
        var keksit = $.cookie("fav");
        
        $('#lowerpart').empty();
                
        if($(e.target).hasClass('kaikki')){
            haeMenu(paiva);
        }
        else if ($(e.target).hasClass('suosikki')){
            haeSuosikkiMenu();
        }
        else {
            haeMenu(paiva);
            if($(e.target).hasClass('redbox') || $(e.target).children().hasClass('redbox')){
                $('#upperpart').css("background","#e47297");
            
            }
            else if($(e.target).hasClass('greenbox') || $(e.target).children().hasClass('greenbox')){
                $('#upperpart').css("background","#99CC99");
            }
            else {
                $('#upperpart').css("background","#729fcf");
            }
        }
    }); 

});

function haeMenu(paiva) {

    var menusisalto = "";
    
    var keksit = $.cookie("fav");
    
    if (keksit === undefined) {keksit = '';}
    
    var keksiclass = '';
    var paivaclass = '.paiva_'+paiva.toLowerCase();
    
    //alert(paivaclass);
    
    $(paivaclass).css("font-weight","bold");
	var i=0;
    $.ajax({url: "ravintolat.txt"}).done(function(data){
        $.each($.parseJSON(data), function(idx, obj) {
            
                //alert(obj.nimi);
                
                if(keksit.indexOf(obj.id) !== -1) {
                    keksiclass = 'icon-on';
                }
                else {
                   keksiclass = 'icon-off'; 
                }
                
                $.each((obj.menu), function(idx, obj2) {
                    //alert(obj2.paiva);
                    if (obj2.paiva === paiva) {menusisalto = haeRuoka(obj2);}
                });

                $('#lowerpart').append(
                        '<div class="menuwindow" id="div_'+i+'">\n\
                         <div class="menuwindowtop">\n\
                            <div title="Näytä lisätiedot" class="menuwindowtitle"><a href="#">' + obj.nimi + '</a></div>\n\
                            <div title="Lisää suosikkeihin" class="menuwindowfavourite"><span id="favourite-button" class="favourite-button '+keksiclass+'">' + obj.id + '</span></div>\n\
                         </div>\n\
                         \n\
                         <div class="menuwindowmiddle">'+ menusisalto   +'</div>\n\
                         <div class="menuwindowbottom">'+ obj.ketju     +'</div></div>'
                );
                menusisalto = "";
				i++;
        });
    });
}

function haeSuosikkiMenu() {

    var keksit = $.cookie("fav");

    if (keksit === undefined) {keksit = '';}

    var tyhja = true;

    $.ajax({url: "ravintolat.txt"}).done(function(data){
        $.each($.parseJSON(data), function(idx, obj){
            if(keksit.indexOf(obj.id) !== -1){
                tyhja = false; // jos löytyi edes yksi suosikki
                var newdiv = '<div class="favmenuwindow">\n\
                            <div class="menuwindowtop">\n\
                                <div class="menuwindowtitle"><a href="#">' + obj.nimi + '</a></div>\n\
                                <div title="Lisää suosikkeihin" class="menuwindowfavourite"><span id="favourite-button" class="favourite-button icon-on">' + obj.id + '</span></div>\n\
                                </div><div class="favmenuwindowmiddle"><table class="favmenutable">\n\
                                <tr>';
                $.each((obj.menu), function(idx, obj2) {
                    newdiv += '<td style="font: 16px arial; font-weight: bold; color: #447294;">' + obj2.paiva + '</td>';
                });
                newdiv += '</tr>\n\
                            <tr>';
                $.each((obj.menu), function(idx, obj2) {
                    newdiv += '<td><div class="menuwindowmiddle">' + haeRuoka(obj2) + '</div></td>';
                });
                newdiv += '</tr>\n\
                            </table></div>\n\
                            <div class="menuwindowbottom">' + obj.ketju + '</div></div>';
                $('#lowerpart').append(newdiv);
            }
        });
        if(tyhja){ // poistakaa tämä jos ärsyttää
            alert("Et ole valinnut suosikkeja");
        }
    });
}

function haeYhteystiedot(obj) {
	var yhteystiedot = "";
	    
    $.each((obj.yhteystiedot), function(idx, obj2) {
		yhteystiedot = 	'<div class="ytitem">' + obj2.osoite + '</div>' + 
						'<div class="ytitem">' + obj2.puh + '</div>' + 
						'<div class="ytitem">' + obj2.email + '</div>' + 
						'<div class="ytitem">' + obj2.aukioloajat + '</div>' +
						'<div class="ytitem">' + obj2.lounasajat + '</div>';
    });

    return yhteystiedot; 
}

function haeRuoka(obj2){
    
    var menusisalto = "";
    var paivaruoka = "";
    var price = "";
    
    
    
    $.each((obj2.ruoka), function(idx, obj3) {
        
        
        if (obj3.price === undefined) {price = '';} else {price = obj3.price.substr(0,4);}
        
        paivaruoka = paivaruoka + '<div class="menufooditem">\n\
                                        <div class="menufooditemfood">'  + obj3.title_fi    +'</div>\n\
                                        <div class="menufooditemprice">'  + price    +'</div>\n\
                                   </div>';
    });

    menusisalto = menusisalto + paivaruoka;

    paivaruoka = "";
    
    return menusisalto;
}
