import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import UserService from 'app/features/users/services/current-user-service';
import ChannelsService from 'app/deprecated/channels/channels.js';
import MenusManager from 'app/components/menus/menus-manager.js';
import UserCard from 'app/components/user-card/user-card';
import { UserType } from 'app/features/users/types/user';
import { useUser } from 'app/features/users/hooks/use-user';
import Collections from 'app/deprecated/CollectionsV1/Collections/Collections';

const channelMentions = ['channel', 'everyone', 'all', 'here'];

type PropsType = {
  // User id
  id: string;
  // user username
  username: string;
  // should we hide the user image?
  hideUserImage: boolean;
};

export default (props: PropsType): JSX.Element => {
  const collection = Collections.get('users');
  const nodeRef = useRef<HTMLDivElement>(null);
  const user = useUser(props.id);

  useEffect(() => {
    const listener = collection.addListener(useState, [user]);

    return () => {
      collection.removeListener(listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const displayUserCard = (user: UserType): void => {
    if (!nodeRef.current) {
      return;
    }

    MenusManager.openMenu(
      [
        {
          type: 'react-element',
          reactElement: () => (
            <UserCard user={user} onClick={() => ChannelsService.openDiscussion([user.id])} />
          ),
        },
      ],
      (window as any).getBoundingClientRect(nodeRef.current),
      null,
      { margin: 8 },
    );
  };

  const highlighted =
    props.id === UserService.getCurrentUserId() || channelMentions.includes(props.username);

  if (!props.id) {
    return <span className={classNames('user_twacode', { highlighted })}>@{props.username}</span>;
  }

  if (user) {
    return (
      <div
        ref={nodeRef}
        className={classNames('user_twacode with_user', {
          highlighted: highlighted && !props.hideUserImage,
        })}
        onClick={() => displayUserCard(user)}
        style={{
          paddingLeft: props.hideUserImage ? 5 : 0,
          backgroundColor: props.hideUserImage ? 'var(--grey-background)' : '',
        }}
      >
        {!props.hideUserImage && (
          <div
            className="userimage"
            style={{ backgroundImage: `url('${UserService.getThumbnail(user)}')` }}
          />
        )}
        {UserService.getFullName(user)}
      </div>
    );
  } else {
    return <span className={classNames('user_twacode', { highlighted })}>@{props.username}</span>;
  }
};
