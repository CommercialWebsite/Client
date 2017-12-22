$(document).ready(function() {
    var namefilter;
    var brandfilter;
    var typeIdfilter;
	var productsHtml;
    $("#name,#brand,#typeId").on("change", function(e) {
		
	    namefilter = $('#name').val();
		brandfilter = $('#brand').val();
		typeIdfilter = $('#typeId').val();
		if($('#name').val() == ''){
			namefilter = 'any';
		}
		if($('#brand').val() == ''){
			brandfilter = 'any';
		}
		
		e.preventDefault();

		$.ajax({
			url : '/product/filter',
			type : 'POST',
			data: {name: namefilter, brand: brandfilter, typeId: typeIdfilter},
			dataType : 'json',
			success : function(response, status) {
				productsHtml = '';
				if(response.listProducts == ''){
					productsHtml = "<h1 style='color:#ff4d4d'>Aucun produit n'a été trouvé avec ces filtres</h1>"
				}
				response.listProducts.forEach(function(product) {
				productsHtml += `<p>`+product.name+`</p><img src=`+product.imageURL+` style="height: 200px; width: 200px;">
				<h1 style="color:#ff9933">`+product.price+`€</h1>
                <form action="">
                    <input type="hidden" name="id" value=`+product.id+`>
                    <input type="hidden" name="name" value=`+product.name+`>
                    <input type="hidden" name="brand" value=`+product.brand+`>
                    <input type="hidden" name="typeId" value=`+product.typeId+`>
                    <input type="hidden" name="price" value=`+product.price+`>
                    <input type="hidden" name="imageURL" value=`+product.imageURL+`>
					Qty:<input type="number" name="quantity" min=1 max=99 value=1>
                    <button type="submit" class="btn btn-warning addToCart">Ajouter au panier</button>
                </form></br>`;
				});
				$('#products').html(productsHtml);

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

			}
		});

		/*request('http://localhost:6000', function (error, response, body) {
		  if (!error && response.statusCode == 200) {
			console.log(body) // Print the body of response.
		  }
		})
		$.ajax({
            url : url,
		    beforeSend: function(request) {
				request.setRequestHeader("Access-Control-Allow-Origin", "pachimari");
		    },
            type : 'GET',
            dataType : 'json',
            success : function(response, status) {;
               alert(response.success);
            }
       });*/


    });

});