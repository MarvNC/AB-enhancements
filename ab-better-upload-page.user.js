// ==UserScript==
// @name        AB Better Upload Page
// @namespace   https://github.com/MarvNC
// @match       https://animebytes.tv/upload.php
// @version     1.0.1
// @author      Marv
// @description Improves styling and functionality of the AB upload page
// @grant       GM_addStyle
// ==/UserScript==

const EXCLUDE_OPTIONS = ['', '---'];

const ADD_CSS = /* css */ `
/* Checkbox bigger */
input[type="checkbox"] {
  width: 2rem;
  height: 2rem;
}
input[type="checkbox"]:hover {
  cursor: pointer;
}

/* Input Box taller */
input[type="text"] {
  height: 1.5rem;
  padding: 0.25rem;
  font-size: 1rem;
}

/* checkbox flex div */
.checkbox-flex-div {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Buttons */
input[type="button"],input[type="submit"] {
  background: #555;
  font-weight: bold;
}

/* File selector */
input[type="file"] {
  padding: 12px 20px;
  font-size: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  cursor: pointer;
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

input[type="file"]:hover {
  border-color: #888;
  background-color: #e8e8e8;
}

input[type="file"]:focus {
  outline: none;
  border-color: #666;
  background-color: #fff;
}

input[type="file"]::file-selector-button {
  font-weight: bold;
  color: #fff;
  background-color: #555;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  margin-right: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

input[type="file"]::file-selector-button:hover {
  background-color: #555;
}

input[type="file"]:drop {
  border-color: #4caf50;
  background-color: #e8f5e9;
}

/* Container styles */
.chip-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

/* Chip styles */
.chip {
  background-color: white;
  border-radius: 12px;
  padding: 6px 12px;
  font-size: 12px;
  color: #555;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: 1px solid #ccc;
  text-align: center;
  font-weight: 600;
}

/* Hover effect */
.chip:hover {
  background-color: #eeeeee;
}

/* Selected chip */
.chip.selected {
  background-color: #555;
  color: white;
}
`;

(() => {
  GM_addStyle(ADD_CSS);

  fixCheckboxStyles();
  convertSelectsToInputChips();
})();

/**
 * Converts the selects to input chips by hiding the select and adding a chip for each option that is selected
 */
function convertSelectsToInputChips() {
  const selects = [...document.querySelectorAll('select')];
  for (const select of selects) {
    select.style.display = 'none';

    const parent = select.parentElement;
    const chipContainer = document.createElement('div');
    chipContainer.className = 'chip-container';
    parent.prepend(chipContainer);

    const options = [...select.options];
    for (const option of options) {
      if (EXCLUDE_OPTIONS.includes(option.textContent)) {
        continue;
      }
      const chip = document.createElement('div');
      chip.className = 'chip';
      chip.textContent = option.textContent;

      chip.addEventListener('click', () => {
        option.selected = !option.selected;
        select.onchange();
        chip.classList.toggle('selected');
        const otherChips = [...chipContainer.querySelectorAll('.chip')];
        for (const otherChip of otherChips) {
          if (otherChip !== chip) {
            otherChip.classList.remove('selected');
          }
        }
      });

      chipContainer.appendChild(chip);
    }
  }
}

/**
 * Fixes the vertical centering of the text nodes after the checkboxes and makes the whole div clickable
 */
function fixCheckboxStyles() {
  const checkboxes = [...document.querySelectorAll('input[type="checkbox"]')];
  for (const checkbox of checkboxes) {
    const parentDD = checkbox.parentElement;
    const stuffToCenter = [...parentDD.childNodes].filter(
      (el) => el.tagName !== 'DIV'
    );
    // Put it in a flex div and center it vertically
    const flexDiv = document.createElement('div');
    flexDiv.className = 'checkbox-flex-div';
    for (const el of stuffToCenter) {
      flexDiv.appendChild(el);
    }
    // Append at the front of the parent
    parentDD.prepend(flexDiv);

    flexDiv.addEventListener('click', (event) => {
      if (event.target !== checkbox) {
        checkbox.click();
      }
    });
  }
}
