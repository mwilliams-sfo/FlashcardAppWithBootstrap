
let cards = [];
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

const showViewer = function() {
  addClass(document.querySelector('#editor'), 'd-none');
  addClass(document.querySelector('#editorGuide'), 'd-none');
  removeClass(document.querySelector('#viewer'), 'd-none');
  removeClass(document.querySelector('#viewerGuide'), 'd-none');
  removeClass(document.querySelector('#addCards'), 'd-none');
};

const showEditor = function() {
  addClass(document.querySelector('#viewer'), 'd-none');
  addClass(document.querySelector('#viewerGuide'), 'd-none');
  addClass(document.querySelector('#addCards'), 'd-none');
  removeClass(document.querySelector('#editor'), 'd-none');
  removeClass(document.querySelector('#editorGuide'), 'd-none');
};

const update = function() {
  if (!editing) {
    showViewer();

    const cardText = document.querySelector('#cardText');
    cardText.textContent = '';
    const card = cards[cardNumber];
    if (card) {
      cardText.textContent = cardFlipped ? card.back : card.front;
    }

    document.querySelector('#cardCaption').textContent =
      (cards.length == 0) ? 'No cards' :
      (0 <= cardNumber && cardNumber < cards.length) ? `Card #${cardNumber + 1}` :
      '';
  } else {
    showEditor();
    document.querySelector('#reviewCards').disabled = (cards.length === 0);
  }
  document.querySelector('#numberOfCards').textContent = `${cards.length}`
};

const loadCards = function() {
  return new Promise((resolve, reject) => {
    localforage.getItem('cards', (err, value) => {
      try {
        if (err) throw err;
        if (value) {
          cards = value;
        }
        editing = (cards.length === 0);
        update();
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });
};

const saveCard = function(card) {
  return new Promise((resolve, reject) => {
    cards.push(card);
    localforage.setItem('cards', cards, err => {
      err ? reject(err) : resolve();
    });
  });
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
    document.querySelector('#editFront').value = '';
    document.querySelector('#editBack').value = '';
    update();
  });

  document.querySelector('#saveCard').addEventListener('click', evt => {
    evt.preventDefault();
    if (!document.querySelector('#editor').reportValidity()) return;
    const editFront = document.querySelector('#editFront');
    const editBack = document.querySelector('#editBack');
    saveCard({
      front: editFront.value.trim(),
      back: editBack.value.trim()
    });
    editFront.value = editBack.value = '';
    update();
  });

  document.querySelector('#reviewCards').addEventListener('click', evt => {
    editing = false;
    cardFlipped = false;
    update();
  });

  loadCards();
});
