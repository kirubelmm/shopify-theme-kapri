// --- global-scripts.js or theme.js ---
window.MyTheme = window.MyTheme || {};

window.MyTheme.initializeQuickAddForm = function (form) {
  if (!form || form.dataset.quickAddInitialized === 'true') return;

  const variantsJson = form.dataset.variants;
  const optionCountStr = form.dataset.optionCount;

  if (!variantsJson || !optionCountStr) {
    form.dataset.quickAddInitialized = 'true';
    return;
  }

  try {
    const variants = JSON.parse(variantsJson);
    const optionCount = parseInt(optionCountStr, 10);
    const variantInput = form.querySelector('.selected-variant-id');
    const variantOptions = form.querySelectorAll('.variant-option');

    if (!variantInput) {
      form.dataset.quickAddInitialized = 'true';
      return;
    }

    // Initialize empty state
    variantInput.value = '';
    variantOptions.forEach((input) => (input.checked = false));

    const updateVariant = () => {
      const selectedOptions = {};
      let selectedCount = 0;

      form.querySelectorAll('.variant-option-group').forEach((group) => {
        const position = group.dataset.optionPosition;
        const checkedInput = group.querySelector('input:checked');
        if (checkedInput) {
          selectedOptions[`option${position}`] = checkedInput.value;
          selectedCount++;
        }
      });

      if (selectedCount === optionCount) {
        const matchedVariant = variants.find((variant) =>
          Object.keys(selectedOptions).every((key) => variant[key] === selectedOptions[key])
        );
        variantInput.value = matchedVariant?.id || '';
      } else {
        variantInput.value = '';
      }
    };

    const resetForm = () => {
      variantOptions.forEach((input) => (input.checked = false));
      variantInput.value = '';
    };

    // Event listeners
    variantOptions.forEach((input) => {
      input.addEventListener('change', updateVariant);
      input.addEventListener('touchstart', updateVariant);
    });

    form.addEventListener('submit', (e) => {
      // Let the library handle the submission
      updateVariant();

      if (!variantInput.value) {
        e.preventDefault();
        return;
      }

      // Reset form after submission handling
      setTimeout(resetForm, 100); // Small delay to ensure library processes first
    });

    form.dataset.quickAddInitialized = 'true';
  } catch (error) {
    console.error('Quick add init error:', error);
    form.dataset.quickAddInitialized = 'true';
  }
};

// Rest of the code remains the same
window.MyTheme.initializeAllQuickAddForms = function (container = document) {
  const forms = container.querySelectorAll('.quick-add-form:not([data-quick-add-initialized="true"])');
  forms.forEach((form) => window.MyTheme.initializeQuickAddForm(form));
};

document.addEventListener('DOMContentLoaded', () => window.MyTheme.initializeAllQuickAddForms());
document.addEventListener('shopify:section:load', (e) => window.MyTheme.initializeAllQuickAddForms(e.target));
document.addEventListener('shopify:section:reorder', () => window.MyTheme.initializeAllQuickAddForms());
