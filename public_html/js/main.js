Date.prototype.getDayName = function() {
    var d = ['Sunnuntai','Maanantai','Tiistai','Keskiviikko','Torstai','Perjantai','Lauantai'];
    return d[this.getDay()];
};




$( document ).ready(function() {

    var paiva = new Date().getDayName();

    haeMenu(paiva);

    
    $(function() {
        $( "#lowerpart" ).sortable();
        $( "#lowerpart" ).disableSelection();
    });
    
    
    $('#paivat').on('click', 'a',function() {
        
        $('#paivat').css("font-weight","normal");
        
        paiva = $(this).text();
        $('#lowerpart').empty();
        
        $(this).css("font-weight","bold");
        
        haeMenu(paiva);
    });
	
	 $(function() {
    	$('#rinfo').dialog({
      		autoOpen: false,
      		show: {
        		effect: 'blind',
        		duration: 500
      		},
      		hide: {
        		effect: 'explode',
        		duration: 500
      		}
    	});
 
    	$('#lowerpart').on('click', '#popopen', function() {
      		$( '#rinfo' ).dialog( 'open' );
    	});
  	});
});

$( window ).load(function() { 
    
    $("div").on('click', "span", function() {
        //alert($(this).text());
        
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
                            <div class="menuwindowtitle">' + obj.nimi      +'</div>\n\
							<button id="popopen">Tiedot</button>\n\
                            <div class="menuwindowfavourite"><span class="favclick ui-icon ui-icon-star">' + obj.id + '</span></div>\n\
                         </div>\n\
                         \n\
                         <div class="menuwindowmiddle">'+ menusisalto   +'</div>\n\
                         <div class="menuwindowbottom">'+ obj.ketju     +'</div></div>'
                );
                menusisalto = "";
            
        });
    });

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