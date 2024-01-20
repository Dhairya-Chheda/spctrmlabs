import wixData from 'wix-data';
import wixStores from 'wix-stores';
import { cart } from 'wix-stores';
import wixLocation from 'wix-location';

$w.onReady(function () {
	wixData.query("Stores/Products")
	.descending("price")
	.find()
	.then((res) => {
		let checkBoxOptions = res.items.map((item) => {return {'label': item.name + " " + item.formattedPrice, 'value': item._id}})
		$w('#checkboxGroup1').options = checkBoxOptions
		$w('#checkboxGroup1').show()
	})

	$w('#addToCart').onClick(() => {
		$w('#uploadingMediaText').show(); $w('#loading').show()
		if($w('#uploadButton1').value.length === 0){
			$w('#error').show(); $w('#uploadingMediaText').hide(); $w('#loading').hide()
			return
		}
		$w("#uploadButton1").uploadFiles()
		.then( (uploadedFiles) => {
			console.log(uploadedFiles);
			// Do something with the uploaded files
			let uploads = uploadedFiles.map((item) => {return {'type': item.fileUrl.includes("image")?"image":"video", 'src': item.fileUrl}})
			// uploadedFiles.forEach(uploadedFile => {
			// 	console.log("File url:" + uploadedFile.fileUrl);
			// })
			console.log("Upload successful.");

			//Get the selected options
			let productIds = $w('#checkboxGroup1').value;
			let products = productIds.map((item) => {return {"productId": item, "quantity": 1}})
			console.log(products);

			cart.addProducts(products)
			.then((updatedCart) => {
				// Products added to cart
				console.log("Products successfully added");
				wixLocation.to('/cart')
				console.log(updatedCart);
				const cartId = updatedCart._id;
				
				let toInsert = {
					'cartId': cartId,
					'uploads': uploads
				}

				wixData.insert("UserUploadOrders", toInsert)
				.then((insertedData) => {
					console.log("Database insert successful");
					wixLocation.to('/cart-page')
				})
				.catch((err) => {
					console.log("There was some error in inserting data");
					console.log(err);
				})
				// const cartLineItems = updatedCart.lineItems;
				
			})
			.catch((error) => {
				// Products not added to cart
				console.error(error);
			});

		} )
		.catch( (uploadError) => {
			console.log("File upload error: " + uploadError.errorCode);
			console.log(uploadError.errorDescription);
			$w('#error').show(); $w('#uploadingMediaText').hide()
		} );

	})

});

/*
$w("#myCheckboxGroup").options = [
  {"label": "Who's on first!", "value": "first"},
  {"label": "What's on second", "value": "second"},
  {"label": "I Don't Know is on third", "value": "third"}
];
*/

/*
import { cart } from 'wix-stores';

const products = [
  {
    "productId": "0873ed58-f88d-77d1-4566-afd4c50d253e",
    "quantity": 3
  },
  {
    "productId": "91f7ac8b-2baa-289c-aa50-6d64764f35d3",
    "quantity": 1,
    "options": {
      "choices": {
        "Weight": "250g",
        "Ground for": "Filter"
      }
    }
  },
  {
    "productId": "5376f9ec-b92e-efa9-e4a1-f4f480aa0d3a",
    "quantity": 1,
    "options": {
      "choices": {
        "Weight": "500g",
        "Ground for": "Stovetop"
      },
      "customTextFields": [{
        "title": "Custom package sticker",
        "value": "Enjoy your coffee!"
      }]
    }
  }
]

cart.addProducts(products)
  .then((updatedCart) => {
    // Products added to cart
    const cartId = updatedCart._id;
    const cartLineItems = updatedCart.lineItems;
  })
  .catch((error) => {
    // Products not added to cart
    console.error(error);
  });


/* Example of returned updatedCart object:
 *
 *  {
 *    "_id": "5d54aa6f-f653-4bed-8c34-7f1373f88c89",
 *    "status": "INCOMPLETE",
 *    "billingAddress": {
 *      "firstName": "Jane",
 *      "lastName": "Doe",
 *      "email": "",
 *      "phone": "+1234567890",
 *      "company": "undefined",
 *      "vatId": "undefined",
 *      "address": "235 West 23rd Street\nNew York, New York 10011\nUnited States"
 *    },
 *    "appliedCoupon": "null",
 *    "buyerInfo": {
 *      "email": "",
 *      "firstName": "Jane",
 *      "identityType": "ADMIN",
 *      "lastName": "Doe",
 *      "phone": "+1234567890"
 *    },
 *    "buyerNote": "undefined",
 *    "currency": {
 *      "symbol": "$",
 *      "code": "USD"
 *    },
 *    "lineItems": [
 *      {
 *        "id": 16,
 *        "productId": "0873ed58-f88d-77d1-4566-afd4c50d253e",
 *        "name": "Digital product",
 *        "quantity": 3,
 *        "lineItemType": "DIGITAL",
 *        "customTextFields": [],
 *        "options": [],
 *        "price": 20,
 *        "totalPrice": 60,
 *        "mediaItem": "null",
 *        "weight": 0
 *      },
 *      {
 *        "id": 17,
 *        "productId": "91f7ac8b-2baa-289c-aa50-6d64764f35d3",
 *        "name": "Colombian Arabica",
 *        "quantity": 1,
 *        "weight": 0.25,
 *        "sku": "10003",
 *        "lineItemType": "PHYSICAL",
 *        "customTextFields": [],
 *        "mediaItem": {
 *          "src": "wix:image://v1/nsplsh_5033504669385448625573~mv2_d_6000_3376_s_4_2.jpg/file.jpg#originWidth=6000&originHeight=3376",
 *          "type": "IMAGE"
 *        },
 *        "options": [
 *          {
 *            "option": "Weight",
 *            "selection": "250g"
 *          },
 *          {
 *            "option": "Ground for",
 *            "selection": "Filter"
 *          }
 *        ],
 *        "price": 35,
 *        "totalPrice": 35
 *      },
 *      {
 *        "id": 18,
 *        "productId": "5376f9ec-b92e-efa9-e4a1-f4f480aa0d3a",
 *        "name": "Indonesian Blend",
 *        "quantity": 1,
 *        "lineItemType": "PHYSICAL",
 *        "customTextFields": [
 *          {
 *            "title": "Custom package sticker",
 *            "value": "Enjoy your coffee!"
 *          }
 *        ],
 *        "mediaItem": {
 *          "src": "wix:image://v1/nsplsh_316b6449475f3235386255~mv2_d_2977_3951_s_4_2.jpg/file.jpg#originWidth=2977&originHeight=3951",
 *          "type": "IMAGE"
 *        },
 *        "options": [
 *          {
 *            "option": "Weight",
 *            "selection": "500g"
 *          },
 *          {
 *            "option": "Ground for",
 *            "selection": "Stovetop"
 *          }
 *        ],
 *        "price": 35,
 *        "totalPrice": 35,
 *        "weight": 0
 *      }
 *    ],
 *    "shippingInfo": {
 *      "shippingAddress": {
 *        "firstName": "Jane",
 *        "lastName": "Doe",
 *        "email": "",
 *        "phone": "+1234567890",
 *        "company": "undefined",
 *        "vatId": "undefined",
 *        "address": "235 West 23rd Street\nNew York, New York 10011\nUnited States"
 *      }
 *    },
 *    "totals": {
 *      "discount": 0,
 *      "quantity": 5,
 *      "shipping": 0,
 *      "subtotal": 160,
 *      "tax": 0,
 *      "total": 160,
 *      "weight": 0.75
 *    },
 *    "weightUnit": "KG"
 *  }
 *
 */
