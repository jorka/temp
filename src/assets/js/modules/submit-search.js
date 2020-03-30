const submitStep1 = form => {
  const formEl = document.querySelector(form);
  if (formEl) {
    formEl.addEventListener('submit', event => {
      event.preventDefault();
      const formData = new FormData(formEl);
      [...formData].forEach(([name, value]) => {
        window.sessionStorage.setItem(`${window.location.host}_${name}`, value);
      });
      formEl.submit();
    });
  }
};

const populateFromStep1 = els => {
  const domEls = document.querySelectorAll(els);
  domEls &&
    domEls.forEach(el => {
      el.innerHTML = window.sessionStorage.getItem(
        `${window.location.host}_${el.dataset.search}`,
      );
    });
};

const loadBrandLogo = els => {
  const domEls = document.querySelectorAll(els);
  const imgStr = window.sessionStorage.getItem(
    `${window.location.host}_marque`,
  );

  domEls &&
    domEls.forEach(el => {
      const image = new Image();
      const imageSrc = `/assets/img/brands/logo-${imgStr.toLowerCase()}.svg`;

      fetch(imageSrc)
        .then(response => {
          if (response.status == 200) {
            image.src = imageSrc;
            image.setAttribute('alt', imgStr.toLowerCase());
            el.setAttribute('data-logo', imgStr.toLowerCase());
            el.appendChild(image);
          }
        })
        .catch(error => {
          console.log(error);
        });
    });
};

export default function SubmitSearch(form, els, logoEl) {
  submitStep1(form);
  populateFromStep1(els);
  loadBrandLogo(logoEl);
}
