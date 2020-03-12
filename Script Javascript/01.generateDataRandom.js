function generateDataRandom(obj) {
	
	let phoneNumber1 = `0${Math.floor(Math.random() * 1000000000)}`;
	let phoneNumber2 = NumberInt(phoneNumber1);
	let customRating = Number.parseFloat((Math.random() * 10).toFixed(1));
    
	obj.phoneNumber1 = phoneNumber1;
	obj.phoneNumber2 = phoneNumber2;
	obj.customRating = customRating;

	return obj;
}

db.restaurants.find().forEach((object) => {
	db.restaurants.save(generateDataRandom(object));
});
