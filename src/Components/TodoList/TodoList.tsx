/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-cycle */
import React from 'react';
import cn from 'classnames';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './TodoList.scss';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { useTodo } from '../../TodoContext';

type Props = {
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  tempTodo,
}) => {
  const { filteredTodos, todos } = useTodo();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>

        {filteredTodos.map((todo) => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem todo={todo} />

          </CSSTransition>
        ))}

        {tempTodo !== null && (
          <CSSTransition key={tempTodo.id} timeout={300} classNames="item">
            <div
              data-cy="Todo"
              className={cn('todo', { 'todo completed': tempTodo.completed })}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                <p>{tempTodo.title}</p>
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
              >
                ×
              </button>

              {/* 'is-active' class puts this modal on top of the todo */}
              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
