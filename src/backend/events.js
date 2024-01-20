import wixData from 'wix-data';

const CONSTANTS = {
	PICKUP_TITLE: 'Pickup from store',
	PICKUP_TIME: '00:00'
}

function setOrderNumber(cartId, orderNumber) {
	wixData.query('UserUploadOrders')
		.eq('cartId', cartId)
		.find()
		.then((results) => {
			if (results.items.length > 0) {
				const item = results.items[0];
				deliveryUpdate(cartId, orderNumber, item);
				// setDeliverySlot(item.date, item.deliveryTime);
			} else {
				console.log('Cart ID ' + cartId + ' not found');
			}
		})
		.catch((err) => {
			console.error('deliveryUpdate error', err);
		});
}

function deliveryUpdate(cartId, orderNumber, itemToUpdate) {
	wixData.get('UserUploadOrders', itemToUpdate._id)
		.then((item) => {
			item.orderNumber = orderNumber + '';
			wixData.update('UserUploadOrders', item);
		})
		.catch((err) => {
			console.error('deliveryUpdate error', err);
		});
}

// function updateDeliveryAvailability(item) {
// 	wixData.get('deliveries-availability', item._id)
// 		.then(result => {
// 			result.counter = result.counter + 1;
// 			wixData.update('deliveries-availability', result);
// 		})
// 		.catch((err) => {
// 			console.error('updateDeliveryAvailability error', err);
// 		});
// }

// function insertDeliveryAvailability(datObj, slot) {
// 	let toInsert = {
// 		'deliveryDate': datObj,
// 		'deliveryTime': slot,
// 		'counter': 1
// 	};

// 	wixData.insert('deliveries-availability', toInsert)
// 		.then((response) => {
// 			console.log('deliveries-availability insert', response)
// 		})
// 		.catch((err) => {
// 			console.error('insertDeliveryAvailability error', err);
// 		});
// }

// function setDeliverySlot(date, slot) {
// 	const datObj = new Date(date).toDateString();

// 	wixData.query('deliveries-availability')
// 		.eq('deliveryDate', datObj)
// 		.find()
// 		.then((results) => {
// 			if (results.items.length > 0) {
// 				const itemToUpdate = results.items[0];

// 				if (itemToUpdate.deliveryTime === slot) {
// 					updateDeliveryAvailability(itemToUpdate); // date & slot exist
// 				} else {
// 					insertDeliveryAvailability(datObj, slot); // date exists, slot does not
// 				}
// 			} else {
// 				insertDeliveryAvailability(datObj, slot); // date does not exist
// 			}
// 		})
// 		.catch((err) => {
// 			console.error('setDeliverySlot error', err);
// 		});
// }

export function wixStores_onNewOrder(event) {
	getFullOrder(event.orderId)
		.then(async (order) => {
			setOrderNumber(order.cartId, order.number);
		});
}

function getFullOrder(orderId) {
	return wixData.get('Stores/Orders', orderId);
}