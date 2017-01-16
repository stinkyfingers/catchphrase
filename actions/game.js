import Reflux from 'reflux';


var GameActions = Reflux.createActions([
	'next',
	'getCategories',
	'setCategory',
	'clearBuzzer'
]);

export default GameActions;