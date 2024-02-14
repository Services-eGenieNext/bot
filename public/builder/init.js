/* eslint-disable no-console */
window.loadBuilder = async function loadBuilder(data) {
  const apiTemplates = await fetch('builder/api-templates.json').then(res =>
    res.json(),
  );

  const htmlString = await fetch('builder/index.html').then(res => res.text());
  const newDoc = new DOMParser().parseFromString(htmlString, 'text/html');
  document.body = newDoc.body;
  document.head.append(...newDoc.head.childNodes);

  console.log('preview: running builder');
  const builder = (window.botBuilder = window.BotBuilder('#bot-crud', {
    debug: true,
    updateInterval: 1000,
    globalVariables: ['date'],
    userVariables: ['firstName', 'lastName'],
    apiTemplates,
    bots: data,
  }));

  builder.on('blocksUpdated', storeBots);
  builder.on('blocksAdded', storeBots);
  builder.on('blocksRemoved', storeBots);

  function storeBots() {
    const bots = builder.actions.getBots();
    localStorage.setItem('bots', JSON.stringify(bots));
  }
};
