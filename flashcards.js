
let cards = [
  {
    front: 'Who sang the popular theme from the movie Titanic?',
    back: 'Celine Dion'
  },
  {
    front: 'What is the capital of Rhode Island?',
    back: 'Providence'
  }
];
let cardNumber = 0;
let cardFlipped = false;
let editing = false;

const hasClass = function(elt, name) {
  const styles = (elt.className || '').trim().split(/\s+/);
  return styles.indexOf(name) >= 0;
};

const addClass = function(elt, name) {
  if (!hasClass(elt, name)) {
    const styles = (elt.className || '').trim().split(/\s+/);
    elt.className = styles.concat(name).join(' ');
  }
};

const removeClass = function(elt, name) {
  if (elt.hasAttribute('class')) {
    const styles = elt.className.trim().split(/\s+/);
    for (let i = 0; i < styles.length; i++) {
      if (styles[i] === name) {
        styles.splice(i, 1);
        i--;
      }
    }
    elt.className = styles.join(' ');
  }
};

const toggleClass = function(elt, name) {
  if (hasClass(elt, name)) {
    removeClass(elt, name);
  } else {
    addClass(elt, name);
  }
};

const update = function() {
  if (!editing) {
    addClass(document.querySelector('#editor'), 'd-none');
    addClass(document.querySelector('#editorGuide'), 'd-none');
    removeClass(document.querySelector('#viewer'), 'd-none');
    removeClass(document.querySelector('#viewerGuide'), 'd-none');
    removeClass(document.querySelector('#addCards'), 'd-none');
  } else {
    addClass(document.querySelector('#viewer'), 'd-none');
    addClass(document.querySelector('#viewerGuide'), 'd-none');
    addClass(document.querySelector('#addCards'), 'd-none');
    removeClass(document.querySelector('#editor'), 'd-none');
    removeClass(document.querySelector('#editorGuide'), 'd-none');
  }

  const cardCaption = document.querySelector('#cardCaption');
  cardCaption.textContent =
    (cards.length == 0) ? 'No cards' :
    (0 <= cardNumber && cardNumber < cards.length) ? `Card #${cardNumber + 1}` :
    '';

  const cardText = document.querySelector('#cardText');
  cardText.textContent = '';
  const card = cards[cardNumber];
  if (card) {
    cardText.textContent = cardFlipped ? card.back : card.front;
  }
};

window.addEventListener('load', evt => {
  update();

  document.querySelector('#viewer .card').addEventListener('click', evt => {
    if (cards.length === 0 || cardNumber < 0 || cards.length <= cardNumber) {
      cardNumber = 0;
    } else {
      cardNumber = (cardNumber + 1) % cards.length;
      cardFlipped = false;
    }
    update();
  });

  document.querySelector('#flipCard').addEventListener('click', evt => {
    cardFlipped = !cardFlipped;
    update();
  });

  document.querySelector('#addCards').addEventListener('click', evt => {
    editing = true;
    update();
  });

  document.querySelector('#reviewCards').addEventListener('click', evt => {
    editing = false;
    cardFlipped = false;
    update();
  });
});
