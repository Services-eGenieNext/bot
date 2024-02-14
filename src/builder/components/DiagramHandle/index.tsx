/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, memo, useMemo } from 'react';
import { Handle, HandleProps } from 'react-flow-renderer';
import clsx from 'clsx';
import { ArrowDownIcon } from 'shared/icons';
import { useEdgeById } from 'builder/hooks';
import { useStyles } from 'builder/components/DiagramHandle/styles';

export type DiagramHandleProps = HandleProps & {
  className?: string;
  blockId: string;
  disabled?: boolean;
};

const DiagramHandle: FC<DiagramHandleProps> = memo(props => {
  const { disabled, blockId, className, type, id, position, ...handleProps } =
    props;

  const classes = useStyles();
  const edge = useEdgeById(blockId, id);

  const arrowStyle = useMemo(() => {
    const backgroundColor = edge?.style?.stroke;

    if (!backgroundColor) {
      return;
    }

    return {
      backgroundColor,
      fill: '#fff',
      border: 'none',
    };
  }, [edge?.style?.stroke]);

  return (
    <>
      <Handle
        className={clsx(
          className,
          classes.handle,
          classes[position],
          disabled && classes.disabled,
        )}
        type={type}
        id={id}
        position={position}
        {...handleProps}
      />
      <ArrowDownIcon
        className={clsx(
          className,
          classes.handleIcon,
          classes[position],
          disabled && classes.disabled,
        )}
        style={arrowStyle}
      />
    </>
  );
});

DiagramHandle.displayName = 'DiagramHandle';
export default DiagramHandle;
