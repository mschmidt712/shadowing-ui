export default function handleEnterClick(el) {
  var input = document.getElementById(el);

  input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      const submitButton = document.getElementById("submit");
      submitButton.click();
    }
  });
};
