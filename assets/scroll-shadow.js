
  
  document.addEventListener("DOMContentLoaded", function () {
    const stickyElement = document.getElementById("sticky-element");
  
    // Check the position of the element relative to the viewport
    function checkStickyPosition() {
      // Get the element's position relative to the viewport
      const rect = stickyElement.getBoundingClientRect();
      
      // Add shadow when the element reaches top-0 position
      if (rect.top <= 0) {
        stickyElement.classList.add("shadow-md");
      } else {
        stickyElement.classList.remove("shadow-md");
      }
    }
  
    // Listen for the scroll event and check position
    window.addEventListener("scroll", checkStickyPosition);
  
    // Initial check in case the element is already sticky
    checkStickyPosition();
  });
  
  