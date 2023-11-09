/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';
import { useError } from '../../ErrorContext';

type Props = {
};

export const NotificationError: React.FC<Props> = () => {
  const { errorMessage, setErrorMessage } = useError();

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => (setErrorMessage(''))}
      />
      {errorMessage}
      <br />
    </div>
  );
};
