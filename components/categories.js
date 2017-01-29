import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Dimensions
} from 'react-native';
import GameStore from '../stores/game';
import GameActions from '../actions/game';

const width = Dimensions.get('window').width;


export default class Categories extends Component {
  constructor() {
    super();
    this.onStatusChange = this.onStatusChange.bind(this);
  }

  onStatusChange(status) {
    if (status.categories) {
      this.setState({ categories: status.categories });
    }
  }

  componentDidMount() {
    this.unsubscribe = GameStore.listen(this.onStatusChange);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  componentWillMount() {
    GameActions.getCategories()
  }

  handlePress(category) {
    GameActions.setCategory(category);
  }

  renderCategories() {
    let categories = [];
    for (const i in this.state.categories) {
      categories.push(
        <TouchableHighlight onPress={this.handlePress.bind(this, this.state.categories[i])} key={'categories-' + i}>
          <Text style={styles.categories}>{this.state.categories[i]}</Text>
        </TouchableHighlight>);
    }
    return (<View>{categories}</View>);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Choose a Category:</Text>
         {this.state && this.state.categories ? this.renderCategories() : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#eee',
    backgroundColor: '#000',
    width: width,
    padding: 5,
  },
  categories: {
    fontSize: 30,
    padding: 10,
    backgroundColor: '#ddd',
    width: width,
    textAlign: 'center',
    marginTop: 5,
  },
});

AppRegistry.registerComponent('Categories', () => Categories);
