/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { ChangeEventHandler, FC, useMemo } from 'react';
import { ApiTemplate } from 'shared/types';
import SelectField from 'builder/components/SelectField';
import { useStyles } from '../../styles';

export type ApiTemplateSelectProps = {
  name: string;
  apiTemplates: Partial<ApiTemplate>[];
  templateId: string | undefined;
  onChange: ChangeEventHandler<{ value: ApiTemplate }>;
};

const ApiTemplateSelect: FC<ApiTemplateSelectProps> = props => {
  const classes = useStyles();
  const { name, apiTemplates, templateId, onChange } = props;

  const templateOptions = useMemo(
    () =>
      apiTemplates.map(t => ({
        label: t.label,
        value: t,
      })),
    [apiTemplates],
  );

  const selectedIndex = useMemo(
    () => apiTemplates.findIndex(t => t.id === templateId),
    [apiTemplates, templateId],
  );

  return (
    <SelectField
      className={classes.apiSelect}
      valueIndex={selectedIndex}
      name={name}
      onOptionChange={onChange}
      options={templateOptions}
      emptyLabel={'No template selected'}
    />
  );
};

export default ApiTemplateSelect;
