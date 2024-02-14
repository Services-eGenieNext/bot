/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC } from 'react';
import { Accordion } from 'react-bootstrap';
import { AccordionToggleProps } from 'react-bootstrap/AccordionToggle';

const AccordionToggle: FC<AccordionToggleProps & { disabled?: boolean }> =
  props => {
    const { disabled, children, className, ...rest } = props;
    return disabled ? (
      <div className={className}>{children}</div>
    ) : (
      <Accordion.Toggle className={className} {...rest}>
        {children}
      </Accordion.Toggle>
    );
  };

export default AccordionToggle;
