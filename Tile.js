import React from 'react';
import { StyleSheet, TouchableHighlight, View } from 'react-native';

export default class Tile extends React.Component {
  constructor(props) {
    super(props)
  }

  render () {
    let tile = this.props.tile
    let style = {}
    if (tile.value || (tile.valid && (this.props.player === this.props.selectedPlayer))) {
      let color = 'green'
      if (tile.value == 'white') {
        color = '#cccccc'
      } else {
        color = '#222222'
      }
      style = {
        backgroundColor: color,
        borderRadius: 25,
        height: '80%',
        width: '80%',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1
      }
      if (tile.valid) {
        style.backgroundColor = '#222222'
        style.opacity = '0.5'
        style.height = '50%'
        style.width = '50%'
      }
    }
    return (
      <TouchableHighlight style={styles.tile} onPress={() => {this.props.onTilePressed(tile.row, tile.col)}}>
        <View style={style}></View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: 'green',
    borderWidth: 1,
    borderColor: 'black',
    height: '12.5%',
    width: '12.5%',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
