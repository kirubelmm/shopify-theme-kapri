document.addEventListener('DOMContentLoaded', function() {
  const forms = document.querySelectorAll('form[id^="product-form"]');
  
  forms.forEach(function(form) {
    const addToCartButton = form.querySelector('.add-to-cart-button');
    let isSubmitting = false;

    // Handle radio button changes to update variant ID and check if all options are selected
    form.querySelectorAll('input[type="radio"]').forEach(function(radio) {
      radio.addEventListener('change', function() {
        updateVariantID(form);
        if (areAllOptionsSelected(form)) {
          autoSubmitForm(form);  // Optionally auto-submit
        }
      });
    });

    // Initialize the variant ID on page load
    initializeVariantSelection(form);

    // Attach AJAX functionality to the add-to-cart button
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      
      if (isSubmitting) return;  // Prevent multiple submissions
      isSubmitting = true;
      
      addToCartButton.disabled = true;
      
      // Get the selected variant ID
      const variantId = form.querySelector('.variant-id').value;
      
      // Ensure variant ID is valid
      if (!variantId) {
        console.error('No variant selected');
        addToCartButton.disabled = false;
        isSubmitting = false;
        return;
      }
      
      // Create the data object to send
      const data = {
        id: variantId,
        quantity: 1 // Changed to single item payload
      };

      // Make the AJAX request to add the product to the cart
      addToCartAjax(data, form, addToCartButton);
    });

    // Function to initialize and handle single-variant selection
    function initializeVariantSelection(form) {
      const variantsData = form.getAttribute('data-variants');
      let variants = [];

      try {
        const unescapedVariantsData = variantsData.replace(/&quot;/g, '"');
        variants = JSON.parse(unescapedVariantsData);
      } catch (error) {
        console.error('Failed to parse variant data:', error);
        return;
      }

      // If there's only one variant, auto-select it
      if (variants.length === 1) {
        const variant = variants[0];
        form.querySelectorAll('input[type="radio"]').forEach(function(radio) {
          if (radio.value === variant.options[0]) {
            radio.checked = true;
          }
        });
        updateVariantID(form);  // Automatically update variant ID
      } else {
        updateVariantID(form);  // Update variant ID for normal cases
      }
    }

    // Function to update the variant ID input based on selected options
    function updateVariantID(form) {
      const variantsData = form.getAttribute('data-variants');
      let variants = [];

      try {
        const unescapedVariantsData = variantsData.replace(/&quot;/g, '"');
        variants = JSON.parse(unescapedVariantsData);
      } catch (error) {
        console.error('Failed to parse variant data:', error);
        return;
      }

      const selectedOptions = Array.from(form.querySelectorAll('input[type="radio"]:checked')).map(input => input.value);
      const matchingVariant = variants.find(variant => 
        variant.options.every((option, index) => option === selectedOptions[index])
      );

      // Find the .variant-id element
      const variantIdInput = form.querySelector('.variant-id');
      
      // Check if the .variant-id element exists
      if (!variantIdInput) {
        console.error('No .variant-id input found in the form');
        return;
      }

      // Update the .variant-id value if a matching variant is found
      if (matchingVariant) {
        variantIdInput.value = matchingVariant.id;
      } else {
        variantIdInput.value = '';  // Clear variant if no match
      }
    }

    // Function to check if all options are selected
    function areAllOptionsSelected(form) {
      const totalOptions = form.querySelectorAll('.variation-group').length;
      const selectedOptions = form.querySelectorAll('input[type="radio"]:checked').length;
      return totalOptions === selectedOptions;
    }

    // Function to automatically submit the form once all options are selected
    function autoSubmitForm(form) {
      setTimeout(function() {
        const addToCartButton = form.querySelector('.add-to-cart-button');
        const variantId = form.querySelector('.variant-id').value;

        if (!variantId) {
          console.error('No variant selected');
          return;
        }

        const data = {
          id: variantId,
          quantity: 1
        };

        addToCartButton.disabled = true;

        fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(response => {
          if (!response.ok) {
            return response.json().then(err => { throw err; });
          }
          return response.json();
        })
        .then(data => {
          console.log('Product added to cart:', data);
          updateCartDrawer();
          window.dispatchEvent(new CustomEvent('toggle-cart'));
          resetForm(form);  // Reset form after successful add to cart
        })
        .catch(error => {
          console.error('Error adding to cart:', error);
          alert('There was an error adding the product to the cart. Please try again.');
        })
        .finally(() => {
          addToCartButton.disabled = false;
        });
      }, 300);  // Delay to allow for any visual feedback
    }

    // Helper function to handle the AJAX add-to-cart request
    function addToCartAjax(data, form, addToCartButton) {
      fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw err; });
        }
        return response.json();
      })
      .then(data => {
        console.log('Product added to cart:', data);
        updateCartDrawer();
        window.dispatchEvent(new CustomEvent('toggle-cart'));
        resetForm(form);  // Reset form after successful add to cart
      })
      .catch(error => {
        console.error('Error adding to cart:', error);
        alert('There was an error adding the product to the cart. Please try again.');
      })
      .finally(() => {
        addToCartButton.disabled = false;
        isSubmitting = false;  // Reset the isSubmitting flag
      });
    }

    // Function to reset the form (uncheck all radio inputs) only if more than 1 variant exists
    function resetForm(form) {
      const variantsData = form.getAttribute('data-variants');
      let variants = [];

      try {
        const unescapedVariantsData = variantsData.replace(/&quot;/g, '"');
        variants = JSON.parse(unescapedVariantsData);
      } catch (error) {
        console.error('Failed to parse variant data:', error);
        return;
      }

      // Remove the condition that only resets for multiple variants
      form.querySelectorAll('input[type="radio"]:checked').forEach(function(radio) {
        radio.checked = false;  // Uncheck all selected radio buttons
      });
      form.querySelector('.variant-id').value = '';  // Clear variant ID

      // Re-initialize the form after resetting
      initializeVariantSelection(form);
    }

    // Function to update the cart drawer without page reload
    function updateCartDrawer() {
      fetch(window.Shopify.routes.root + 'cart?view=cart-drawer')
      .then(response => response.text())
      .then(data => {
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(data, 'text/html');
        const newCartContent = newDoc.querySelector('[x-ref="cart_content"]');
        if (newCartContent) {
          document.querySelector('[x-ref="cart_content"]').innerHTML = newCartContent.innerHTML;
        }

        const cartItemCountElement = newDoc.querySelector('[data-cart-count]');
        if (cartItemCountElement) {
          const cartItemCount = cartItemCountElement.innerText;
          window.dispatchEvent(new CustomEvent('cart-updated', { detail: { itemCount: cartItemCount }}));
        }
      })
      .catch(error => {
        console.error('Error fetching cart drawer:', error);
      });
    }
  });
});
