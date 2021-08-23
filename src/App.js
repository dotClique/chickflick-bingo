import React, { Component } from "react";
import BingoCell from "./components/BingoCell";
import Radio from "./components/Radio";
import logo from "./github.svg";
import heart from "./assets/heart.png";
import bingopile from "./bingo.json";
class App extends Component {
  constructor(props) {
    super(props);
    this.handleCellChange = this.handleCellChange.bind(this);
  }

  state = {
    text: [],
    chosen_cells: [],
    bingo_id: 0,
    bingo_rows: [],
    bingo_cols: [],
    bingo_diagonal_down: false,
    bingo_diagonal_up: false,
    is_bingo: false,
    showRules: false,
    confirmReset: false,
    bingo_type: "b",
  };

  componentDidMount() {
    if (!!localStorage.getItem("bingoState")) {
      this.setState(JSON.parse(localStorage.getItem("bingoState")));
    } else {
      this.generateBoard("m");
    }
  }

  componentDidUpdate() {
    localStorage.setItem("bingoState", JSON.stringify(this.state));
  }

  handleCellChange = (value) => {
    let cells = this.state.chosen_cells;
    cells[value % 4][Math.floor(value / 4)] =
      !cells[value % 4][Math.floor(value / 4)];
    let bingo_rows = this.state.bingo_rows;
    let bingo_cols = this.state.bingo_cols;
    let bingo_diagonal_down = this.state.bingo_diagonal_down;
    let bingo_diagonal_up = this.state.bingo_diagonal_up;
    let is_bingo = false;
    let is_full_bingo = cells.every(function (level2, i) {
      return level2.every(function (bool) {
        return bool;
      });
    });

    for (let i = 0; i < 4; i++) {
      if (!this.state.bingo_cols[i]) {
        let colBingo = true;
        for (let j = 0; j < 4; j++) {
          if (!cells[i][j]) {
            colBingo = false;
          }
        }
        if (colBingo) {
          bingo_cols[i] = true;
          is_bingo = true;
        }
      }
    }
    if (!bingo_diagonal_down) {
      let diagBingoDown = true;
      for (let i = 0; i < 4; i++) {
        if (!cells[i][i]) {
          diagBingoDown = false;
        }
      }
      if (diagBingoDown) {
        bingo_diagonal_down = true;
        is_bingo = true;
      }
    }
    if (!bingo_diagonal_up) {
      let diagBingoUp = true;
      for (let i = 0; i < 4; i++) {
        if (!cells[3 - i][i]) {
          diagBingoUp = false;
        }
      }
      if (diagBingoUp) {
        bingo_diagonal_up = true;
        is_bingo = true;
      }
    }
    for (let i = 0; i < 4; i++) {
      if (!this.state.bingo_rows[i]) {
        let rowBingo = true;
        for (let j = 0; j < 4; j++) {
          if (!cells[j][i]) {
            rowBingo = false;
          }
        }
        if (rowBingo) {
          bingo_rows[i] = true;
          is_bingo = true;
        }
      }
    }
    is_bingo = is_full_bingo ? false : is_bingo;
    const newState = {
      text: this.state.text,
      chosen_cells: cells,
      bingo_rows: bingo_rows,
      bingo_cols: bingo_cols,
      bingo_diagonal_down: bingo_diagonal_down,
      bingo_diagonal_up: bingo_diagonal_up,
      is_bingo: is_bingo,
      is_full_bingo: is_full_bingo,
      bingo_id: this.state.bingo_id,
      bingo_type: this.state.bingo_type,
    };
    this.setState(newState);
    localStorage.setItem("bingoState", JSON.stringify(newState));
  };

  generatePicks(bingopile) {
    const chickFlickOptions = bingopile.optionsChickFlick
    let picks = [];
    for (let i = 0; i < 16; i++) {
      let k = Math.floor(Math.random() * chickFlickOptions.length);
      while (picks.indexOf(chickFlickOptions[k]) > -1) {
        k = Math.floor(Math.random() * chickFlickOptions.length);
      }
      picks[i] = chickFlickOptions[k];
    }
    return picks;
  }

  generateBoard = () => {
    let pickedText = this.generatePicks(bingopile);
    let matrix = [];
    for (let i = 0; i < 4; i++) {
      matrix[i] = [];
      for (let j = 0; j < 4; j++) {
        matrix[i][j] = false;
      }
    }
    const initState = {
      text: pickedText,
      bingo_id: this.state.bingo_id + 16,
      chosen_cells: matrix,
      bingo_rows: [],
      bingo_cols: [],
      bingo_diagonal_down: false,
      bingo_diagonal_up: false,
      is_bingo: false,
      is_full_bingo: false,
      bingo_type: this.state.bingo_type,
    };
    localStorage.setItem("bingoState", JSON.stringify(initState));
    this.setState(initState);
  };

  compareRadioValue(value) {
    return this.state.bingo_type.valueOf() === value.valueOf();
  }

  render() {
    return (
      <div className="App">
        <div
          className={this.state.is_full_bingo ? "popup show" : "popup"}
          onClick={() => this.setState({ is_full_bingo: false })}
        >
          <div className="bingotextUpper">
            <img src={heart} alt="Flamme" />
            <img src={heart} alt="Flamme" />
            <img src={heart} alt="Flamme" />
          </div>
          <div className="bingotext">
            <span>Gratulerer, du har vunnet kvelden!</span>
          </div>
          <p>(Trykk for å lukke)</p>
        </div>
        <div
          className={this.state.is_bingo ? "popup show" : "popup"}
          onClick={() => this.setState({ is_bingo: false })}
        >
          <div className="bingotext">
            <img src={heart} alt="Flamme" />
            <span>Bingo!</span>
            <img src={heart} alt="Flamme" />
          </div>
          <p>(Trykk for å lukke)</p>
        </div>
        <div
          className={this.state.showRules ? "popup show" : "popup"}
          onClick={() => this.setState({ showRules: false })}
        >
          <div className="textWindow">
            <p>
              <b>Regler / hvordan spille</b>
            </p>
            <br />
            <p>
              1) Sett på en chickflick
            </p>
            <br />
            <p>
              2) Alle krysser av på sitt eget brett og drikker en slurk når det
              kommer situasjoner som matcher brettet.
            </p>
            <br />
            <p>
              3) Får du fire kryss på rad kan du dele ut fire slurker.
              (vertikalt, horisontalt og diagonalt)
            </p>
            <br />
            <p>
              4) Vinneren er den som får fyllt hele bingokortet (eller h*n som
              har flest når filmen er over)
            </p>

            <br />
            <p>
              <b>Alle skåler og drikker når</b>
            </p>
            <br />
            <p>1) Noen kysser</p>
            <br />
            <p>2) En til regel</p>
            <br />
            <p>3) Enda en regel</p>
            <br />
            <p>4) Og en regel til igjen</p>
          </div>
          <p>(Trykk for å lukke)</p>
        </div>

        <div className="App-header">
          <span className="logo">
            <img src={heart} alt="Abakus logo" />
            <span> ChickFlick Bingo</span>
          </span>
          <div className="newBoard">
            <button onClick={() => this.generateBoard()}>
              nytt brett
            </button>
          </div>
          <div className="rules">
            <button onClick={() => this.setState({ showRules: true })}>
              Regler
            </button>
          </div>
          <div className="github">
            <a href={"https://github.com/dotClique/chickflick-bingo"}>
              <img src={logo} alt="Github" />
            </a>
          </div>
        </div>
        <div className="bingoBoard">
          {this.state.text.map((item, key = 0) => {
            key++;
            return (
              <BingoCell
                key={this.state.bingo_id + key}
                id={key - 1}
                content={item}
                clicked={
                  this.state.chosen_cells[(key - 1) % 4][
                    Math.floor((key - 1) / 4)
                  ]
                }
                handleCellChange={this.handleCellChange}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default App;
