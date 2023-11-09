/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-cycle */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import './styles/todoapp.scss';
import { Header } from './Components/Header/Header';
import { Footer } from './Components/Footer/Footer';
import { NotificationError } from
  './Components/NotificationError/NotificationError';
import { Todo } from './types/Todo';
import { useTodo } from './TodoContext';
import { TodoList } from './Components/TodoList/TodoList';

const USER_ID = 11632;

export enum ErrorMessages {
  UnableToLoadTodos = 'Unable to load todos',
  TitleShouldNotBeEmpty = 'Title should not be empty',
  UnableToAddTodo = 'Unable to add a todo',
  UnableToDeleteTodo = 'Unable to delete a todo',
  UnableToUpdateTodo = 'Unable to update a todo',
}

export const App: React.FC = () => {
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const { loadTodos, todos, setTodos } = useTodo();

  useEffect(() => {
    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          USER_ID={USER_ID}
          todos={todos}
          setTodos={setTodos}
          setTempTodo={setTempTodo}
        />

        <TodoList
          tempTodo={tempTodo}
        />

        {todos.length !== 0 && (
          <Footer />
        )}

      </div>

      <NotificationError />

    </div>
  );
};
