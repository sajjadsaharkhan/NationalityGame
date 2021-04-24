//Programming and Designing By : Sajjad Saharkhan

//game setting:
//      based on milisecond
const game_time = 500;
// const data_url = './data.json';

//define and initilze variables:
var timer = null;
var timer1 = null;
var game_data = [];
var showed_data = [];
var current_image_index = 0;
var image_current_top = 0;
var remaining_time = game_time;
var total_point = 0;
var current_draged_nationality = '';
const game_log = {
    chinese: 0,
    korean: 0,
    thai: 0,
    japanese: 0,
};

//load game data from 'data.json' or server :
// var xhr = new XMLHttpRequest();
// xhr.onreadystatechange = function() {
//     if (xhr.readyState === 4) {
//         if (xhr.status === 200) {
//             game_data = JSON.parse(xhr.responseText);
//         } else {
//             game_data = [];
//         }
//     }
// };
// xhr.open('GET', data_url, true);
// xhr.send();

game_data = [{
        image: "./src/chinese-01.jpg",
        nationality: "chinese"
    },
    {
        image: "./src/chinese-02.jpg",
        nationality: "chinese"
    },
    {
        image: "./src/chinese-03.jpg",
        nationality: "chinese"
    },
    {
        image: "./src/japanese-01.jpg",
        nationality: "japanese"
    },
    {
        image: "./src/japanese-02.jpg",
        nationality: "japanese"
    },
    {
        image: "./src/japanese-03.jpg",
        nationality: "japanese"
    },
    {
        image: "./src/korean-01.jpg",
        nationality: "korean"
    },
    {
        image: "./src/korean-02.jpg",
        nationality: "korean"
    },
    {
        image: "./src/korean-03.jpg",
        nationality: "korean"
    },
    {
        image: "./src/thai-01.jpg",
        nationality: "thai"
    },
    {
        image: "./src/thai-02.jpg",
        nationality: "thai"
    },
    {
        image: "./src/thai-03.jpg",
        nationality: "thai"
    }
]

//define html element that need in two or more functions
const start_button = document.getElementById('start-button');
const timer_lable = document.getElementById('game-timer');
const point_lable = document.getElementById('game-point');
const question_image = document.getElementById('question-image');
const end_line = document.getElementById('end-line');
const game_board = document.getElementById('game-board');

//return a random index of "game_data" that not shown
const get_random_index = () => {
    //This loop stops when a index that is not shown to the user is between 0 and "game_data" length
    while (true) {
        //calculate a random number betwen 0 and "game_data" length -1
        const index = Math.floor(Math.random() * game_data.length);
        if (game_data.length <= showed_data.length) return -1;
        if (showed_data.includes(index) === false) {
            showed_data.push(index);
            return index;
        }
    }
};

//when we want to change timer label use this function
const handle_change_timer_label = (time) => {
    timer_lable.innerHTML = (time < 0 ? 0 : time) + 'ms';
};

//this function moves question image in vertical axis
const handle_change_image_question_top = (top) => {
    question_image.style.top = top + 'px';
};

//change total point of user
//   if total point is negative total point text color change to red otherwise it is white
const handle_change_total_point = (total_point) => {
    if (total_point < 0) point_lable.children[0].style.color = 'red';
    else point_lable.children[0].style.color = 'white';
    point_lable.children[0].innerHTML = 'Total Point : ' + total_point;
};

//This is a general function that changes the count of all badges
const handle_change_choice_badge = (count, id) => {
    if (document.getElementById(id))
        document.getElementById(id).innerHTML = count;
};

//this function reset badges background color to default color because badges background
//  colors maybe change when we change their parent background-color
handle_set_badges_backgroundcolor = () => {
    document.getElementById('thai-badge').style.backgroundColor = '#da6c16bf';
    document.getElementById('chinese-badge').style.backgroundColor = '#da6c16bf';
    document.getElementById('korean-badge').style.backgroundColor = '#da6c16bf';
    document.getElementById('japanese-badge').style.backgroundColor = '#da6c16bf';
};

//this function reset all choice background-color to default except selected choice
const handle_reset_choice_backgroundcolor = () => {
    const natinalities = ['korean', 'thai', 'chinese', 'japanese'];
    const remaining_nationalities = natinalities.filter(
        (n) => n !== current_draged_nationality
    );
    remaining_nationalities.forEach((n) => {
        document.getElementById(n).style.backgroundColor = '#009688';
    });
    handle_set_badges_backgroundcolor();
};

//this method reset all data of game and initilize program for new game
const handle_reset_game = () => {
    //show start button!
    start_button.style.display = 'block';

    //hide game control options
    timer_lable.style.display = 'none';
    point_lable.style.display = 'none';
    question_image.style.display = 'none';

    //reset game variables
    image_current_top = 0;
    handle_change_image_question_top(0);
    remaining_time = game_time;
    handle_change_timer_label(0);
    total_point = 0;
    showed_data = [];
    game_log.chinese = 0;
    game_log.japanese = 0;
    game_log.korean = 0;
    game_log.thai = 0;
    handle_change_choice_badge(0, 'thai-badge');
    handle_change_choice_badge(0, 'korean-badge');
    handle_change_choice_badge(0, 'chinese-badge');
    handle_change_choice_badge(0, 'jpanese-badge');
    handle_change_timer_label(game_time);
    handle_change_total_point(0);
    handle_set_badges_backgroundcolor();
};

//this function changes question image!
//  this function preapre game for next level
const handle_change_image_question_image = () => {
    image_current_top = 0;
    handle_change_image_question_top(0);
    remaining_time = game_time;
    handle_change_timer_label(0);
    handle_set_badges_backgroundcolor();

    current_image_index = get_random_index();
    //if we get -1 from "get_random_index" it's mean all of game data was showed to user and the game is over
    if (current_image_index === -1) {
        clearInterval(timer);
        alert('EndGame \n Your Total Point is : ' + total_point);
        handle_reset_game();
        return;
    }
    question_image.src = game_data[current_image_index].image;
    timer = setInterval(handle_down_animation, 1);
};

//this function handle down animation of question image!
// it's call in interval
const handle_down_animation = () => {
    const total_distance = game_board.offsetHeight - question_image.offsetHeight;

    //If the question image has reached the end red line! its mean user lost the point of this level
    if (image_current_top >= total_distance) {
        clearInterval(timer);
        total_point -= 5;
        handle_change_total_point(total_point);
        //user lost this level and we should to next level
        handle_change_image_question_image();
        return;
    }

    handle_change_image_question_top(image_current_top);
    image_current_top += total_distance / game_time;
    handle_change_timer_label(--remaining_time);
};

// event's

start_button.onclick = () => {
    //hide start button!
    start_button.style.display = 'none';

    //show game control options
    timer_lable.style.display = 'block';
    point_lable.style.display = 'block';
    question_image.style.display = 'block';

    timer = setInterval(handle_down_animation, 1);
};

//when the question image was moved on any choice this function call and set "current_draged_nationality"
// ...to the choice that question image was moved
const allowDrop = (event) => {
    event.preventDefault();
    if (event.target.id) {
        current_draged_nationality = event.target.id;
        event.target.style.backgroundColor = '#0c3c34';
        handle_reset_choice_backgroundcolor();
    }
};

//when user drop the quesion image on selected choice this fucntion was called
const drop = (event) => {
    event.preventDefault();
    clearInterval(timer);
    //check true answer and selected choice and update "total_point"
    if (game_data[current_image_index].nationality === current_draged_nationality)
        total_point += 20;
    else total_point -= 5;
    game_log[current_draged_nationality]++;
    handle_change_choice_badge(
        game_log[current_draged_nationality],
        current_draged_nationality + '-badge'
    );
    handle_change_total_point(total_point);
    handle_change_image_question_top(0);
    handle_change_timer_label(game_time);
    handle_change_image_question_image();
    document.getElementById(current_draged_nationality).style.backgroundColor = "#009688";
    handle_set_badges_backgroundcolor();
};

// set drop fucntions to all choices

document.getElementById('japanese').ondrop = drop;
document.getElementById('japanese').ondragover = allowDrop;

document.getElementById('thai').ondrop = drop;
document.getElementById('thai').ondragover = allowDrop;

document.getElementById('korean').ondrop = drop;
document.getElementById('korean').ondragover = allowDrop;

document.getElementById('chinese').ondrop = drop;
document.getElementById('chinese').ondragover = allowDrop;

document.getElementById('chinese').ondrop = drop;
document.getElementById('chinese').ondragover = allowDrop;