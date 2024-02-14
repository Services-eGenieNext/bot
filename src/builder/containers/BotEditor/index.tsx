/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReactFlowProvider } from 'react-flow-renderer';
import { useModuleContext } from 'shared/context';
import { useActionHandlers, useOptionsHandlers } from 'builder/hooks';
import { LayerPlusIcon, ProjectDiagramIcon, UserRobotIcon } from 'shared/icons';
import { actions } from 'builder/features/slice';
import { getBotsList, getSelectedBotId } from 'builder/features/selectors';
import ChapterButton from 'builder/components/ChapterButton';
import AddBlockButton from 'builder/components/AppBlockButton';
import FlowDiagram from 'builder/containers/FlowDiagram';
import SidePanel from 'builder/containers/SidePanel';
import { useStyles } from './styles';

const BotEditor: React.FC = () => {
  const classes = useStyles();
  useActionHandlers();
  useOptionsHandlers();

  return (
    <ReactFlowProvider>
      <div className={classes.root}>
        <SidePanel />
        <AddBlockButton />
        <main className={classes.main}>
          <FlowDiagram className={classes.diagram} />
          <Footer />
        </main>
      </div>
    </ReactFlowProvider>
  );
};

export default BotEditor;

const Footer: FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { emitter } = useModuleContext();
  const bots = useSelector(getBotsList);
  const selectedBotId = useSelector(getSelectedBotId);

  return (
    <div className={classes.diagramFooter}>
      {bots.map((bot, index) => (
        <ChapterButton
          className={classes.chapterButton}
          key={index}
          title={bot.name}
          icon={
            bot.type === 'side' ? <ProjectDiagramIcon /> : <UserRobotIcon />
          }
          active={bot.id === selectedBotId}
          onClick={() => dispatch(actions.setSelectedToBot(bot.id))}
        />
      ))}

      <ChapterButton
        variant={'add'}
        icon={<LayerPlusIcon />}
        onClick={() => emitter.emit('chapterAddClicked')}
      />
    </div>
  );
};
