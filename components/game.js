import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions
} from 'react-native';
import GameStore from '../stores/game';
import GameActions from '../actions/game';
import Categories from './categories';
import Sound from 'react-native-sound';

const width = Dimensions.get('window').width;

export default class Game extends Component {
  constructor() {
    super();
    this.handlePress = this.handlePress.bind(this);
    this.onStatusChange = this.onStatusChange.bind(this);
    this.handleSwitchCategory = this.handleSwitchCategory.bind(this);
    this.buzz = new Sound('Air Horn-SoundBible.com-964603082.mp3', Sound.MAIN_BUNDLE, (err) => {
        if (err) {
          return;
        }
      });
  }

  onStatusChange(status) {
    if (status.category) {
      this.setState({ category: status.category });
    }
    if (status.phrase) {
      this.setState({ phrase: status.phrase });
    }
    if (status.end) {
      this.setState({ category: null, phrase: null });
    }
    if (status.buzz) {
      this.setState({ timeup: true });
      this.buzz.play((success) => {
        if (!success) {
          this.setState({ buzzerError: true });
          return;
      }
      this.setState({ buzzerError: null });
     });
    }
    if (status.timeup === false) {
      this.setState({ timeup: false });
    }
  }

  componentDidMount() {
    this.unsubscribe = GameStore.listen(this.onStatusChange);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  renderCategory() {
    return (
      <View>
        <Text style={styles.categoryHeader}>Current Category: {this.state.category}</Text>
        <Button title="Switch Category" onPress={this.handleSwitchCategory}></Button>
      </View>
    );
  }

  renderPhrase() {
    return(<Text style={styles.phrase}>{this.state.phrase}</Text>);
  }

  handlePress() {
    GameActions.next(this.state.timeup);
  }

  handleSwitchCategory() {
    this.setState({ category: null, phrase: null });
    GameActions.clearBuzzer();
  }

  renderButton() {
    const label = this.state.phrase && this.state.phrase !== undefined ? 'Next' : 'Start';
    return(<Text title={label} onPress={this.handlePress} style={styles.next}>{label}</Text>);
  }

  renderTimeup() {
    return (<Text style={styles.timeup}>TIME UP</Text>);
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
        {this.state && this.state.category ? this.renderCategory() : <Categories />}
        </View>
        <View style={styles.game}>
          <View>
          {this.state && this.state.phrase ? this.renderPhrase() : null}
          </View>
          <View>
          {this.state && this.state.category ? this.renderButton() : null}
          </View>
          <View>
          {this.state && this.state.timeup ? this.renderTimeup() : null}
          </View>
          {this.state && this.state.buzzerError ? <Text>Buzzer error</Text> : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
  },
  game: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryHeader: {
    backgroundColor: '#111',
    width: width,
    padding: 5,
    color: '#eee',
    fontSize: 20,
    textAlign: 'center',
  },
  phrase: {
    fontSize: 60,
    textAlign: 'center',
  },
  next: {
    width: width,
    fontSize: 40,
    backgroundColor: '#4d4',
    color: '#eee',
    textAlign: 'center',
    padding: 30,
  },
  nextContainer: {
    backgroundColor: '#ccc',
    height: 100,
  },
  timeup: {
    textAlign: 'center',
    fontSize: 40,
    backgroundColor: '#e33',
    color: '#eee',
    width: width,
    padding: 20,
  }
});

AppRegistry.registerComponent('Game', () => Game);
