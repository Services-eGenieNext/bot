# Bot-Editor

The visual bot question flow builder and questioner user interface for the Lawly app.

## Usage

```html
<div id="root"></div>

<script>
  const options = {
    debug: true,
    updateInterval: 1000,
    globalVariables: ['date'],
    userVariables: ['firstName', 'lastName'],
    apiTemplates: [/* api template */],
    bots: [/* bot-config */],
  };
  
  const builder = BotBuilder('#root');
</script>

<!-- production: deploy from master branch -->
<script src="https://botcache.lawly.io/boteditor/master/latest/main.js"></script>

<!-- staging: deploy from develop branch -->
<script src="https://botcache.lawly.io/boteditor/develop/latest/main.js"></script>

<!-- local-dev: alternative deploy for develop branch  -->
<script src="https://bot-builder.levelste.ch/main.js"></script>
```

## API

### `BotBuilder(container, options)`

Render the Bot Builder inside container and return the instance.

### `BotUi(container, options)`

Render the Bot User UI inside container and return the instance.

**`container`**: a valid CSS selector for Bot Builder to mounted on.  
**`options`**: Options for Bot Builder instance

| Option          | Type          | Description                                                                                |
| --------------- | ------------- | ------------------------------------------------------------------------------------------ |
| debug           | boolean       | Enables debug logging                                                                      |
| bots            | Bot[]         | Set the bots when initializing bot editor ([example](public/data.json)) |
| apiTemplates    | ApiTemplate[] | Set the list of available api templates ([example](./public/builder/api-templates.json))     |
| updateInterval  | number        | Interval between update events in milliseconds                                             |
| globalVariables | string[]      | List of global variables                                                                   |
| userVariables   | string[]      | List of user variables                                                                     |

Example:

```js
const options = {
  debug: true,
  updateInterval: 1000,
};
const botBuilder = BotBuilder('#root', options);
```

#### `BotBuilder.on(eventType, eventHandler)`

Attach an event handler for bot builder events.

Example:

```js
function handleBlockUpdates(event) {
  saveUpdatedApi(event.botId, event.blocks);
}
botBuilder.on('blocksUpdate', handleBlockUpdates);
```

#### `BotBuilder.off(eventType, eventHandler)`

Removes an event handler.

Example:

```js
botBuilder.off('blocksUpdate', handleBlockUpdates);
```

#### `BotBuilder.trigger(actionType, actionData)`

```js
botBuilder.trigger('centerBlock', blockId);
```

#### `BotBuilder.destroy()`

Remove and unmount bot builder from DOM.

### Events:

| Event Types               | Example                                                           |
| ------------------------- | ----------------------------------------------------------------- |
| **`loaded`**              | `botBuilder.on('loaded', function () {})`                         |
| **`unloaded`**            | `botBuilder.on('unloaded', function () {})`                       |
| **`blockAdded`**          | `botBuilder.on('blockAdded', function ({botId, block}) {})`       |
| **`blockRemoved`**        | `botBuilder.on('blockRemoved', function ({ botId, blockId }) {})` |
| **`blocksUpdated`**       | `botBuilder.on('blocksUpdated', function ({ botId, blocks }) {})` |
| **`paragraphClicked`**    | `botBuilder.on('paragraphClicked', function (event) {})`          |
| **`paragraphAddClicked`** | `botBuilder.on('paragraphAddClicked', function () {})`            |
| **`chapterAddClicked`**   | `botBuilder.on('chapterAddClicked', function () {})`              |
| **`variablesUpdated`**    | `botBuilder.on('variablesUpdated', function (variables) {})`      |

### Actions:

| Action Types        | Example                                                                  |
| ------------------- | ------------------------------------------------------------------------ |
| **`setBlocks`**     | `botBuilder.trigger('setBot', bots)`                                     |
| **`getBlocks`**     | `botBuilder.trigger('getBots', function callback(bots) {})`              |
| **`centerBlock`**   | `botBuilder.trigger('centerBlock', blockId)`                             |
| **`setGlobalVars`** | `botBuilder.trigger('setGlobalVars', ['var1', ...])`                     |
| **`setUserVars`**   | `botBuilder.trigger('setUserVars', ['var1', ...])`                       |
| **`updateBlock`**   | `botBuilder.trigger('updateBlock', { id: 'blockId', paragraphs: [...]})` |

## Build and Run

### Running Project for Development

```
> yarn install
> yarn start
```

### Running Project for Deployment

```
> yarn install
> yarn build
```

## Project Structure

### `src/app/`

We use the container/component architecture. `containers/` contains React components which are connected to the redux store. `components/` contains stateless React components which depend on containers for data. Container components care about how things work, while components care about how things look. You can read more in the [article](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0).

### `src/`

The rest of the code for project that doesn't actually make your visible app but contains the features like creating redux store, translations, styles & themes, and your redux state types.

### `config/`

Configurations and helper utilities to testing and bundling the project is located in the folder. You should not need to change anything in this folder.

### `internals/`

Similar to config folder, it contains extra functionalities to help with development of the project.
It has two sub-folders `generators` and `testings`.

`generators` folder has the code to scaffold out new components, containers and routes. You can use generator using `yarn generate` and `yarn test:generate`.
`testing` contains mocks which Jest uses when testing your app, e.g. for images.

## Tech Stack

- Typescript
- ReactJS
- Redux
- React Flow (diagram library)
- Material UI (ui kit)
- Jest (unit testing)
- Code Style (Prettier and ESLint)
- Babel (standardizing javascript cross browsers, e.g. ie11)
- Webpack (bundling)
- Yarn (preferred package manager)
- Misc: JSS, i18next, stylelint, redux-toolkit, saga
