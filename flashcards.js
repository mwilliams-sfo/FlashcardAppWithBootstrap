
let cards = [
  {
    front: 'Who sang the popular theme from the movie Titanic?',
    back: 'Celine Dion'
  }
];
let cardNumber = 0;
let cardFlipped = false;

const hasClass = function(elt, name) {
  const styles = (elt.className || '').trim().split(/\s+/);
  return styles.indexOf(name) >= 0;
};

const addClass = function(elt, name) {
  if (!hasClass(elt, name)) {
    const styles = (elt.className || '').trim().split(/\s+/);
    elt.className = styles.push(name).join(' ');
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

  document.querySelector('#flipCard').addEventListener('click', evt => {
    cardFlipped = !cardFlipped;
    update();
  });
});
