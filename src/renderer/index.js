const tabs = document.querySelectorAll('.tab-link');
const newNoteBtn = document.querySelector('#new-note-btn');
const resetBtn = document.querySelector('#reset-settings');
const saveBtn = document.querySelector('#save-settings');
let configSettings;

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    openTab(tab);
  });
});

newNoteBtn.addEventListener('click', handleCreateNote);
resetBtn.addEventListener('click', handleReset);
saveBtn.addEventListener('click', handleSave);

document.querySelector('#default-tab').click();

window.bridge.configSettings((e, settings) => {
  configSettings = settings;
  loadSettingsUI();
});

function openTab(tab) {
  const tabId = tab.dataset.tabId;
  const content = document.querySelector(`#${tabId}`);
  const tabsContent = document.querySelectorAll('.tab-content');

  tabsContent.forEach((content) => {
    content.style.display = 'none';
  });

  tabs.forEach((link) => {
    link.classList.remove('active');
  });

  tab.classList.add('active');
  content.style.display = 'block';
}

function handleCreateNote() {
  const options = {
    width: 300,
    height: 300,
  };
  window.electronAPI.createNote(options);
}

function handleReset() {
  configSettings = {
    darkMode: 'light',
    primaryColor: '#42a5f5',
  };

  resetSettingsUI();

  window.electronAPI.saveConfigSettings(configSettings);
}

function resetSettingsUI() {
  const body = document.querySelector('body');
  const lightMode = document.querySelector('#light-mode');
  const primaryColor = document.querySelector('#primary-color');

  body.classList.remove('dark');
  lightMode.checked = true;
  document.documentElement.style.setProperty('--color-primary', '#42a5f5');
  primaryColor.value = '#42a5f5';
}

function handleSave() {
  const darkMode = document.querySelector('input[name="dark-mode"]:checked').value;
  const primaryColor = document.querySelector('#primary-color').value;

  configSettings.darkMode = darkMode;
  configSettings.primaryColor = primaryColor;

  saveSettingsUI();

  window.electronAPI.saveConfigSettings(configSettings);
}

function saveSettingsUI() {
  const body = document.querySelector('body');
  const darkMode = document.querySelector('input[name="dark-mode"]:checked').value;
  const primaryColorPicker = document.querySelector('#primary-color');
  const primaryColor = primaryColorPicker.value;

  if (darkMode === 'dark') {
    body.classList.add('dark');
  } else {
    body.classList.remove('dark');
  }

  document.documentElement.style.setProperty('--color-primary', primaryColor);
  primaryColorPicker.value = primaryColor;
}

function loadSettingsUI() {
  const { darkMode, primaryColor } = configSettings;
  const darkModeBtn = document.querySelector('#dark-mode');
  const primaryColorPicker = document.querySelector('#primary-color');

  if (darkMode === 'dark') {
    const body = document.querySelector('body');
    body.classList.add(darkMode);
    darkModeBtn.checked = true;
  }

  if (!primaryColor) {
    primaryColorPicker.value = '#42a5f5';
  } else {
    document.documentElement.style.setProperty('--color-primary', primaryColor);
    primaryColorPicker.value = primaryColor;
  }
}
