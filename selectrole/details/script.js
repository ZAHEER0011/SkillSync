const bioInput = document.getElementById("bio");
const bioCounter = document.getElementById("bio-counter");

// Listen for input events on the textarea
bioInput.addEventListener("input", () => {
  const bioLength = bioInput.value.length;

  // Update the character counter
  bioCounter.textContent = `${bioLength}/150`;

  // If max length is reached, trim the input (optional safeguard)
  if (bioLength > 150) {
    bioInput.value = bioInput.value.substring(0, 150);
    bioCounter.textContent = "150/150"; // Ensure it doesn't go over the limit
  }
});

const selectBtn = document.querySelector(".select-btn"),
      items = document.querySelectorAll(".item");
selectBtn.addEventListener("click", () => {
    selectBtn.classList.toggle("open");
});
items.forEach(item => {
    item.addEventListener("click", () => {
        item.classList.toggle("checked");
        let checked = document.querySelectorAll(".checked"),
            btnText = document.querySelector(".btn-text");
            if(checked && checked.length > 0){
                btnText.innerText = `${checked.length} Selected`;
            }else{
                btnText.innerText = "Select Language";
            }
    });
})