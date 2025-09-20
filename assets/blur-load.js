document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.blur-up').forEach((el) => {
    const real = el.dataset.src;
    if (!real) return;

    if (el.tagName === 'IMG') {
      // Image handling remains unchanged
      const hd = new Image();
      hd.onload = () => {
        el.src = real;
        el.classList.add('loaded');
      };
      hd.src = real;
    } else if (el.tagName === 'VIDEO') {
      // ===== VIDEO OPTIMIZATION =====
      // Load HD poster first
      const posterLoader = new Image();

      // Fallback timeout if poster fails
      const blurTimeout = setTimeout(() => {
        el.classList.add('loaded');
      }, 2000);

      posterLoader.onload = () => {
        clearTimeout(blurTimeout);
        el.poster = real;
        el.classList.add('loaded');
      };

      posterLoader.onerror = () => {
        clearTimeout(blurTimeout);
        el.classList.add('loaded');
      };

      posterLoader.src = real;

      // Video autoplay setup
      const attemptPlay = () => {
        el.play()
          .then(() => {
            // Success - video playing
          })
          .catch(() => {
            // Silent fail - still show unblurred video
          });
      };

      // Wait for enough data to play
      el.addEventListener('loadeddata', attemptPlay);
      el.addEventListener('canplaythrough', attemptPlay);

      // Force load video
      el.preload = 'auto';
      el.load();
    }
  });
});
