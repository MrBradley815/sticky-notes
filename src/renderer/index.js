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
    themeColor: '#42a5f5',
  };

  resetSettingsUI();

  window.electronAPI.saveConfigSettings(configSettings);
}

function resetSettingsUI() {
  const body = document.querySelector('body');
  const lightMode = document.querySelector('#light-mode');
  const themeColor = document.querySelector('#theme-color');

  body.classList.remove('dark');
  lightMode.checked = true;
  document.documentElement.style.setProperty('--color-primary', '#42a5f5');
  themeColor.value = '#42a5f5';
}

function handleSave() {
  const darkMode = document.querySelector('input[name="dark-mode"]:checked').value;
  const themeColor = document.querySelector('#theme-color').value;

  configSettings.darkMode = darkMode;
  configSettings.themeColor = themeColor;

  saveSettingsUI();

  window.electronAPI.saveConfigSettings(configSettings);
}

function saveSettingsUI() {
  const body = document.querySelector('body');
  const darkMode = document.querySelector('input[name="dark-mode"]:checked').value;
  const themeColorPicker = document.querySelector('#theme-color');
  const themeColor = themeColorPicker.value;

  if (darkMode === 'dark') {
    body.classList.add('dark');
  } else {
    body.classList.remove('dark');
  }

  document.documentElement.style.setProperty('--color-primary', themeColor);
  themeColorPicker.value = themeColor;
}

function loadSettingsUI() {
  const { darkMode, themeColor } = configSettings;
  const darkModeBtn = document.querySelector('#dark-mode');
  const themeColorPicker = document.querySelector('#theme-color');

  if (darkMode === 'dark') {
    const body = document.querySelector('body');
    body.classList.add(darkMode);
    darkModeBtn.checked = true;
  }

  if (!themeColor) {
    themeColorPicker.value = '#42a5f5';
  } else {
    document.documentElement.style.setProperty('--color-primary', themeColor);
    themeColorPicker.value = themeColor;
  }
}
