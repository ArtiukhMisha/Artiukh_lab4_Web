//elements
const $workspace          = document.querySelector('.workspace_notes');
const $currentWindow      = document.querySelector('html');
const $addButton          = document.querySelector('.add');
const $removeButton       = document.querySelector('.remove');
const $clearButton        = document.querySelector('.clear-all');

//variables
let action                = false;
let move                  = false;
let $selectedBox          = null;
let selectedBoxIndex      = null;
let boxes                 = [];
let areaWidth             = $workspace.offsetWidth;
let areaHeight            = $workspace.offsetHeight;
let boxWidth              = 0;
let boxHeight             = 0;

//constants
let startCoords = {
    x: 0,
    y: 0
}
let distance = {
    x: 0,
    y: 0
}

//functions
if (JSON.parse(localStorage.getItem("boxes")) !== null) {
    reloadStickers();
}

function boxGenerator() {
    reloadStickers();
}

function boxController(x, y) {
    $selectedBox.style.left = x + 'px';
    $selectedBox.style.top = y + 'px';
}

$workspace.addEventListener('keyup', function (e) {
    boxes[e.target.getAttribute('data-index')].text = document.querySelectorAll('textarea')[e.target.getAttribute('data-index')].value;
    localStorage.setItem('boxes', JSON.stringify(boxes));
});

$workspace.addEventListener('mousedown', function (e) {
    if (e.target.classList.contains('box')) {
        move = false;
        boxWidth = document.querySelector('.box').offsetWidth;
        boxHeight = document.querySelector('.box').offsetHeight;
        action = true;
        $selectedBox = e.target;
        selectedBoxIndex = e.target.getAttribute('data-index');
        startCoords.x = e.pageX;
        startCoords.y = e.pageY;
    }
});

$currentWindow.addEventListener('mouseup', function (e) {
    action = false;
    if (move == true && boxes.length !== 0) {
        boxes[selectedBoxIndex].x = distance.x;
        boxes[selectedBoxIndex].y = distance.y;
        localStorage.setItem("boxes", JSON.stringify(boxes));
    }
});

$workspace.addEventListener('mousemove', function (e) {
    if (action) {
        move = true;
        console.log(e.pageX + "; " + e.pageY);
        distance.x = boxes[selectedBoxIndex].x + (e.pageX - startCoords.x);
        distance.y = boxes[selectedBoxIndex].y + (e.pageY - startCoords.y);

        if (distance.x <= 0) distance.x = 0;
        if (distance.x >= (areaWidth - boxWidth)) distance.x = areaWidth - boxWidth;

        if (distance.y <= 0) distance.y = 0;
        if (distance.y >= (areaHeight - boxHeight)) distance.y = areaHeight - boxHeight;
        console.log(distance.x + "; " + distance.y);
        boxController(distance.x, distance.y);
    }
});

$addButton.addEventListener('click', function () {
    boxes.push({
        x: 12,
        y: 12,
        text: ''
    });
    localStorage.setItem("boxes", JSON.stringify(boxes));
    boxGenerator();
});

$removeButton.addEventListener('click', function () {
    boxes.splice(selectedBoxIndex, 1);
    localStorage.setItem("boxes", JSON.stringify(boxes));
    reloadStickers();
});

$clearButton.addEventListener('click', function () {
    boxes = [];
    localStorage.setItem("boxes", JSON.stringify(boxes));
    reloadStickers();
});

function reloadStickers() {
    let template = '';
    boxes = JSON.parse(localStorage.getItem("boxes"));
    for (let i = 0; i < boxes.length; i++) {
        template += '<div class="box" style="left: ' + boxes[i].x + 'px; top: ' + boxes[i].y + 'px;" data-index="' + i + '">' + '<textarea class="box-text" data-index="' + i + '" placeholder="Write here...">' + boxes[i].text + '</textarea></div>';
    }
    $workspace.innerHTML = template;
}
