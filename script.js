const modal = document.querySelector(".login-modal-container")
const overlay = document.querySelector(".overlay")

const openModal = () => {
    console.log("Modal is Open");
    // const modals = document.querySelectorAll(".login-modal-container")
    // for (const singleModal of modals) {
      modal.classList.add("active");
    // }
    // document.modal.classList.add('modal-active');
    overlay.classList.add("overlayactive")
    

}

const closeModal = () => {
    console.log("Modal is Closed");
    const modalWrapper = document.querySelector('.card');
    const modals = document.querySelectorAll(".login-modal-container")
    for (const singleModal of modals) {
      singleModal.classList.remove("active");
    }
    overlay.classList.remove("overlayactive")
    modalWrapper.classList.toggle('flipped');
    

    // document.modal.classList.remove('modal-active');
}


// const registerModal = document.querySelector("#registerModal")
// const aboutOverlay = document.querySelector("overlay")

// const closeRegisterModal = () => {
//     console.log("About Modal is Closed");
//     openAbout.classList.remove("active")
//     aboutOverlay.classList.remove("overlayactive")
// }

const card = document.querySelector('.card');

// Create glow element
const glow = document.createElement('div');
glow.className = 'glow';
card.appendChild(glow);

// Show glow on mouse enter
card.addEventListener('mouseenter', () => {
    glow.style.opacity = '1'; // Make glow visible
});

// Hide glow on mouse leave
card.addEventListener('mouseleave', () => {
    glow.style.opacity = '0'; // Hide glow
});

// Move glow with mouse movement
card.addEventListener('mousemove', (e) => {
  const cardRect = card.getBoundingClientRect();
  const modalWrapper = document.querySelector('.card');

  const isFlipped = modalWrapper.classList.contains('flipped')

  const mouseX = isFlipped 
    ? cardRect.width - (e.clientX - cardRect.left)
    : e.clientX - cardRect.left;
  const mouseY = e.clientY - cardRect.top;
  

  glow.style.left = `${mouseX}px`;
  glow.style.top = `${mouseY}px`;
});


// const cardContainer = document.querySelector('.wrapper');
// const cardMove = document.querySelector('.login-modal-container');

// card.addEventListener('mousemove', (event) => {
//   const rect = cardContainer.getBoundingClientRect();
//   const x = event.clientX - rect.left;
//   const y = event.clientY - rect.top;
//   const centerX = rect.width / 2;
//   const centerY = rect.height / 2;
//   const angleX = Math.atan2(y - centerY, x - centerX);
//   const angleY = Math.atan2(x - centerX, y - centerY);

//   cardMove.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg)`;
// });

document.querySelectorAll('.flip-link').forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      const modalWrapper = document.querySelector('.card');
      // Toggle the flipped class to rotate the wrapper
      modalWrapper.classList.toggle('flipped');
      const loginModal = document.querySelector('.modal.login');
      const registerModal = document.querySelector('.modal.register');
      // Switch active class between modals
      if (loginModal.classList.contains('active')) {
        loginModal.classList.remove('active');
        registerModal.classList.add('active');
      } else {
        registerModal.classList.remove('active');
        loginModal.classList.add('active');
      }
    });
});
