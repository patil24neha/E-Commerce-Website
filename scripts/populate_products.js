/* Code developed by Patil, Neha
Project #4
Fall 2017
Username : jadrn045, 
RED ID : 821545485 */ 


var proj4_data;
$(document).ready(function() {
	

    proj4_data = new Array();
    $.get('/perl/jadrn045/proj4/get_products.cgi', storeData);
	
	var cart = new shopping_cart("jadrn045");
	var qt;
	$('#count').text(cart.size()); 
    
    $('#milk').on('click', function() {
        displayProducts("Milk chocolate");
        })
    $('#dark').on('click', function() {
        displayProducts("Dark chocolate");
        })
	$('#nuts').on('click', function() {
        displayProducts("Nuts and chews");
        })
	$('#brittle').on('click', function() {
        displayProducts("Brittles and toffies");
        })
	$('#truffles').on('click', function() {
        displayProducts("Truffles");
        })
	$('#gifts').on('click', function() {
        displayProducts("Gifts");
        })
	$('#holiday').on('click', function() {
        displayProducts("Holiday assortments");
        })
	
	$('#content').on('click', ".prodname",function() {
        displayProduct(this.id);
        })	
	

  $('#content').on('click',".addtocart", function() {

var sku = this.id;
qt=$("."+sku).val();

  if(!$.isNumeric(qt) )
			{
			var errmsg="Quantity should be number";			
			$("#"+sku+"_err").show();
			$("#"+sku+"_err").html(errmsg);
			}
	else 
	{
	$("#"+sku+"_err").hide();
	if (!qt == 0)
		{
        cart.add(sku,qt);
		 qt = 0;
		}
		$('#count').text(cart.size());
    }
});      
      

    });    

	
	function displayProducts(category) 
	{
		tmpString = "";

if(category=="All")
	{	
     		for(var i=0; i < 4; i++) {
			
        	var randomNo = Math.floor(Math.random() * proj4_data.length-1);
		
			tmpString +='<div class="row"><div class="content col-md-4"><img class="border" src=\"/~jadrn000/PROJ4_IMAGES/'+
                proj4_data[randomNo][0]+".jpg\" alt=\""+proj4_data[randomNo][2]+"\""+
                "width=\"200px\"  /></div>";

			tmpString +='<div class="col-md-4"><span class="prodname" id="'+proj4_data[randomNo][0]+'">'+proj4_data[randomNo][2]+"</span>"+
			"<br>"+proj4_data[randomNo][3]+
			"<br>$"+proj4_data[randomNo][6]+
			"</div>";
				
			tmpString +="<div class='col-md-4'>Quantity : <input type='text' name='quantity' id='quantity' class='"+proj4_data[randomNo][0]+"' size='10'><br><br><input type='button' id='"+proj4_data[randomNo][0]+"' class='addtocart' value='Add To Cart' /><br><br><div class='error' id='"+proj4_data[randomNo][0]+"_err'>&nbsp;</div></div></div><br><hr>";
            }

	}		

else	
	{
		for(var i=0; i < proj4_data.length; i++) {
            if(proj4_data[i][1] == category) 
			{
			
			tmpString +='<div class="row"><div class="content col-md-4"><img class="border" src=\"/~jadrn000/PROJ4_IMAGES/'+
                proj4_data[i][0]+".jpg\" alt=\""+proj4_data[i][2]+"\""+
                "width=\"200px\"  /></div>";

			tmpString +='<div class="col-md-4"><span class="prodname" id="'+proj4_data[i][0]+'">'+proj4_data[i][2]+"</span>"+
			"<br>"+proj4_data[i][3]+
			"<br>$"+proj4_data[i][6]+
			"</div>";
				
			tmpString +="<div class='col-md-4'>Quantity : <input type='text' name='quantity' id='quantity' class='"+proj4_data[i][0]+"' size='10'><br><br><input type='button' id='"+proj4_data[i][0]+"' class='addtocart' value='Add To Cart' /><br><br><div class='error' id='"+proj4_data[i][0]+"_err'>&nbsp;</div></div></div><br><hr>";
            }
            }
	}
     
	 var handle = document.getElementById('content');
        handle.innerHTML = tmpString;
	
}
	
			
	function displayProduct(sku) 
	{
		tmpString = "";
        for(var i=0; i < proj4_data.length; i++) {
            if(proj4_data[i][0] == sku) 
			{
			
			tmpString +='<div class="row"><div class="content col-md-4"><img class="border" src=\"/~jadrn000/PROJ4_IMAGES/'+
                proj4_data[i][0]+".jpg\" alt=\""+proj4_data[i][2]+"\""+
                "width=\"200px\"  /></div>";

			tmpString +='<div class="col-md-4">'+proj4_data[i][2]+
			"<br>"+proj4_data[i][3]+
			"<br>"+proj4_data[i][4]+
			"<br>$"+proj4_data[i][6]+
			"</div>";
				
			tmpString +="<div class='col-md-4'>Quantity : <input type='text' name='quantity' id='quantity' class='"+proj4_data[i][0]+"' size='10'><br><br><input type='button' id='"+proj4_data[i][0]+"' class='addtocart' value='Add To Cart' /><br><br><div class='error' id='"+proj4_data[i][0]+"_err'>&nbsp;</div></div></div><br>";
            }
            }
			$(".some").hide();
        var handle = document.getElementById('content');
        handle.innerHTML = tmpString;
	}

	
    
function storeData(response) {

    var tmpArray = explodeArray(response,';');
    for(var i=0; i < tmpArray.length; i++) {
        innerArray = explodeArray(tmpArray[i],'|');
        proj4_data[i] = innerArray;
        }
	displayProducts("All");
    }
   
           
function explodeArray(item,delimiter) {
tempArray=new Array(1);
var Count=0;
var tempString=new String(item);

while (tempString.indexOf(delimiter)>0) {
tempArray[Count]=tempString.substr(0,tempString.indexOf(delimiter));
tempString=tempString.substr(tempString.indexOf(delimiter)+1,tempString.length-tempString.indexOf(delimiter)+1);
Count=Count+1
}

tempArray[Count]=tempString;
return tempArray;
}