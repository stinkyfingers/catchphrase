import Reflux from 'reflux';
import GameActions from '../actions/game';
import Phrases from '../library/phrases';
import Store from 'react-native-store';

const API = "https://catchphraseapi.herokuapp.com";

const DB = {
	'categories': Store.model('categories'),
}

var GameStore = Reflux.createStore({
	listenables: [GameActions],
	phrases: {},
	phrase: '',
	timeoutID: null,
	categories: [],

	next: function(timeup) {
		// end
		if (this.phrases.length === 0) {
			this.phrase = null;
			this.trigger({ end: true });
			this.getCategories();
			return;
		}
		// timer
		if (!this.phrase || timeup) {
			const min = 20000;
			const max = 45000;
			const timeout = Math.ceil((Math.random() * (max - min)) + min);

			this.timeoutID = window.setTimeout(() => {
				this.buzzer();
			}, timeout)
		}

		// next
		const index = Math.floor(Math.random() * this.phrases.length);
		const phrase = this.phrases[index];
		this.phrases.splice(index, 1);
		this.phrase = phrase
		this.trigger({ phrase: phrase, phrases: this.phrases, timeup: false });
	},

	setCategory: function(category) {
		for (const i in this.categories) {
			if (this.categories[i].name === category) {
				phrases = this.categories[i].phrases;
				break;
			}
		}
		this.phrases = phrases;
		this.trigger({ category: category, phrases: phrases });
	},

	buzzer: function() {
		this.trigger({ buzz: true });
	},

	clearBuzzer: function() {
		this.phrase = null;
		window.clearTimeout(this.timeoutID);
	},

	getCategories: function() {
		fetch(API + "/all", {
			method: 'GET'
		}).then((resp) => {
			if (resp.status !== 200) {
				DB.categories.find().then((data) => {
					this.divvyCategories(data[0].categories);
					return;
				}).catch((err) => {
					this.trigger({ error: "error getting all categories"});
					return;
				})
				this.trigger({ error: "error getting all categories"});
				return;
			}
			return resp.json();
		}).then((resp) => {
			this.divvyCategories(resp);
		}).catch((err) => {
			console.log(err);
			this.trigger({ error: "error getting all categories"});
			return;
		});
	},

	divvyCategories: function(cats) {
		if (!cats) {
			return;
		}
		this.categories = cats;
		let categories = [];
		for (const i in this.categories) {
			categories.push(this.categories[i].name);
		}
		this.clearBuzzer();
		this.trigger({ categories: categories, timeup: false });
		DB.categories.destroy().then(() => {
			DB.categories.add({categories: this.categories}).catch((err) => {
				this.trigger({ error: "error saving all categories"});
				return;
			})
		}).catch((err) => {
			this.trigger({ error: "error getting all categories"});
			return;
		});
	}
});

export default GameStore;