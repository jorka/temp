import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

const modalBodyClass = 'is-modal-open';

// function focusModalInput(modal) {
//   const firstInput = modal.querySelector('input');
//   if (firstInput) {
//     firstInput.focus();
//   } else {
//     return;
//   }
// }

export function showModal(el, isStatic = false) {
  const modal = document.querySelector(el);
  modal.setAttribute('tabindex', '0');
  modal.focus();
  modal.classList.remove('opacity-0');
  modal.classList.remove('pointer-events-none');
  disableBodyScroll(modal);
  document.body.classList.add(modalBodyClass);

  if (isStatic) {
    modal.classList.add('is-static');
  }
}

export function hideModal() {
  event.preventDefault();
  const allModals = document.querySelectorAll('[data-modal]');
  allModals.forEach(item => {
    item.classList.add('opacity-0');
    item.classList.add('pointer-events-none');
    item.classList.remove('is-static');
    item.setAttribute('tabindex', '-1');
  });
  clearAllBodyScrollLocks();
  document.body.classList.remove(modalBodyClass);
}

const modal = () => {
  const modalTrigger = document.querySelectorAll('[data-modaltarget]');
  const modalClose = document.querySelectorAll('[data-modal-close]');

  modalTrigger.forEach(item => {
    item.addEventListener('click', event => {
      event.preventDefault();
      showModal(item.dataset.modaltarget);
    });
  });

  if (modalClose) {
    modalClose.forEach(item => {
      item.addEventListener('click', hideModal);
    });
  }

  document.onkeydown = event => {
    event = event || window.event;
    let isEscape = false;
    if ('key' in event) {
      isEscape = event.key === 'Escape' || event.key === 'Esc';
    } else {
      isEscape = event.keyCode === 27;
    }
    if (isEscape && document.body.classList.contains(modalBodyClass)) {
      hideModal();
    }
  };
};

// expose modal show and hide
window.showModal = showModal;
window.hideModal = hideModal;

// Example:
// onclick="showModal('#modal-connexion', false)
// onclick="hideModal('#modal-connection', false)

(function() {
  modal();
})();
