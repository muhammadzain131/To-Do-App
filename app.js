document.addEventListener('DOMContentLoaded', function () {
  var userInput = document.getElementById('userInput');
  var saveBtn = document.getElementById('saveBtn');
  var displayArea = document.getElementById('displayArea');
  var progressBar = document.getElementById('progressBar');
  var progressCounter = document.getElementById('progressCounter');

  var userData = JSON.parse(localStorage.getItem('userData')) || [];
  var editingIndex = null;

  renderData();

  userInput.addEventListener('input', function () {
    saveBtn.disabled = userInput.value.trim() === '';
  });

  saveBtn.addEventListener('click', function () {
    var inputValue = userInput.value.trim();
    if (!inputValue) return;

    if (editingIndex !== null) {
      userData[editingIndex] = inputValue;
      editingIndex = null;
      saveBtn.textContent = 'Save';
    } else {
      userData.push(inputValue);
    }

    localStorage.setItem('userData', JSON.stringify(userData));
    userInput.value = '';
    saveBtn.disabled = true;
    renderData();
  });

  userInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && userInput.value.trim() !== '') {
      saveBtn.click();
    }
  });

  function renderData() {
    displayArea.innerHTML = '';

    for (var i = 0; i < userData.length; i++) {
      (function (index) {
        var div = document.createElement('div');
        div.className = 'data-item';

        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'item-checkbox';

        var span = document.createElement('span');
        span.textContent = userData[index];

        var editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'edit-btn';
        editBtn.addEventListener('click', function () {
          userInput.value = userData[index];
          editingIndex = index;
          saveBtn.textContent = 'Update';
          saveBtn.disabled = false;
        });

        var deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', function () {
          userData.splice(index, 1);
          localStorage.setItem('userData', JSON.stringify(userData));
          renderData();
        });

        checkbox.addEventListener('change', function () {
          editBtn.disabled = checkbox.checked;
          updateProgress();
        });

        div.appendChild(checkbox);
        div.appendChild(span);
        div.appendChild(editBtn);
        div.appendChild(deleteBtn);
        displayArea.appendChild(div);
      })(i);
    }

    updateProgress();
  }

  function updateProgress() {
    var checkboxes = document.querySelectorAll('.data-item input[type="checkbox"]');
    var completed = 0;
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) completed++;
    }
    var total = userData.length;
    var percent = total > 0 ? (completed / total) * 100 : 0;
    progressBar.style.width = percent + '%';
    progressCounter.textContent = completed + ' / ' + total;
  }
});