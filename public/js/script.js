$(document).ready(function() {
   $(".addToCart").on("click", function(e) {

       e.preventDefault();

       $.ajax({
           url : '/cart/add',
           type : 'POST',
           data: $(this).parent().serialize(),
           dataType : 'json',
           success : function(response, status) {
               alert(response.success);
           }
       });

   });

   $("#validateOrder").on("click", function(e) {

       $.ajax({
           url : '/order',
           type : 'POST',
           success : function(response, status) {
               console.log("success");
               window.location.replace("http://localhost:8080/orders");
           }
       });

   });
});