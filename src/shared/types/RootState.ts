/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import { BotEditorState } from 'builder/features/state';
import { BotUiState } from 'user-ui/features/state';
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

/*
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
*/
export interface RootState {
  botEditor?: BotEditorState;
  botUi?: BotUiState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
