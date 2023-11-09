/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable object-curly-newline */
/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-cycle */
import React, { useState } from "react";
import cn from "classnames";
import { Todo } from "../../types/Todo";
import { useTodo } from "../../TodoContext";
import { client } from "../../utils/fetchClient";
import { useError } from "../../ErrorContext";
import { ErrorMessages } from "../../App";

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { handlerRemoveTodo, loadingMap, todos, setTodos } = useTodo();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(todo.title);

  const { setErrorMessage } = useError();

  const handleUpdateCompleted = (todoId: number) => {
    setTodos(todos.map((t) => (t.id === todoId
      ? { ...t, completed: !t.completed } : t)));
  };

  const handlerOnCheck = async (todoId: number) => {
    setIsLoading(true);
    try {
      await client.patch(`/todos/${todoId}`, {
        completed: !todo.completed,
      });
      await handleUpdateCompleted(todoId); // Add 'await' here
    } catch (error) {
      console.error("error:", error);
      setErrorMessage(ErrorMessages.UnableToUpdateTodo);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTodo = (todoId: number, newTitle: string) => {
    const updatedCompletedTodos = todos.map(t => (t.id === todoId
      ? { ...t, title: newTitle } : t));

    setTodos(updatedCompletedTodos);
  };

  const updateTodo = async (todoId: number, title: string) => {
    if (todo.title !== updatedTitle) {
      setIsLoading(true);
      try {
        await client.patch(`/todos/${todoId}`, {
          title,
        });
        handleEditTodo(todo.id, updatedTitle);
      } catch (error) {
        console.error(error);
        setErrorMessage(ErrorMessages.UnableToUpdateTodo);
      } finally {
        setIsLoading(false);
        setIsEditing(false);
      }
    }
  };

  const handlerUpdatedSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateTodo(todo.id, updatedTitle);
  };

  const handlerOnBlur = () => {
    if (updatedTitle === '') {
      handlerRemoveTodo(todo.id);
    } else {
      updateTodo(todo.id, updatedTitle);
      setIsEditing(false);
    }
  };

  const handlerOnKeyup = (e: any) => {
    if (e.key === 'Escape') {
      setUpdatedTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    // todo.title && (
    <div
      // style={{ backgroundColor: "black" }}
      key={todo.id}
      data-cy="Todo"
      className={cn("todo", {
        "todo completed": todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          name="completedCheck"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => handlerOnCheck(todo.id)}
          checked={todo.completed}
        />
      </label>
      {(isEditing && !isLoading) ? (
        <form onSubmit={handlerUpdatedSubmit}>
          <input
            onKeyUp={handlerOnKeyup}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={updatedTitle}
            // onMouseLeave={() => updateTodo(todo.id, updatedTitle)}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            autoFocus
            onBlur={handlerOnBlur}
            spellCheck={false}
            disabled={isLoading}
          />
        </form>
      )
        : (
          <>
            <span
              onDoubleClick={() => setIsEditing(true)}
              data-cy="TodoTitle"
              className="todo__title"
            >
              {updatedTitle}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handlerRemoveTodo(todo.id)}
              disabled={isLoading}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={cn("modal overlay", {
          "is-active": loadingMap[todo.id] === true
            || isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
    // )

  );
};
