import React from 'react';
import { Button, Dimensions, Picker, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import Tile from './Tile.js';
import _ from 'lodash';

const pageWidth = Dimensions.get('window').width
const pageHeight = Dimensions.get('window').height

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      difficulty: -1,
      gameOver: false,
      menu: true,
      opponent: '',
      player: '',
      selectedPlayer: 'black',
      skippedTurn: false,
      tiles: [],
    }
    this.onMenuPressed = this.onMenuPressed.bind(this)
    this.onTilePressed = this.onTilePressed.bind(this)
    this.onSelectPlayer = this.onSelectPlayer.bind(this)
    this.onStartPressed = this.onStartPressed.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.player != this.state.player) {
      this.setValidMoves()
      if (_.filter(this.state.tiles, { valid: true }).length == 0) {
        if (this.state.skippedTurn) {
          this.setState({ gameOver: true, skippedTurn: false })
        } else {
          let newPlayer = this.state.opponent
          this.setState({ player: newPlayer, opponent: this.state.player, skippedTurn: true })
        }
      } else {
        if (this.state.opponent === this.state.selectedPlayer) {
          setTimeout(() => {
            this.opponentMove()
          }, 600)
        }
        this.setState({ skippedTurn: false })
      }
    }
  }

  initializeGame() {
    let tiles = []
    for (let row = 1; row < 9; row++) {
      for (let col = 1; col < 9; col++) {
        let value = null
        let valid = null
        if ((col == 4 && row == 4) || (col == 5 && row == 5)) {
          value = 'white'
        }
        if ((col == 5 && row == 4) || (col == 4 && row == 5)) {
          value = 'black'
        }
        if ((col == 4 && row == 3) || (col == 3 && row == 4) || (col == 6 && row == 5) || (col == 5 && row == 6)) {
          valid = true
        }
        tiles.push({ row: row, col: col, score: 2, valid: valid, value: value })
      }
    }
    this.setTileScores(tiles)
    if (this.state.difficulty == -1) {
      _.map(tiles, (tile) => { tile.score * -1 })
    }
    this.setState({ gameOver: false, menu: false, opponent: 'white', player: 'black', skippedTurn: false, tiles })
  }

  setTileScores(tiles) {
    _.map([tiles[0], tiles[7], tiles[56], tiles[63]], (tile) => { tile.score = 10 })
    _.map([tiles[1], tiles[6], tiles[8], tiles[9], tiles[14], tiles[15], tiles[48], tiles[49], tiles[54], tiles[55], tiles[57], tiles[62]], (tile) => { tile.score = -5 })
    _.map([tiles[2], tiles[3], tiles[4], tiles[5], tiles[16], tiles[23], tiles[24], tiles[31], tiles[32], tiles[39], tiles[40], tiles[47], tiles[58], tiles[59], tiles[60], tiles[61]], (tile) => { tile.score = 5 })
    _.map([tiles[10], tiles[11], tiles[12], tiles[13], tiles[17], tiles[22], tiles[25], tiles[30], tiles[33], tiles[38], tiles[41], tiles[46], tiles[50], tiles[51], tiles[52], tiles[53]], (tile) => { tile.score = 0 })
  }

  setValidMoves() {
    let playerTiles = _.filter(this.state.tiles, { value: this.state.player })
    playerTiles.forEach(tile => {
      this.setValidUp(tile)
      this.setValidUpRight(tile)
      this.setValidRight(tile)
      this.setValidDownRight(tile)
      this.setValidDown(tile)
      this.setValidDownLeft(tile)
      this.setValidLeft(tile)
      this.setValidUpLeft(tile)
    })
  }

  setValidUp(tile) {
    let above = tile.row - 1
    if (above < 1) {
      return
    }
    let aboveTile = _.find(this.state.tiles, { row: above, col: tile.col })
    if (aboveTile.value != this.state.opponent) {
      return
    } else {
      for (above = aboveTile.row - 1; above > 0; above--) {
        aboveTile = _.find(this.state.tiles, { row: above, col: tile.col })
        if (aboveTile.value == this.state.player) {
          return
        } else if (aboveTile.value == null) {
          aboveTile.valid = true
          this.setState({ tiles: this.state.tiles })
          return
        }
      }
    }
    return
  }

  setValidUpRight(tile) {
    let above = tile.row - 1
    let right = tile.col + 1
    if (above < 1 || right > 8) {
      return
    }
    let aboveRightTile = _.find(this.state.tiles, { row: above, col: right })
    if (aboveRightTile.value != this.state.opponent) {
      return
    } else {
      above = aboveRightTile.row - 1
      right = aboveRightTile.col + 1
      while (above > 0 && right < 9) {
        aboveRightTile = _.find(this.state.tiles, { row: above, col: right })
        if (aboveRightTile.value == this.state.player) {
          return
        } else if (aboveRightTile.value == null) {
          aboveRightTile.valid = true
          this.setState({ tiles: this.state.tiles })
          return
        }
        above = above - 1
        right = right + 1
      }
    }
    return
  }

  setValidRight(tile) {
    let right = tile.col + 1
    if (right > 8) {
      return
    }
    let rightTile = _.find(this.state.tiles, { row: tile.row, col: right })
    if (rightTile.value != this.state.opponent) {
      return
    } else {
      for (right = rightTile.col + 1; right < 9; right++) {
        rightTile = _.find(this.state.tiles, { row: tile.row, col: right })
        if (rightTile.value == this.state.player) {
          return
        } else if (rightTile.value == null) {
          rightTile.valid = true
          this.setState({ tiles: this.state.tiles })
          return
        }
      }
    }
    return
  }

  setValidDownRight(tile) {
    let below = tile.row + 1
    let right = tile.col + 1
    if (below > 8 || right > 8) {
      return
    }
    let downRightTile = _.find(this.state.tiles, { row: below, col: right })
    if (downRightTile.value != this.state.opponent) {
      return
    } else {
      below = downRightTile.row + 1
      right = downRightTile.col + 1
      while (below < 9 && right < 9) {
        downRightTile = _.find(this.state.tiles, { row: below, col: right })
        if (downRightTile.value == this.state.player) {
          return
        } else if (downRightTile.value == null) {
          downRightTile.valid = true
          this.setState({ tiles: this.state.tiles })
          return
        }
        below = below + 1
        right = right + 1
      }
    }
    return
  }

  setValidDown(tile) {
    let below = tile.row + 1
    if (below > 8) {
      return
    }
    let belowTile = _.find(this.state.tiles, { row: below, col: tile.col })
    if (belowTile.value != this.state.opponent) {
      return
    } else {
      for (below = belowTile.row + 1; below < 9; below++) {
        belowTile = _.find(this.state.tiles, { row: below, col: tile.col })
        if (belowTile.value == this.state.player) {
          return
        } else if (belowTile.value == null) {
          belowTile.valid = true
          this.setState({ tiles: this.state.tiles })
          return
        }
      }
    }
    return
  }

  setValidDownLeft(tile) {
    let below = tile.row + 1
    let left = tile.col - 1
    if (below > 8 || left < 1) {
      return
    }
    let downLeftTile = _.find(this.state.tiles, { row: below, col: left })
    if (downLeftTile.value != this.state.opponent) {
      return
    } else {
      below = downLeftTile.row + 1
      left = downLeftTile.col - 1
      while (below < 9 && left > 0) {
        downLeftTile = _.find(this.state.tiles, { row: below, col: left })
        if (downLeftTile.value == this.state.player) {
          return
        } else if (downLeftTile.value == null) {
          downLeftTile.valid = true
          this.setState({ tiles: this.state.tiles })
          return
        }
        below = below + 1
        left = left - 1
      }
    }
    return
  }

  setValidLeft(tile) {
    let left = tile.col - 1
    if (left < 1) {
      return
    }
    let leftTile = _.find(this.state.tiles, { row: tile.row, col: left })
    if (leftTile.value != this.state.opponent) {
      return
    } else {
      for (left = leftTile.col - 1; left > 0; left--) {
        leftTile = _.find(this.state.tiles, { row: tile.row, col: left })
        if (leftTile.value == this.state.player) {
          return
        } else if (leftTile.value == null) {
          leftTile.valid = true
          this.setState({ tiles: this.state.tiles })
          return
        }
      }
    }
    return
  }

  setValidUpLeft(tile) {
    let above = tile.row - 1
    let left = tile.col - 1
    if (above < 1 || left < 1) {
      return
    }
    let upLeftTile = _.find(this.state.tiles, { row: above, col: left })
    if (upLeftTile.value != this.state.opponent) {
      return
    } else {
      above = upLeftTile.row - 1
      left = upLeftTile.col - 1
      while (above > 0 && left > 0) {
        upLeftTile = _.find(this.state.tiles, { row: above, col: left })
        if (upLeftTile.value == this.state.player) {
          return
        } else if (upLeftTile.value == null) {
          upLeftTile.valid = true
          this.setState({ tiles: this.state.tiles })
          return
        }
        above = above - 1
        left = left - 1
      }
    }
    return
  }

  handleTileChanges(tile) {
    this.handleUpChanges(tile)
    this.handleUpRightChanges(tile)
    this.handleRightChanges(tile)
    this.handleDownRightChanges(tile)
    this.handleDownChanges(tile)
    this.handleDownLeftChanges(tile)
    this.handleLeftChanges(tile)
    this.handleUpLeftChanges(tile)
    let newPlayer = this.state.opponent
    _.map(this.state.tiles, (t) => { t.valid = false })
    this.setState({ opponent: this.state.player, player: newPlayer, tiles: this.state.tiles  })
  }

  handleUpChanges(tile) {
    let tiles = []
    let above = tile.row - 1
    for (above; above > 0; above--) {
      aboveTile = _.find(this.state.tiles, { row: above, col: tile.col })
      if (aboveTile.value == this.state.opponent) {
        aboveTile.value = this.state.player
        tiles.push(aboveTile)
      } else if (aboveTile.value == this.state.player) {
        above = -1 //stop looping
      } else {
        _.map(tiles, (t) => { t.value = this.state.opponent })
        return //found a blank space before player piece so return without flipping tiles
      }
    }
    if (above == 0) {
      _.map(tiles, (t) => { t.value = this.state.opponent })
    }
  }

  handleUpRightChanges(tile) {
    let tiles = []
    let above = tile.row - 1
    let right = tile.col + 1
    while (above > 0 && right < 9) {
      aboveRightTile = _.find(this.state.tiles, { row: above, col: right })
      if (aboveRightTile.value == this.state.opponent) {
        aboveRightTile.value = this.state.player
        tiles.push(aboveRightTile)
        above = above - 1
        right = right + 1
      } else if (aboveRightTile.value == this.state.player) {
        above = -1 //stop looping
      } else {
        _.map(tiles, (t) => { t.value = this.state.opponent })
        return //found a blank space before player piece so return without flipping tiles
      }
    }
    if (above == 0 || right == 9) {
      _.map(tiles, (t) => { t.value = this.state.opponent })
    }
  }

  handleRightChanges(tile) {
    let tiles = []
    let right = tile.col + 1
    for (right; right < 9; right++) {
      rightTile = _.find(this.state.tiles, { row: tile.row, col: right })
      if (rightTile.value == this.state.opponent) {
        rightTile.value = this.state.player
        tiles.push(rightTile)
      } else if (rightTile.value == this.state.player) {
        right = 10 //stop looping
      } else {
        _.map(tiles, (t) => { t.value = this.state.opponent })
        return //found a blank space before player piece so return without flipping tiles
      }
    }
    if (right == 9) {
      _.map(tiles, (t) => { t.value = this.state.opponent })
    }
  }

  handleDownRightChanges(tile) {
    let tiles = []
    let below = tile.row + 1
    let right = tile.col + 1
    while (below < 9 && right < 9) {
      belowRightTile = _.find(this.state.tiles, { row: below, col: right })
      if (belowRightTile.value == this.state.opponent) {
        belowRightTile.value = this.state.player
        tiles.push(belowRightTile)
        below = below + 1
        right = right + 1
      } else if (belowRightTile.value == this.state.player) {
        below = 10 //stop looping
      } else {
        _.map(tiles, (t) => { t.value = this.state.opponent })
        return //found a blank space before player piece so return without flipping tiles
      }
    }
    if (below == 9 || right == 9) {
      _.map(tiles, (t) => { t.value = this.state.opponent })
    }
  }

  handleDownChanges(tile) {
    let tiles = []
    let below = tile.row + 1
    for (below; below < 9; below++) {
      belowTile = _.find(this.state.tiles, { row: below, col: tile.col })
      if (belowTile.value == this.state.opponent) {
        belowTile.value = this.state.player
        tiles.push(belowTile)
      } else if (belowTile.value == this.state.player) {
        below = 10 //stop looping
      } else {
        _.map(tiles, (t) => { t.value = this.state.opponent })
        return //found a blank space before player piece so return without flipping tiles
      }
    }
    if (below == 9) {
      _.map(tiles, (t) => { t.value = this.state.opponent })
    }
  }

  handleDownLeftChanges(tile) {
    let tiles = []
    let below = tile.row + 1
    let left = tile.col - 1
    while (below < 9 && left > 0) {
      belowLeftTile = _.find(this.state.tiles, { row: below, col: left })
      if (belowLeftTile.value == this.state.opponent) {
        belowLeftTile.value = this.state.player
        tiles.push(belowLeftTile)
        below = below + 1
        left = left - 1
      } else if (belowLeftTile.value == this.state.player) {
        below = 10 //stop looping
      } else {
        _.map(tiles, (t) => { t.value = this.state.opponent })
        return //found a blank space before player piece so return without flipping tiles
      }
    }
    if (below == 9 || left == 0) {
      _.map(tiles, (t) => { t.value = this.state.opponent })
    }
  }

  handleLeftChanges(tile) {
    let tiles = []
    let left = tile.col - 1
    for (left; left > 0; left--) {
      leftTile = _.find(this.state.tiles, { row: tile.row, col: left })
      if (leftTile.value == this.state.opponent) {
        leftTile.value = this.state.player
        tiles.push(leftTile)
      } else if (leftTile.value == this.state.player) {
        left = -1 //stop looping
      } else {
        _.map(tiles, (t) => { t.value = this.state.opponent })
        return //found a blank space before player piece so return without flipping tiles
      }
    }
    if (left == 0) {
      _.map(tiles, (t) => { t.value = this.state.opponent })
    }
  }

  handleUpLeftChanges(tile) {
    let tiles = []
    let above = tile.row - 1
    let left = tile.col - 1
    while (above > 0 && left > 0) {
      aboveLeftTile = _.find(this.state.tiles, { row: above, col: left })
      if (aboveLeftTile.value == this.state.opponent) {
        aboveLeftTile.value = this.state.player
        tiles.push(aboveLeftTile)
        above = above - 1
        left = left - 1
      } else if (aboveLeftTile.value == this.state.player) {
        above = -1 //stop looping
      } else {
        _.map(tiles, (t) => { t.value = this.state.opponent })
        return //found a blank space before player piece so return without flipping tiles
      }
    }
    if (above == 0 || left == 0) {
      _.map(tiles, (t) => { t.value = this.state.opponent })
    }
  }

  upTiles(tile) {
    let tiles = []
    let above = tile.row - 1
    for (above; above > 0; above--) {
      aboveTile = _.find(this.state.tiles, { row: above, col: tile.col })
      if (aboveTile.value == this.state.opponent) {
        tiles.push(aboveTile)
      } else if (aboveTile.value == this.state.player) {
        above = -1 //stop looping
      } else {
        return [] //found a blank space before player piece so return without flipping tiles
      }
    }
    if (above == 0) {
      return []
    }
    return tiles
  }

  upRightTiles(tile) {
    let tiles = []
    let above = tile.row - 1
    let right = tile.col + 1
    while (above > 0 && right < 9) {
      aboveRightTile = _.find(this.state.tiles, { row: above, col: right })
      if (aboveRightTile.value == this.state.opponent) {
        tiles.push(aboveRightTile)
        above = above - 1
        right = right + 1
      } else if (aboveRightTile.value == this.state.player) {
        above = -1 //stop looping
      } else {
        return [] //found a blank space before player piece so return without flipping tiles
      }
    }
    if (above == 0 || right == 9) {
      return []
    }
    return tiles
  }

  rightTiles(tile) {
    let tiles = []
    let right = tile.col + 1
    for (right; right < 9; right++) {
      rightTile = _.find(this.state.tiles, { row: tile.row, col: right })
      if (rightTile.value == this.state.opponent) {
        tiles.push(rightTile)
      } else if (rightTile.value == this.state.player) {
        right = 10 //stop looping
      } else {
        return [] //found a blank space before player piece so return without flipping tiles
      }
    }
    if (right == 9) {
      return []
    }
    return tiles
  }

  downRightTiles(tile) {
    let tiles = []
    let below = tile.row + 1
    let right = tile.col + 1
    while (below < 9 && right < 9) {
      belowRightTile = _.find(this.state.tiles, { row: below, col: right })
      if (belowRightTile.value == this.state.opponent) {
        tiles.push(belowRightTile)
        below = below + 1
        right = right + 1
      } else if (belowRightTile.value == this.state.player) {
        below = 10 //stop looping
      } else {
        return [] //found a blank space before player piece so return without flipping tiles
      }
    }
    if (below == 9 || right == 9) {
      return []
    }
    return tiles
  }

  downTiles(tile) {
    let tiles = []
    let below = tile.row + 1
    for (below; below < 9; below++) {
      belowTile = _.find(this.state.tiles, { row: below, col: tile.col })
      if (belowTile.value == this.state.opponent) {
        tiles.push(belowTile)
      } else if (belowTile.value == this.state.player) {
        below = 10 //stop looping
      } else {
        return [] //found a blank space before player piece so return without flipping tiles
      }
    }
    if (below == 9) {
      return []
    }
    return tiles
  }

  downLeftTiles(tile) {
    let tiles = []
    let below = tile.row + 1
    let left = tile.col - 1
    while (below < 9 && left > 0) {
      belowLeftTile = _.find(this.state.tiles, { row: below, col: left })
      if (belowLeftTile.value == this.state.opponent) {
        tiles.push(belowLeftTile)
        below = below + 1
        left = left - 1
      } else if (belowLeftTile.value == this.state.player) {
        below = 10 //stop looping
      } else {
        return [] //found a blank space before player piece so return without flipping tiles
      }
    }
    if (below == 9 || left == 0) {
      return []
    }
    return tiles
  }

  leftTiles(tile) {
    let tiles = []
    let left = tile.col - 1
    for (left; left > 0; left--) {
      leftTile = _.find(this.state.tiles, { row: tile.row, col: left })
      if (leftTile.value == this.state.opponent) {
        tiles.push(leftTile)
      } else if (leftTile.value == this.state.player) {
        left = -1 //stop looping
      } else {
        return [] //found a blank space before player piece so return without flipping tiles
      }
    }
    if (left == 0) {
      return []
    }
    return tiles
  }

  upLeftTiles(tile) {
    let tiles = []
    let above = tile.row - 1
    let left = tile.col - 1
    while (above > 0 && left > 0) {
      aboveLeftTile = _.find(this.state.tiles, { row: above, col: left })
      if (aboveLeftTile.value == this.state.opponent) {
        tiles.push(aboveLeftTile)
        above = above - 1
        left = left - 1
      } else if (aboveLeftTile.value == this.state.player) {
        above = -1 //stop looping
      } else {
        return [] //found a blank space before player piece so return without flipping tiles
      }
    }
    if (above == 0 || left == 0) {
      return []
    }
    return tiles
  }

  findBestMove(validMoves, addScore) {
    let bestMove = 0
    let bestCount = 0
    for (let i = 0; i < validMoves.length; i++) {
      let total = 0
      total = total + this.upTiles(validMoves[i]).length
      total = total + this.upRightTiles(validMoves[i]).length
      total = total + this.rightTiles(validMoves[i]).length
      total = total + this.downRightTiles(validMoves[i]).length
      total = total + this.downTiles(validMoves[i]).length
      total = total + this.downLeftTiles(validMoves[i]).length
      total = total + this.leftTiles(validMoves[i]).length
      total = total + this.upLeftTiles(validMoves[i]).length
      if (addScore) {
        total = total + validMoves[i].score
      }
      if (total > bestCount) {
        bestCount = total
        bestMove = i
      } else if (total == bestCount) {
        if (_.random(0, 1) == 1) {
          bestMove = i
        }
      }
    }
    return bestMove
  }

  opponentMove () {
    let validMoves = _.filter(this.state.tiles, { valid: true })
    let index = 0
    if (this.state.difficulty == 0) {
      index = _.random(0, validMoves.length - 1)
    }
    if (this.state.difficulty == 1) {
      index = this.findBestMove(validMoves, false)
    }
    if (this.state.difficulty == 2) {
      index = this.findBestMove(validMoves, true)
    }
    this.onTilePressed(validMoves[index].row, validMoves[index].col)
  }

  onMenuPressed() {
    this.setState({ menu: true })
  }

  onTilePressed(row, col) {
    let tile = _.find(this.state.tiles, { row: row, col: col })
    if (!tile.valid) {
      return
    } else {
      tile.value = this.state.player
      this.setState({ tiles: this.state.tiles })
      this.handleTileChanges(tile)
    }
  }

  onStartPressed() {
    this.initializeGame()
  }

  onSelectPlayer(color) {
    this.setState({ selectedPlayer: color })
  }

  renderTiles() {
    return _.map(this.state.tiles, (tile) => {
      return (
        <Tile
          key={tile.row * 10 + tile.col}
          player={this.state.player}
          selectedPlayer={this.state.selectedPlayer}
          tile={tile}
          onTilePressed={this.onTilePressed}
        />
      )
    })
  }

  renderWinner() {
    let whiteScore = _.filter(this.state.tiles, { value: 'white' }).length
    let blackScore = _.filter(this.state.tiles, { value: 'black'}).length
    let winnerText = whiteScore > blackScore ? 'White Wins!' : 'Black Wins!'
    return (
      <View>
        <Text style={{textAlign: 'center', fontSize: 24 }}>{winnerText}</Text>
        <TouchableOpacity style={{backgroundColor: 'purple', justifyContent: 'center', height: 60}} onPress={this.onMenuPressed}>
          <Text style={styles.buttonText}>Menu</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderGameBoard() {
    if (this.state.gameOver) {
      return (
        this.renderWinner()
      )
    }
    if (!_.isEmpty(this.state.tiles)) {
      return (
        <View style={styles.gameBoard}>
          {this.renderTiles()}
        </View>
      )
    }
    return (
      <View></View>
    )
  }

  renderGame() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.text}>White: {_.filter(this.state.tiles, { value: 'white' }).length}</Text>
          <Text style={styles.text}>Black: {_.filter(this.state.tiles, { value: 'black'}).length}</Text>
        </View>
        {this.renderGameBoard()}     
        <View style={styles.footer}>
          <TouchableOpacity style={styles.button} onPress={this.onStartPressed}>
            <Text style={styles.buttonText}>New Game</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderMenu() {
    return (
      <View style={styles.menuContainer}>
        <View style={styles.header}>
          <Text style={styles.gameTitle}>Othello</Text>
        </View>
        <View style={styles.menu}>
          <View style={styles.menuItem}>
            <Text style={styles.menuText}>Difficulty</Text>
            <Picker
              style={styles.picker}
              selectedValue={this.state.difficulty}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({difficulty: itemValue})
              }>
              <Picker.Item label="Very Easy" value="-1" />
              <Picker.Item label="Easy" value="0" />
              <Picker.Item label="Normal" value="1" />
              <Picker.Item label="Hard" value="2" />
            </Picker>
          </View>
          <View style={styles.menuItem}>
            <Text style={styles.menuText}>Player Color</Text>
            <View style={styles.playerSelect}>
              <TouchableHighlight style={styles.playerSelect} onPress={() => {this.onSelectPlayer('black')}}>
                <View style={[styles.tile, styles.black, this.state.selectedPlayer === 'black' && styles.selectedPlayer]}></View>
              </TouchableHighlight>
              <TouchableHighlight style={styles.playerSelect} onPress={() => {this.onSelectPlayer('white')}}>
                <View style={[styles.tile, styles.white, this.state.selectedPlayer === 'white' && styles.selectedPlayer]}></View>
              </TouchableHighlight>
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.button} onPress={this.onStartPressed}>
            <Text style={styles.buttonText}>Start Game</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    if (this.state.menu) {
      return this.renderMenu()
    } else {
      return this.renderGame()
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 3,
    backgroundColor: '#ccddee',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gameBoard: {
    borderWidth: 10,
    borderColor: '#888888',
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: pageWidth - 20,
    width: pageWidth - 20,
  },
  header: {
    flexDirection: 'row',
    height: (pageHeight - pageWidth - 20) / 2,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    justifyContent: 'flex-end',
    width: '100%',
  },
  text: {
    width: '50%',
    textAlign: 'center',
    fontSize: 24,
  },
  menuContainer: {
    flex: 3,
    backgroundColor: '#ccddee',
    justifyContent: 'space-between',
  },
  menu: {
    flex: 2,
    justifyContent: 'space-around',
    width: '100%',
  },
  menuText: {
    fontSize: 30,
    textAlign: 'center',
  },
  menuItem: {
    width: '100%',
  },
  gameTitle: {
    fontSize: 60,
    fontWeight: 'bold',
    color: 'green',
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'green',
    justifyContent: 'center',
    height: 80,
  },
  buttonText: {
    fontSize: 30,
    color: '#fff',
    textAlign: 'center',
  },
  picker: {
    width: '100%',
    height: 50,
  },
  playerSelect: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tile: {
    marginTop: 10,
    borderRadius: 50,
    height: 60,
    width: 60,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  black: {
    backgroundColor: '#222222',
  },
  white: {
    backgroundColor: '#cccccc',
  },
  selectedPlayer: {
    borderWidth: 1,
    borderColor: 'red',
  }
});
