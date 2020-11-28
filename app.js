const gameContainer = document.querySelector(".game_container");
const container = document.querySelector(".container");
const timer_data = document.querySelector(".timer");
let isGameOver = false;
const bombs = 20;
let flag = 0;
let remainingFlags = bombs;
const squares = [];
const width = 10;
const startingTime = 1;
let time = startingTime * 60;

const initialRemainingFlagDetails = () => {
  const flags = document.createElement("div");
  flags.classList.add("flags");
  flags.innerHTML = `Remaining Flags ⛳ : ${remainingFlags} `;
  container.appendChild(flags);
};

const createBoard = () => {
  const bombsArr = new Array(bombs).fill("bomb");
  const validArr = new Array(width * width - bombs).fill("valid");
  const sortedArr = validArr.concat(bombsArr).sort(() => Math.random() - 0.5);

  // remaining flags details
  initialRemainingFlagDetails();

  // timer details
  //   setInterval(() => {
  //     const minutes = Math.floor(time / 60);
  //     let seconds = time % 60;
  //     if (minutes == 0 && seconds == 0) clearInterval();
  //     seconds = seconds < startingTime ? "0" + seconds : seconds;
  //     timer_data.innerHTML = `${minutes}:${seconds}`;
  //     time--;
  //   }, 1000);

  // setup the board
  for (i = 0; i < width * width; i++) {
    const square = document.createElement("div");
    square.setAttribute("id", i);
    square.classList.add(sortedArr[i]);
    gameContainer.appendChild(square);
    squares.push(square);

    // normal click on each square
    square.addEventListener("click", () => {
      clicked(square);
    });

    // right click to add flag
    square.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      addFlag(square);
    });
  }

  // bomb check
  for (i = 0; i < squares.length; i++) {
    let total = 0;
    let isRightEnd = i % width === width - 1 ? true : false;
    let isLeftEnd = i % width === 0 ? true : false;
    // left elements
    if (i > 0 && !isLeftEnd && squares[i - 1].classList.contains("bomb"))
      total++;
    // right elements
    if (i < 99 && !isRightEnd && squares[i + 1].classList.contains("bomb"))
      total++;
    // top elements
    if (i > 9 && squares[i - width].classList.contains("bomb")) total++;
    // bottom elements
    if (i < 90 && squares[i + width].classList.contains("bomb")) total++;
    // north west elements
    if (
      i > 10 &&
      !isLeftEnd &&
      squares[i - (width + 1)].classList.contains("bomb")
    )
      total++;
    // north east elements
    if (
      i > 9 &&
      !isRightEnd &&
      squares[i - (width - 1)].classList.contains("bomb")
    )
      total++;
    // south west elements
    if (
      i < 90 &&
      !isLeftEnd &&
      squares[i + (width - 1)].classList.contains("bomb")
    )
      total++;
    // south east elements
    if (
      i < 89 &&
      !isRightEnd &&
      squares[i + (width + 1)].classList.contains("bomb")
    )
      total++;
    squares[i].setAttribute("total", total);
  }
};

createBoard();

// square is clicked
const clicked = (square) => {
  if (isGameOver) return;
  if (square.classList.contains("checked") || square.classList.contains("flag"))
    return;
  if (square.classList.contains("bomb")) {
    gameOver();
    return;
  } else {
    const total = square.getAttribute("total");
    if (total != 0) {
      square.innerHTML = total;
      square.classList.add("checked");
      return;
    }
    // fan out the squares if a square which is not surrounded by bombs
    clickedUnrelatedSquare(square);
  }
  square.classList.add("checked");
};

// fan out the squares if a square which is not surrounded by bombs
const clickedUnrelatedSquare = (square) => {
  let id = parseInt(square.id);
  let isLeftEnd = id % width === 0 ? true : false;
  let isRightEnd = id % width === width - 1 ? true : false;
  setTimeout(() => {
    //left elements
    if (id > 0 && !isLeftEnd) clicked(squares[id - 1]);
    //right elements
    if (id < 99 && !isRightEnd) clicked(squares[id + 1]);
    //top elements
    if (id > 9) clicked(squares[id - width]);
    //bottom elements
    if (id < 89) clicked(squares[id + width]);
    //north west elements
    if (id > 10 && !isLeftEnd) clicked(squares[id - (width + 1)]);
    //north east elements
    if (id > 9 && !isRightEnd) clicked(squares[id - (width - 1)]);
    //south west elements
    if (id < 90 && !isLeftEnd) clicked(squares[id + (width - 1)]);
    //south east elements
    if (id < 89 && !isRightEnd) clicked(squares[id + (width + 1)]);
  }, 100);
};

// game over
const gameOver = () => {
  squares.forEach((square) => {
    if (square.classList.contains("bomb")) {
      square.innerHTML = "💣";
    }
  });
  popupHandler("GAME OVER");
};

// place the flags
const addFlag = (square) => {
  if (isGameOver) return;
  if (!square.classList.contains("checked") && flag < bombs) {
    if (!square.classList.contains("flag")) {
      square.classList.add("flag");
      square.innerHTML = "⛳";
      flag++;
      remainingFlags--;
      document.querySelector(
        ".flags"
      ).innerHTML = `Remaining Flags ⛳ : ${remainingFlags} `;
      checkforWin();
    } else {
      square.classList.remove("flag");
      square.innerHTML = "";
      flag--;
      remainingFlags++;
      document.querySelector(
        ".flags"
      ).innerHTML = `Remaining Flags ⛳ : ${remainingFlags} `;
    }
  }
};

// check whether the user won!
const checkforWin = () => {
  let totalMatch = 0;
  for (i = 0; i < squares.length; i++) {
    if (
      squares[i].classList.contains("bomb") &&
      squares[i].classList.contains("flag")
    ) {
      totalMatch++;
    }
  }
  if (totalMatch === bombs) {
    popupHandler("YOU WON!!!");
  }
};

// gameover or win - popup handler
const popupHandler = (text) => {
  const popup_gameover = document.createElement("div");
  popup_gameover.classList.add("popup_gameover");
  popup_gameover.innerHTML = text;
  container.appendChild(popup_gameover);
  isGameOver = true;
};
