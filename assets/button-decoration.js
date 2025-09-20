document.addEventListener('DOMContentLoaded', function() {
    const underlineLink = document.querySelector('.animate-underline-once');
    // Trigger the animation on page load by adding the class
    underlineLink.classList.add('play-animation');
    // Remove the class after the animation finishes (animation duration is 1s)
    setTimeout(() => {
      underlineLink.classList.remove('play-animation');
    }, 1100);
  });