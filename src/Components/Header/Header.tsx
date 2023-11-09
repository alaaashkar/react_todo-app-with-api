/* eslint-disable no-console */
/* eslint-disable import/no-cycle */
/* eslint-disable jsx-a11y/no-autofocus */
import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { client } from '../../utils/fetchClient';
import { useError } from '../../ErrorContext';
import { ErrorMessages } from '../../App';

/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {
  todos: Todo[]
  setTodos: (value: Todo[]) => void
  setTempTodo: (value: Todo | null) => void
  USER_ID: number
};

export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  setTempTodo,
  USER_ID,
}) => {
  // const [newTodo, setNewTodo] = useState<Todo | null>(null);
  const [todoTitle, setTodoTitle] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { setErrorMessage } = useError();

  const isActiveTodos = todos.some(todo => !todo.completed);

  const inputRef = useRef<HTMLInputElement | null>(null); // used to handle HTML input elements

  const createTodo = async (title: string) => {
    setIsSubmitted(true);

    try {
      const tempTodo: Todo = {
        id: 0,
        userId: USER_ID,
        title,
        completed: false,
      };

      setTempTodo(tempTodo); // create a temporary todo and null it when the api call finishes

      const highestId = todos.reduce((maxId, obj) => {
        return Math.max(maxId, obj.id);
      }, -1); // to give a uniqueness to each todo

      const newTodo: Todo = await client.post('/todos', {
        id: highestId + 1,
        userId: USER_ID,
        title,
        completed: false,
      });

      setTodos([...todos, newTodo]); // update it on the interface
      setTodoTitle('');
    } catch (error) {
      console.error(error);
      setErrorMessage(ErrorMessages.UnableToAddTodo);
    } finally {
      setTempTodo(null); // removes the temporary todo
      setIsSubmitted(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handlerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (todoTitle.trim() !== '') {
      createTodo(todoTitle);
    } else {
      setErrorMessage(ErrorMessages.TitleShouldNotBeEmpty);
    }
  };

  useEffect(() => {
    // Set focus to the input element initially
    if (inputRef.current && !isSubmitted) {
      inputRef.current.focus();
    }
  }, [isSubmitted]); // makes the form 'onfocus' whenever it is not submiited

  return (
    <header className="todoapp__header">

      <button
        type="button"
        className={cn(
          'todoapp__toggle-all',
          {
            'todoapp__toggle-all active': !isActiveTodos,
          },
        )}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={handlerSubmit}
      >
        <input
          name="todoName"
          ref={inputRef}
          autoComplete="off"
          onChange={(e) => setTodoTitle(e.target.value)}
          value={todoTitle}
          data-cy="NewTodoField"
          type="text"
          disabled={isSubmitted}
          autoFocus
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
