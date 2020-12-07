// quiz
quizClassNames = {
    startQuiz: '.home-intro__start-quiz',
    points: '.quiz__points',
    question: '.quiz__question',
    answers: '.quiz__answers',
    answer: '.quiz__answer',
    resetQuiz: '.js-reset',
    submit: '.js-submit',
    wrapper: '.quiz__wrapper'
}
quizDynamicNames = {
    question: 'quiz__question',
    answers: 'quiz__answers',
    answer: 'quiz__answer',
    selectedAnswer: 'quiz__answer--selected',
    correct: 'quiz__answer--correct',
    wrong: 'quiz__answer--wrong',
    questionBlock: 'quiz__question-block',
    activeQuestionBlock: 'quiz__question-block--active',
    error: 'quiz__wrapper-error',
    loader: 'quiz__wrapper-loader'
}

const url = 'http://localhost:3000/questions';
const getQuestions = async () => {
    try {
        const response = await fetch(url)
        if(response.ok) {
            const questionsJson = await response.json();
            renderQuestionBlock(questionsJson[currentQuestionIndex]);
            let loader = get('.' + quizDynamicNames.loader);
            if(loader) {
                loader.remove();
            }
        } 
    }
    catch(error) {
        error = createElement("p", [quizDynamicNames.error], undefined, "Quiz couldn't load");
        wrapper.appendChild(error);
    } 
}
const getSelected = async () => {
    try {
        const response = await fetch(url)
        if(response.ok) {
            const questionsJson = await response.json();
            getSelectedAnswers(questionsJson[currentQuestionIndex]);
            getCurrentPoints();
            if(currentQuestionIndex === questionsJson.length-1) {
                setFinishButton();
            } else {
                setNextQuestion();
            }
        } 
    }
    catch(error) {
        error = createElement("p", [quizDynamicNames.error], undefined, "Error");
        wrapper.appendChild(error);
    } 
}

function setLoader() {
    let wrapper = get(quizClassNames.wrapper);
    let loader = createElement('p', [quizDynamicNames.loader], undefined, 'Loading...');
    wrapper.appendChild(loader);
}

let currentQuestionIndex;
let currentPoints;
// start quiz button
let startQuiz = get(quizClassNames.startQuiz);
startQuiz.addEventListener('click', function () {
    let quizPos = get('#quiz');
    quizPos.scrollIntoView({behavior: "smooth"});
    currentQuestionIndex = 0;
    currentPoints = 0;
    
    setLoader();
    setTimeout(getCurrentPoints, 2000);
    setTimeout(getQuestions, 2000);
    
    // getQuestions();
    setSubmit();
});


function setSubmit() {
    let submitAnswers = get(quizClassNames.submit);
    submitAnswers.innerHTML = 'Submit';
    submitAnswers.disabled = true;
    submitAnswers.removeEventListener('click', handleNextQuestion);
    submitAnswers.removeEventListener('click', handleFinishButton);
    submitAnswers.addEventListener('click', handleSubmit);
}

function setNextQuestion() {
    let submitAnswers = get(quizClassNames.submit);
    submitAnswers.innerHTML = 'Next question';
    submitAnswers.removeEventListener('click', handleSubmit);
    submitAnswers.removeEventListener('click', handleFinishButton);
    submitAnswers.addEventListener('click', handleNextQuestion);
}

function setFinishButton() {
    let finishQuiz = get(quizClassNames.submit);
    finishQuiz.innerHTML = 'Results';
    finishQuiz.removeEventListener('click', handleSubmit);
    finishQuiz.removeEventListener('click', handleNextQuestion);
    finishQuiz.addEventListener('click', handleFinishButton);
}

function handleSubmit() {
    // getCurrentPoints();
    getSelected();
    let answers = document.querySelectorAll(quizClassNames.answers)[currentQuestionIndex];
    answers.style.pointerEvents = 'none';
    // if(currentQuestionIndex === questions.length-1) {
    //     setFinishButton();
    // } else {
        // setNextQuestion();
    // }
}

function handleNextQuestion() {
    hidePreviousBlock(currentQuestionIndex);
    currentQuestionIndex++;
    
    getQuestions();
    setSubmit();
}

function handleFinishButton() {
    hidePreviousBlock(currentQuestionIndex);
    let wrapper = get(quizClassNames.wrapper);
    wrapper.appendChild(createElement('div', ['quiz__completed'], undefined, `You completed the quiz with ${currentPoints} points!`));
    let finishQuiz = get(quizClassNames.submit);
    finishQuiz.style.display = 'none';
    let points = get(quizClassNames.points);
    points.style.display = 'none';
}

function preventScroll () {
    document.body.style.overflow = 'hidden';
}
const el = get('body');
el.onwheel = preventScroll;

// object with questions and answers
// let questions = [
//     {
//         question: 'First question?', 
//         answers: [
//             { text: 'First answer 1', correct: true},
//             { text: 'Second answer 1', correct: false},
//             { text: 'Third answer 1', correct: true},
//             { text: 'Fourth answer 1', correct: false},
//             { text: 'Fifth answer 1', correct: true}
//         ]
//     },
//     {
//         question: 'Second question?',
//         answers: [
//             { text: 'First answer 2', correct: false},
//             { text: 'Second answer 2', correct: true},
//             { text: 'Third answer 2', correct: true}
//         ]
//     },
//     {
//         question: 'Third question?',
//         answers: [
//             { text: 'First answer 3', correct: true},
//             { text: 'Second answer 3', correct: false},
//             { text: 'Third answer 3', correct: false},
//             { text: 'Fourth answer 3', correct: false}
//         ]
//     }
// ];

// version with nested loop
// function getSelectedAnswers(question) {
//     let selected=document.querySelectorAll('.' + quizDynamicNames.selectedAnswer);
//     let selectedArray = Array.from(selected);
    
//     selectedArray.forEach(answer => {
//         question.answers.some (answerObject => {
//             if(answer.innerHTML === answerObject.text) {
//                 if(answerObject.correct) {
//                    answer.classList.add('quiz__answer--correct');
//                    return true;
//                 } else {
//                    answer.classList.add('quiz__answer--wrong');
//                    return false;
//                 }
//             }
//             console.log(answer);
//             console.log(answerObject);
//         });
//     });  
// }


function getSelectedAnswers (question){
        // without nested loop
        let selected = document.querySelectorAll(`div.${quizDynamicNames.activeQuestionBlock} button.${quizDynamicNames.selectedAnswer}`);
        // dohvatiti samo vidljive, ako nemaju drugu klasu
        let selectedArray = Array.from(selected);

        selectedArray.forEach (answer => {
            let filteredAnswer = question.answers.filter(answerObject => (answerObject.text === answer.innerHTML))[0];

            if(!filteredAnswer) {
                return;
            }
            // ako ima greska razmisliti o resenju (greska u kvizu npr)
            if(filteredAnswer.correct) {
                answer.classList.add(quizDynamicNames.correct);
                currentPoints++;
            } else {
                answer.classList.add(quizDynamicNames.wrong);
                currentPoints--;
            }
        });

    // ispod je verzija sa dve forEach petlje
    // selectedArray.forEach(answer => {
    //     question.answers.forEach(answerObject => {
    //         if(answer.innerHTML === answerObject.text ) {
    //             if(answerObject.correct) {
    //                 answer.classList.add('quiz__answer--correct');
    //                 currentPoints++;
    //             } else {
    //                 answer.classList.add('quiz__answer--wrong');
    //                 currentPoints--;
    //             }
    //         } 
    //     });
    // }); 
}

function getCurrentPoints() {
    get(quizClassNames.points).innerHTML = "Points: " + currentPoints;

}

// on answer click (changing background color when selected)
function selectedAnswer(answer) {
    let submitAnswers = get(quizClassNames.submit);
    answer.addEventListener('click', function() {
        answer.classList.toggle(quizDynamicNames.selectedAnswer);
        let selectedArr = document.querySelectorAll(`div.${quizDynamicNames.activeQuestionBlock} button.${quizDynamicNames.selectedAnswer}`);
        let selected = Array.from(selectedArr);
        console.log(selected);
        
        if(selected.length === 0) {
            submitAnswers.disabled = true;
        } else {
            submitAnswers.disabled = false;
        }
    });
}

// rendering answer blocks for each question
function renderAnswers(question) {
    let answerWrapper = createElement('div', [quizDynamicNames.answers]);
    
    question.answers.forEach(answer => {
        answerWrapper.appendChild(createElement('button', [quizDynamicNames.answer], undefined, answer.text, selectedAnswer));
    });
    return answerWrapper;
}

// rendering question
function renderQuestionBlock(question) {
    let wrapper = get(quizClassNames.wrapper);
    
    let questionBlock = createElement('div', [quizDynamicNames.questionBlock, quizDynamicNames.activeQuestionBlock]);
    let questionHTML = createElement('div', [quizDynamicNames.question], undefined, question.question);
    
    questionBlock.appendChild(questionHTML);
      
    questionBlock.appendChild(renderAnswers(question));
    wrapper.appendChild(questionBlock);
}

// previous question and answers remain in the DOM
function hidePreviousBlock(currentQuestionIndex) {
    let previous = document.querySelectorAll('.quiz__question-block')[currentQuestionIndex];
    previous.classList.remove('quiz__question-block--active');
}

// rendering next question with answers
function renderNextQuestionBlock() {
    renderQuestionBlock(questions[currentQuestionIndex]);
}

// reset quiz
let resetQuizButton = get(quizClassNames.resetQuiz);
let submit = get(quizClassNames.submit);
let points = get(quizClassNames.points);
let wrapper = document.querySelector('.quiz__wrapper');
resetQuizButton.addEventListener('click', function() {
    document.documentElement.scrollTop = 0;
    wrapper.innerHTML = '';
    submit.style.display = 'block';
    points.style.display = 'block';
});


// slider section
// sliderClassNames= {
//     activeSlide: 'img-slider__slide--active',
//     btn: 'img-slider__button',
//     slides: 'js-slide',
//     nextBtn: 'js-next',
//     prevBtn: 'js-prev',
//     hiddenBtn: 'img-slider__button--hidden',
//     dots: 'js-dot',
//     activeSlideDot: 'slider-dots__dot--active'
// };


// let currentSlide = 0;
// let infinite = true;
// let slidesArr = document.getElementsByClassName(sliderClassNames.slides);
// let nextBtn = document.getElementsByClassName('img-slider__button--right')[0];
// let prevBtn = document.getElementsByClassName('img-slider__button--left')[0];
// let dotsArr = document.getElementsByClassName(sliderClassNames.dots);

// hideArrows(currentSlide);

// function hideArrows(currentSlide) {
//     if (currentSlide === slidesArr.length - 1) {
//         nextBtn.style.display = 'none';
//         prevBtn.style.display = 'block';
//     }
//     else if (currentSlide === 0) {
//         prevBtn.style.display = 'none';
//         nextBtn.style.display = 'block';
//     }
//     else if(currentSlide > 0 && currentSlide < slidesArr.length-1) {
//         prevBtn.style.display = 'block';
//         nextBtn.style.display = 'block';
//     }
// }

// function currentDot(n) {
//     [...slidesArr].forEach((slide) => {
//         [...dotsArr].forEach((dot) => {
//             dot.classList.remove(sliderClassNames.activeSlideDot);
//             slide.classList.remove(sliderClassNames.activeSlide);
//         })
//     })
//     slidesArr[n].classList.add(sliderClassNames.activeSlide);
//     dotsArr[n].classList.add(sliderClassNames.activeSlideDot);
// }

// function incrementSlider(infinite) {
//     // current slide, removing class activeSlide to move on to the next slide
//     slidesArr[currentSlide].classList.remove(sliderClassNames.activeSlide);
//     dotsArr[currentSlide].classList.remove(sliderClassNames.activeSlideDot);

//     // if it is the last slide
//     if (currentSlide == slidesArr.length - 1) {
//         // infinite carousel
//         if (infinite) {
//             currentSlide = 0;
//         } 
//     } else {
//         currentSlide++;
//         hideArrows(currentSlide);
//     }
    
//     // adding active class
//     slidesArr[currentSlide].classList.add(sliderClassNames.activeSlide); 
//     dotsArr[currentSlide].classList.add(sliderClassNames.activeSlideDot);   
// }

// function decrementSlider(infinite) {
//     // current slide, removing class activeSlide to move on to the next slide
//     slidesArr[currentSlide].classList.remove(sliderClassNames.activeSlide);
//     dotsArr[currentSlide].classList.remove(sliderClassNames.activeSlideDot);
//     // if it is the first slide
//     if (currentSlide === 0) {
//         if (infinite) {
//             currentSlide = slidesArr.length - 1;
//         } 
//     } else {
//         currentSlide--;
//         hideArrows(currentSlide);
//     }

//     // adding active class
//     dotsArr[currentSlide].classList.add(sliderClassNames.activeSlideDot);
//     slidesArr[currentSlide].classList.add(sliderClassNames.activeSlide);
// }

// [...dotsArr].forEach(element => {
//     element.addEventListener('click', handleDotClick);
// });

// function handleDotClick () {
//     this.className = this.className.replace("slider-dots__dot--active", "");   
// }

// // accordion section
// const accordion = {
//     button: 'js-accordion-button',
//     content: 'js-accordion-content',
//     activeBtn: 'accordion__button--active'
// };

// let accordionButtons = document.getElementsByClassName(accordion.button);

// [...accordionButtons].forEach(element => {
//     element.addEventListener('click', handleAccordionClick);
// });

// /* without animation when clicked
// function handleAccordionClick ()  {
//     this.classList.toggle(accordion.activeBtn);
// //  nextElementSibling vraca element koji je odmah nakon izabranog
//     let content = this.nextElementSibling;
// //  menjamo display u zavisnosti od trenutnog 
//     if (content.style.display === "block") {
//       content.style.display = "none";
//     } else {
//       content.style.display = "block";
//     }
// }
// */

// // with animation
// function handleAccordionClick () {
//     this.classList.toggle(accordion.activeBtn);
//     let content = this.nextElementSibling;
//     if (content.style.maxHeight) {
//         content.style.maxHeight = null;
//     } else {
//         content.style.maxHeight = content.scrollHeight + "px";
//     }
// }


// burger section
navigation = {
    header: 'header__nav',
    headerActive: 'header__nav--active'
};

const nav = document.querySelector('.header__nav');
const burger = document.querySelector('.burger');
function navSlide() {

    if(nav!=null) {
        nav.classList.toggle(navigation.headerActive);
    }
}

function toggleBurger() {

    if(burger!=null) {
        burger.classList.toggle('toggle');
    }
}

if(burger!=null) {
    burger.addEventListener('click', navSlide);
    burger.addEventListener('click', toggleBurger);
}


// function randomize (beforeNoon, afterNoon) {
//     let random = Math.random();
//     console.log(random);
//     if(random < 0.5){
//         console.log(beforeNoon);
//     }
//     else {
//         console.log(afterNoon);
//     }
// }
// randomize(11, 14);
