/* eslint-disable no-console */
/* eslint-disable import/no-cycle */
import React, { useContext, useState } from 'react';
import { client } from './utils/fetchClient';
import { Todo } from './types/Todo';
import { useError } from './ErrorContext';
import { ErrorMessages } from './App';
import { getTodos } from './api/todos';

const initialState: InitialStateType = {
  loadingMap: {},
  setLoadingMap: () => { },
  handlerRemoveTodo: async () => { },
  setTodos: () => { },
  todos: [],
  handlerDeleteCompletedTodos: async () => { },
  loadTodos: async () => { },
  setFilteredTodos: () => { },
  filteredTodos: [],
  isLoading: false,
  setIsLoading: () => { },
};

type InitialStateType = {
  loadingMap: { [todoId: number]: boolean },
  setLoadingMap: (prev: { [todoId: number]: boolean }) => void
  handlerRemoveTodo: (todoId: number) => Promise<void>,
  setTodos: (todos: Todo[]) => void,
  todos: Todo[],
  handlerDeleteCompletedTodos: (array: Todo[]) => void,
  loadTodos: () => void,
  setFilteredTodos: (value: Todo[]) => void,
  filteredTodos: Todo[],
  isLoading: boolean,
  setIsLoading: (value: boolean) => void
};

const TodoContext = React.createContext(initialState);

type Props = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [loadingMap, setLoadingMap] = useState<{
    [todoId: number]
    : boolean
  }
  >({});

  const [todos, setTodos] = useState<Todo[]>([]);
  const [, setDeletingTodos] = useState<number[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const { setErrorMessage } = useError();
  const [isLoading, setIsLoading] = useState(false);

  const handlerRemoveTodo = async (todoId: number) => {
    setLoadingMap({ [todoId]: true });
    try {
      await client.delete(`/todos/${todoId}`);
      setTodos(todos.filter((todo) => todo.id !== todoId));
    } catch {
      setErrorMessage(ErrorMessages.UnableToDeleteTodo);

      // setLoadingMap({});
    } finally {
      setLoadingMap({});
    }
  };

  // const completedTodos = todos.filter((todo) => todo.completed);

  const handlerDeleteCompletedTodos = async (todoArray: Todo[]) => {
    const newLoadingMap: { [id: number]: boolean } = {}; // we create empty object

    todoArray.forEach(todo => {
      newLoadingMap[todo.id] = true; // for each todo we add to the object id:true>>> {1:true, 4:true...etc}
    });

    setLoadingMap(newLoadingMap); // we save this object to this setter
    try {
      const deletedTodoIds = await Promise.all(

        todoArray.map(async (todo) => {
          await client.delete(`/todos/${todo.id}`); // wait till all the todos get deleted..then do that

          setDeletingTodos((prev) => [...prev, todo.id]);
          // Add the todos ids to a new array

          return todo.id; // for each successful iteration return the id of todo
        }),
      );

      setTodos(todos.filter((todo) => !deletedTodoIds.includes(todo.id))); // remove them from UI
    } catch (error) {
      setErrorMessage(ErrorMessages.UnableToDeleteTodo);
    } finally {
      setDeletingTodos([]); // Clear the deletingTodos list.

      setLoadingMap({});
    }
  };

  const loadTodos = async () => {
    setErrorMessage('');
    try {
      const loadedTodos = await getTodos(11632);

      setErrorMessage('');
      setTodos(loadedTodos);
    } catch (error) {
      setErrorMessage(ErrorMessages.UnableToLoadTodos);
      console.error('error:', error);
    }
  };

  const value = {
    setLoadingMap,
    loadingMap,
    handlerRemoveTodo,
    setTodos,
    todos,
    handlerDeleteCompletedTodos,
    loadTodos,
    setFilteredTodos,
    filteredTodos,
    isLoading,
    setIsLoading,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => useContext(TodoContext);
