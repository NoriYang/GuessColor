const levelTitleData = ['橙', '咖', '紅', '黃', '綠', '灰', '紫', '藍'];
const levelColorData = [
  'orange', 
  '#805300', // 咖啡
  'red', 
  '#E6E600',  // 黃
  'green', 
  'gray', 
  'purple', 
  'blue'
];
function Card(title, color) {
  this.cardTitle = title || '黑';
  this.cardColor = color || 'black';
};
Card.prototype.updateLevel = function () {
  let titleDOM = document.querySelector('.card-title');
  titleDOM.innerHTML = this.cardTitle;
  titleDOM.style.color = this.cardColor;
}
Card.prototype.updateCard = function (title='黑', color='red') {
  this.cardTitle = title;
  this.cardColor = color;
  this.updateLevel();
};
function Game(titleData, colorData) {
  this.titleData = titleData;
  this.colorData = colorData;
  this.currentLevel = 1;  // 目前關卡
  this.initTime = 10000; // 基本時間 
  this.time = 10000; // 總時間
  this.perLevelBonus = 2; // 每幾關會有獎勵時間
  this.bonusTime = 2000; // 獎勵時間
  this.card = new Card();
  this.timer = null;
  this.setLevel();
  this.selectAudio = document.querySelector('.select-audio');
  this.coin = document.querySelector('.coin-audio');
  this.poka = document.querySelector('.poka-audio');
  this.changeVolume();
};
// 遊戲初始化
Game.prototype.initGame = function() {
  this.currentLevel = 1;
  this.time = this.initTime;
  this.updateTime();
};
// 開始遊戲
Game.prototype.startGame = function () {
  this.startTime();
  this.updateLevelTitle();
};
// 關閉首頁
Game.prototype.closeIndex = function() {
  const indexPage = document.querySelector('.index')
  const infoDOM = document.querySelector('.info');
  const countDownDOM = document.querySelector('.countdown');
  const countDownNumber = document.querySelector('.countdown-number')
  infoDOM.classList.add('close');
  countDownDOM.classList.remove('close');
  this.selectAudio.currentTime = 0;
  this.selectAudio.play();
  let time = 3;
  countDownNumber.innerText = time;
  let timerClose = setInterval(()=>{
    if(time > 0) {
      time -= 1;
      countDownNumber.innerText = time;
      if(time == 0) {
        countDownNumber.innerText = 'START';
      }
    } else {
      indexPage.classList.add('close');
      countDownDOM.classList.add('close');
      infoDOM.classList.remove('close');
      clearInterval(timerClose);
      this.startGame();
    }
  }, 1000)
};
// 開啟首頁
Game.prototype.backToIndex = function() {
  const indexDOM = document.querySelector('.index');
  indexDOM.classList.remove('close');
};
// 開始計時
Game.prototype.startTime = function(){
  this.timer = setInterval(()=>{
    if(this.time != 0) {
      this.time -= 1000;
      this.updateTime();
    } else {
      this.updateTime();
      this.gameOver();
    }
  }, 1000)
};
// 更新時間
Game.prototype.updateTime = function() {
  const timeDOM = document.querySelector('.time-text');
  if(this.time >= 0) {
    timeDOM.innerText = this.time / 1000;
    this.updateTimeBar();
  } else {
    this.gameOver();
  }
};
// 更新 time bar
Game.prototype.updateTimeBar = function(){
  const timeBarDOM = document.querySelector('.time-bar');
  let time = this.time / 100;
  if(time >= 0) timeBarDOM.style.width = `${time}%`;
};
// 輸入答案
Game.prototype.answer = function (playerAnswer) {
  const levelAnswer = this.card.cardColor;
  if(this.time <= 0) {
    this.gameOver();
  }
  // 答對
  if (playerAnswer == levelAnswer) { 
    // 時間獎勵 最多10秒
    if(this.currentLevel % this.perLevelBonus == 0 && this.time < this.initTime) {
      this.time += 1000;
      this.updateTime();
    }
    this.coin.currentTime = 0;
    this.coin.play();
    this.setLevel();
    this.cardBorderStatus('good');
    this.currentLevel += 1;
    this.updateLevelTitle();
  // 答錯 
  } else { 
    this.poka.currentTime = 0;
    this.poka.play();
    this.cardBorderStatus('bad');
    this.time -= 1000;
    this.updateTime();
  }
};
// 產生新關卡
Game.prototype.setLevel = function () {
  let length = this.titleData.length;
  let randomTitle = Math.floor((Math.random() * length));
  let randomColor = Math.floor((Math.random() * length));
  this.card.updateCard(this.titleData[randomTitle], this.colorData[randomColor])
};
// 更新關卡 title
Game.prototype.updateLevelTitle = function(){
  const levelTitle = document.querySelector('.level-number');
  levelTitle.innerText = this.currentLevel;
};
Game.prototype.cardBorderStatus = function(status) {
  const card = document.querySelector('.card');
  status === 'good' ? card.classList.add('good') : card.classList.add('bad');
  setTimeout(()=>{
    card.classList.remove('good');
    card.classList.remove('bad');
  }, 100)
};
// 結束頁面
Game.prototype.toggleGameOverPage = function(status) {
  const gameOverDOM = document.querySelector('.game-over-page');
  const levelText = document.querySelector('.level-text');
  levelText.innerText = this.currentLevel;
  if(status === 'GameOver') 
    gameOverDOM.classList.remove('close');
  else if(status === 'restart') {
    this.selectAudio.currentTime = 0;
    this.selectAudio.play();
    gameOverDOM.classList.add('close');
    this.backToIndex();
    this.initGame();
  }
};
// 遊戲結束
Game.prototype.gameOver = function (){
  clearInterval(this.timer);
  this.toggleGameOverPage('GameOver')
};
Game.prototype.changeVolume = function(value = 0.5){
  this.selectAudio.volume = value;
  this.coin.volume = value;
  this.poka.volume = value;
};
// 遊戲說明 / 回首頁
Game.prototype.closePage = function(pageName) {
  const infoDOM = document.querySelector('.info');
  const describe = document.querySelector('.describe')
  this.selectAudio.currentTime = 0;
  this.selectAudio.play();
  if(pageName === 'info') {
    infoDOM.classList.add('close');
    describe.classList.remove('close');
  } else if (pageName === 'describe') {
    describe.classList.add('close');
    infoDOM.classList.remove('close');
  }
}

const game = new Game(levelTitleData, levelColorData);

