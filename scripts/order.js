/* Code developed by Patil, Neha
Project #4
Fall 2017
Username : jadrn045, 
RED ID : 821545485 */ 

var proj4_data;
var cart;
$(document).ready(function() {
	
    proj4_data = new Array();
	cart = new shopping_cart("jadrn045");
    $.get('/perl/jadrn045/proj4/get_products.cgi', storeData);
	

   $("#dialog-modal").dialog({
            height: 450,
            width: 650,
            modal: true,
            autoOpen: false
    });
  
$('#cartproducts').on('click', "#order", function($e) {  
	 $("#dialog-modal").dialog('open');
     });	
			
$('input[type="checkbox"]').click(function()
	 {
     if($(this).prop("checked") == true){
	populateShipping();
	}});
			
$('#cartproducts').on('click',".delete_item", function() {
	var sku = this.id;
	cart.delete(sku);
	displayCartProducts("order");
   }); 
			
$('#cartproducts').on('click',".change_qty", function() {

var sku = this.id;
qt=$("."+sku).val();	
  if(!$.isNumeric(qt))
			{
			
			var errmsg="Quantity should be number";			
			$("#"+sku+"_err").show();
			$("#"+sku+"_err").html(errmsg);
			}
	else	{
			$("#"+sku+"_err").hide();
			cart.setQuantity(sku, qt);
			displayCartProducts("order");
			}
});

$("#state").blur(function()
{
$("#state").val($("#state").val().toUpperCase());
});

$("#Sstate").blur(function()
{
$("#Sstate").val($("#Sstate").val().toUpperCase());
});

$("#contactno").blur(function(){
$("#contactno").val($("#contactno").val().replace(/(\d{3})(\d{3})(\d{4})/,'$1-$2-$3')) 									 
});

$("#Scontactno").blur(function(){
$("#Scontactno").val($("#Scontactno").val().replace(/(\d{3})(\d{3})(\d{4})/,'$1-$2-$3')) 									 
});


 $('#submitorder').on('click',function(e) {  
		validateform();
		if(validateform())
		{
		$.get('/perl/jadrn045/proj4/InsertToDB.cgi', insertOrder);
		}
		
});	       

$('#count').html(cart.size());
});    

	
function insertOrder(response)
{
if (response.startsWith("Success"))
{

displayConfirmation();
}
else

$("#dialog-modal").dialog('close');
$('#dberror').html("Order system is down, Please try again after some time");
}

function isEmpty(fieldValue) {
        return $.trim(fieldValue).length == 0;    
        } 

function isValidState(state) {                                
 var stateList = new Array("AK","AL","AR","AZ","CA","CO","CT","DC","DE","FL","GA","GU","HI","IA","ID","IL","IN","KS","KY","LA","MA","MD","ME","MH","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY","OH","OK","OR","PA","PR","RI","SC","SD","TN","TX","UT","VA","VT","WA","WI","WV","WY");
    for(var i=0; i < stateList.length; i++) 
        if(stateList[i] == $.trim(state))
            return true;
        return false;
}
 
function isValidCard(expdate) {                                

	var today = new Date();
	expday = new Date();

	var expmonth = expdate.substr(0, 2);
    var expyear = expdate.substr(3, 4);

	expday.setFullYear(expyear, expmonth, 1);
	if (expmonth==00 || expmonth>12 )
	  return false;
	
	else if (expday < today)
	  return false;
   else 
   return true;
}

function populateShipping()
{


 $('#SFname').val($('#Fname').val());
 $('#SLname').val($('#Lname').val());
$('#Saddress1').val($('#address1').val());
$('#Saddress2').val($('#address2').val());
$('#Scity').val($('#city').val());
$('#Sstate').val($('#state').val());
$('#Scontactno').val($('#contactno').val());
$('#Szip').val($('#zip').val());
					
	
}

function displayConfirmation()
{
$("#dialog-modal").dialog('close');
$('#dberror').hide();
displayCustomerInfo();
displayCartProducts("confirm");

document.cookie = 'jadrn045=; expires=-1;path=/'

}	

function displayCustomerInfo()
{
var custStr;
var card = $('#cardno').val().replace(/\d(?=\d{4})/g, "*");
  
  custStr +="<div class='confirmmsg'> Order Confirmation : <br> Hello ";
  custStr +=$('#Fname').val()+", Thank you for your order. <br> Your order will be sent to : "
			+$('#address1').val()+" "+$('#address2').val()+
			'<br>'+$('#city').val()+' , '+$('#state').val()+' , '+$('#zip').val()+
			'<br>Charged to : '+card+"<br><br>";
			
	$('#customerinfo').html(custStr);		

}

function displayCartProducts(quant)
{
	  
	  if(quant=="order")
		$('#count').text(cart.size());
	  else
		$('#count').text("0");
	  
	
        var producttotal = 0;
        var taxRate = 0.08;
        var shippingfee = 2;
        var cartProducts = cart.getCartArray();
        if(cartProducts.length == 0){
		
         $('#cartproducts').html("<h1>Your shopping cart is empty</h1><br><h3>Please add some <a href='Products.html'>chocolates</a> to cart");
		 $('#order').hide();
		 return;
        }
		
        var displayStr = '<div class="row"><div class="content col-md-8"><table class="order"><tr><th>Product Image</th><th>Name</th><th>Quantity</th><th>Price</th><th>Total</th>';
		
			if(quant=="order")
				displayStr += "<th>Update cart</th></tr>";
				
				else
				displayStr += "</tr>";
				
        for(var i=0; i < cartProducts.length; i++) {
         var sku = cartProducts[i][0];
         var quantity = parseInt(cartProducts[i][1]);
         var name;
		 var price;
      
          for(var j=0; j < proj4_data.length; j++) {

           if(proj4_data[j][0] == cartProducts[i][0]) {   
		  
               price = parseFloat(proj4_data[j][6]);
               name = proj4_data[j][2];
               var prodPrice = quantity * price;
               producttotal += prodPrice;
			   
               displayStr += "<tr><td><img src=\"/~jadrn000/PROJ4_IMAGES/"+proj4_data[j][0]+".jpg\" alt=\""
			   +proj4_data[i][2]+"\""+" width=\"200px\"  /></td><td>"+name+"<br>"+sku+"</td>";
				
				if(quant=="order")
				displayStr += "<td><input type='text' name='quantity' size='5' class='"+proj4_data[j][0]+"' value='"+quantity+"' /><div class='error' id='"+proj4_data[j][0]+"_err'>&nbsp;</div></td>";
				
				else
				displayStr += "<td>"+quantity+"<br></td>";
				
				displayStr +="<td>$"+price+"</td>";
				displayStr +="<td>$"+prodPrice.toFixed(2)+"</td>";
   			   
			   if(quant=="order")
				displayStr +="<td><input type='button' class='change_qty' id="+proj4_data[j][0]+" value='Change Quantity' /><br><br>"
			   +"<input type='button' class='delete_item' id="+proj4_data[j][0]+" value='Remove from cart' /></td></tr>";
				
				else
				displayStr +="</tr>";
			
          }
         }
		 
        }
		displayStr +="</table></div>";
        var tax = producttotal * taxRate;
        var finalPrice = producttotal + shippingfee + tax;
        displayStr += "<div class='content col-md-4'><table class='order'><tr><td>Product Total:  </td><td>$" + producttotal.toFixed(2) + "</td></tr>" +
        "<tr><td>Tax:  </td> <td>$" + tax.toFixed(2) + "</td></tr>" +
        "<tr><td>Shipping Fee:  </td><td>$2.00</td></tr>" +
        "<tr><td>Order Total:  </td><td>$" + finalPrice.toFixed(2) + "</td></tr></table><br>";
	
		 if(quant=="order")
				displayStr +="<input type='button' class='btn btn-primary btn-lg' value='Place an Order' id='order' /></div></div>";
				
				else
				displayStr +="</div></div>";
				
        $('#cartproducts').html(displayStr);
		
		if(cart.size()==0){
		$('#order').hide();
	
		}
	
    }
   
function validateform()
{
fname_err = false;

if(isEmpty($('#Fname').val())) 
			{		
			errmsg="Enter First Name";
            fname_err=true;
            }
else if(isEmpty($('#Lname').val())) 
			{		
			errmsg="Enter Last Name";
            fname_err=true;
            }
else if(isEmpty($("#address1").val())) 
			{	
			errmsg="Enter Address";
            fname_err=true;
            }			
else if(isEmpty($("#city").val())) 
			{
			errmsg="Enter City";
            fname_err=true;
            }	
else if(isEmpty($("#state").val())) 
			{
			errmsg="Enter State";
            fname_err=true;
            }	
else if(!isValidState($("#state").val())) 
			{
			errmsg="Invalid State, use two letter code";	
			fname_err=true;
            }
else if(isEmpty($("#zip").val())) 
			{			
			errmsg="Enter your Zip code";
			fname_err=true;
			}
else if(!$.isNumeric($("#zip").val())) 
			{
			errmsg="Zip zode should be numbers";			
			fname_err=true;
			}
else if($("#zip").val().length != 5) 
			{		
			errmsg="The zip code must have exactly five digits";
			fname_err=true;	
			}
else if(isEmpty($("#contactno").val())) 
			{
			errmsg="Enter your phone number";
			fname_err=true;
			}
else if(!$("#contactno").val().match(/^\d{3}-\d{3}-\d{4}$/))
			{
			errmsg="Phone no must have exactly ten digits";
			fname_err=true;
			}
else if($('select[name="cardtype"]').val()=="") 
			{
			errmsg="Select card type";	
			fname_err=true;
			}
else if(isEmpty($("#cardno").val())) 
			{
			errmsg="Enter your card number";
			fname_err=true;
			}
else if(!$("#cardno").val().match(/^\d{16}$/))
			{
			errmsg="Card no must have exactly sixteen digits";
			fname_err=true;
			}
else if(isEmpty($("#expdate").val())) 
			{
			errmsg="Enter card expiry date";
			fname_err=true;
			}
else if(!$("#expdate").val().match(/^\d{2}\/\d{4}$/))
			{
			errmsg="Enter expiry date in 08/2018 form";
			fname_err=true;
			}			
else if(!isValidCard($("#expdate").val()))
			{
			errmsg="Please use active card";
			fname_err=true;
			}							
else if(isEmpty($('#SFname').val())) 
			{		
			errmsg="Enter First Name";
            fname_err=true;
            }
else if(isEmpty($('#SLname').val())) 
			{		
			errmsg="Enter Last Name";
            fname_err=true;
            }
else if(isEmpty($("#Saddress1").val())) 
			{	
			errmsg="Enter Address";
            fname_err=true;
            }			
else if(isEmpty($("#Scity").val())) 
			{
			errmsg="Enter City";
            fname_err=true;
            }	
else if(isEmpty($("#Sstate").val())) 
			{
			errmsg="Enter State";
            fname_err=true;
            }	
else if(!isValidState($("#Sstate").val())) 
			{
			errmsg="Invalid State, use two letter code";	
			fname_err=true;
            }
else if(isEmpty($("#Szip").val())) 
			{			
			errmsg="Enter your Zip code";
			fname_err=true;
			}
else if(!$.isNumeric($("#Szip").val())) 
			{
			errmsg="Zip zode should be numbers";			
			fname_err=true;
			}
else if($("#Szip").val().length != 5) 
			{		
			errmsg="The zip code must have exactly five digits";
			fname_err=true;	
			}
else if(isEmpty($("#Scontactno").val())) 
			{
			errmsg="Enter your phone number";
			fname_err=true;
			}
else if(!$("#Scontactno").val().match(/^\d{3}-\d{3}-\d{4}$/))
			{
			errmsg="Phone no must have exactly ten digits";
			fname_err=true;
			}
	else 	{		
			errmsg="";
            fname_err=false;
            }
	
if(fname_err == true) 
{
$("#error").html(errmsg);
return false;
}
else
{
$("#error").hide();
return true;
}	
			
}

function storeData(response) {

    var tmpArray = explodeArray(response,';');
    for(var i=0; i < tmpArray.length; i++) {
        innerArray = explodeArray(tmpArray[i],'|');
        proj4_data[i] = innerArray;
		
        }
	 displayCartProducts("order");
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