/* eslint-disable no-console */
window.loadUi = async function loadUi(data) {
  const ANSWERS_KEY = 'answers';
  const htmlString = await fetch('ui/index.html').then(res => res.text());
  const newDoc = new DOMParser().parseFromString(htmlString, 'text/html');
  document.body = newDoc ? newDoc.body : undefined;
  document.head.append(...newDoc.head.childNodes);

  console.log('preview: running user-ui');

  const botUi = (window.botUi = window.BotUi('#bot-ui', {
    debug: true,
    updateInterval: 1000,
    bots: data,
    variableValues: {
      user: {
        firstName: 'Mehdi',
        lastName: 'Tirgar',
      },
      global: {
        campaign: 'Lawly',
        organization: {
          name: 'Hjärnfondenrande',
        },
      },
    },
    responses: getAnswers() || [],
  }));

  botUi.on('answersUpdated', storeAnswers);

  botUi.on('submit', () => {
    localStorage.removeItem(ANSWERS_KEY);
    alert('Vi fick din ansökan och nu sätter vi ihop ditt dokument.');
  });

  function storeAnswers() {
    const answers = botUi.actions.getAnswers();
    localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
  }

  function getAnswers() {
    return JSON.parse(localStorage.getItem(ANSWERS_KEY));
  }
};
