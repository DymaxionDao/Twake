import { ChannelResource } from 'app/features/channels/types/channel';
import React from 'react';
import { ViewConfiguration } from '../../../features/router/services/app-view-service';
import { useTab } from '../../../features/tabs/hooks/use-tabs';
import TasksContent from './tasks-content';

type Props = {
  channel: ChannelResource;
  options: ViewConfiguration;
};

export default (props: Props) => {
  const tabId = props.options?.context?.tabId;
  const { tab, save } = useTab(tabId);

  return (
    <TasksContent
      options={props.options}
      tab={tab}
      channel={props.channel || {}}
      saveTab={(configuration: any) => {
        save({ ...tab, configuration });
      }}
    />
  );
};
