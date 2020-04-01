export default function CcInputs(els) {
  const inputEls = document.querySelectorAll(els);
  let all = 0;
  inputEls.forEach((el, index) => {
    el.addEventListener('input', () => {
      if (el.value.length === el.maxLength && index != inputEls.length - 1) {
        inputEls[index + 1].focus();
      }

      // if (el.value.length === el.maxLength && index == 1) {
      //   window.location.replace('/error');
      // }
    });
  });
}
