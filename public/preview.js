/* eslint-disable no-console */

async function initialize() {
  const USER_UI = 'user-ui';
  const BUILDER = 'builder';
  const ACTIVE_KEY = 'activeApp';

  const location = window.location;
  const searchHash = [location.search, location.hash].join();

  if (searchHash.includes(BUILDER)) {
    localStorage.setItem(ACTIVE_KEY, BUILDER);
  } else if (searchHash.includes(USER_UI)) {
    localStorage.setItem(ACTIVE_KEY, USER_UI);
  }

  const branchApp = window.env.LAWLY_BRANCH === USER_UI ? USER_UI : BUILDER;
  const activeApp = localStorage.getItem(ACTIVE_KEY) || branchApp;
  localStorage.setItem(ACTIVE_KEY, activeApp);

  const match = searchHash.match(/gist=([^&,]+)/);
  const gistId = match && match[1];
  const gistUrl = gistId && `https://api.github.com/gists/${gistId}`;

  // const localUrl = activeApp === USER_UI ? 'ui/data.json' : 'builder/data.json';
  const localUrl = 'data.json';
  const gistData = await getJson(gistUrl);
  const projectData = await getJson(localUrl);
  const localStorageData = getLocalBots();

  let bots;

  if (gistData && gistData.files) {
    bots = JSON.parse(Object.values(gistData.files)[0].content);
    console.log(bots);
    console.info('loaded bot config from gist.');
  } else if (localStorageData) {
    bots = localStorageData;
    console.info('loaded bot config from localstorage.');
  } else if (projectData) {
    console.info('loaded bot config from project data.');
    bots = projectData;
  } else {
    console.warn('could not loaded bot config.');
  }

  try {
    if (activeApp === USER_UI) {
      await window.loadUi(bots);
    } else {
      await window.loadBuilder(bots);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  async function getJson(url) {
    if (!url) {
      return;
    }

    try {
      return await fetch(url).then(res => res.json());
    } catch (err) {
      console.log(`fetching ${url} failed.`);
    }
  }

  function getLocalBots() {
    try {
      const localBotsString = localStorage.getItem('bots');
      return JSON.parse(localBotsString);
    } catch (e) {
      /* ignore */
    }
  }
}

document.addEventListener('DOMContentLoaded', initialize);
