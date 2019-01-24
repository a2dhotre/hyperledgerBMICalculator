/**
 * Sample transaction processor function.
 * @param {health.CalculateBMI} findBmi The sample transaction instance.
 * @transaction
 */
async function CalculateBmi(findBmi) {  // eslint-disable-line no-unused-vars

    // Save the old value of the asset.
    const oldBmi = findBmi.user.bmi;
  	console.log(findBmi.user.weight);
	console.log(findBmi.user.height);	
  
    // Update the asset with the new value.
  	const heightInMeter = (findBmi.user.height * 0.01)
    findBmi.user.bmi = findBmi.user.weight/Math.pow(heightInMeter,2);

    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('health.UserAccount');
    // Update the asset in the asset registry.
    await assetRegistry.update(findBmi.user);

    // Emit an event for the modified asset.
    let event = getFactory().newEvent('health', 'BmiCalculatedEvent');
    event.user = findBmi.user;
    event.OldBmi = oldBmi;
    event.NewBmi = findBmi.user.bmi;
    emit(event);
}
