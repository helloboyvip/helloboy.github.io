
//I'm aware that it's trivial to cheat at this game with the element inspector.
let code = [];

const possibleColors = ["#FF0000","#00FF00","#0000FF","#00FFFF"]

const pins = [];
const hintpins = [];
const checkbtns = [];
let currentRow = -1;
let currentCode;

/**
 * Create a pin for the user to enter a code value
 * @param {Number} pos the location of the pin (0-3), used for inserting the code
 * @returns The created pin object. Insert it into the document to see it.
 */
function createPin(pos){
    const pin = document.createElement('button');
    pin.className = "colorpin";
    //pin.disabled = true;
    pin.onclick = () => {pinEnter(pin,pos)}
    return pin;
}

/**
 * Called when a pin is clicked
 * @param {HTMLButtonElement} sender the pin that was clicked
 * @param {number} pos the position of the sender pin
 */
function pinEnter(sender,pos){
    let idx = prompt("enter index");
    currentCode[pos] = Number(idx);
    sender.style.backgroundColor = possibleColors[idx];
}

/**
 * Create a hint pin. The codebreaker (CPU) uses this to provide feedback.
 * @returns The created pin object. Insert it into the document to see it.
 */
function createHintPin(){
    const pin = document.createElement('div');
    pin.className = "hintpin"
    return pin;
}

/**
 * Create the button used to check if the code is correct.
 * @returns The check button. Insert it into the document to see it.
 */
function createCheckbtn(){
    const btn = document.createElement('button');
    btn.innerHTML = "Check";
    btn.hidden = true;
    btn.onclick = () => {checkMove(btn)};
    return btn;
}

/**
 * Setup the game
 */
function init(){
    const answers = document.getElementById('answers');
    const hints = document.getElementById('hints');
    answers.innerHTML = '';
    hints.innerHTML = '';

    //generate html
    for(let r = 0; r < 10; r++){
        let answerpins = [];
        let hintpinrow = [];
        for(let c = 0; c < 4; c++){
            let answerpin = createPin(c);
            answers.appendChild(answerpin);
            answerpins.push(answerpin);
            let hintpin = createHintPin();
            hints.appendChild(hintpin)
            hintpinrow.push(hintpin);
        }
        const checkbtn = createCheckbtn();
        checkbtns.push(checkbtn);
        answers.appendChild(checkbtn);

        answers.appendChild(document.createElement('br'));
        hints.appendChild(document.createElement('br'));
        pins.push(answerpins);
        hintpins.push(hintpinrow);
    }

    //decide the code
    code = [];
    for(let i = 0; i < 4; i++){
        code.push(Math.floor(Math.random() * possibleColors.length));
    }
}

/**
 * Prepare a new turn. Also checks if the game has been lost
 */
function prepareTurn(){
    currentCode = [-1,-1,-1,-1]
    currentRow++;
    //has the game been lost?
    if(currentRow == 10){
        alert("You lose!")
        return;
    }
    for(let pin of pins){
        pin.disabled = false;
    }
    checkbtns[currentRow].hidden = false;
}

/**
 * Determine the feedback for a move
 * @param {HTMLButtonElement} sender the Checkbutton that initiated the request
 */
function checkMove(sender){
    sender.hidden = true;

    //red pegs - correct color, correct location
    let haveCounted = [];
    let n_red = 0;
    let n_white = 0;
    for(let i = 0; i < 4; i++){
        if (currentCode[i] == code[i]){
            n_red++;
            haveCounted[i] = true;
        }
        else{
            haveCounted[i] = false;
        }
        
    }
    //white pegs - correct color, wrong location
    index = possibleColors.length;
    for(let i = 0; i < 4; i++){
        if (!haveCounted[index]){
            if (code.includes(currentCode[index])){
                n_white++;
            }
        }
        index--;
    }

    //render hint
    let i = 0;
    for(; i < n_red; i++){
        hintpins[currentRow][i].style.backgroundColor = "#FF0000";
    }
    for(; i < n_white + n_red; i++){
        hintpins[currentRow][i].style.backgroundColor = "#FFFFFF";
    }

    //do we need another turn?
    if (n_red == 4){
        alert("You win!")
    }
    else{
        prepareTurn();
    }
}

//start game
init();
prepareTurn();