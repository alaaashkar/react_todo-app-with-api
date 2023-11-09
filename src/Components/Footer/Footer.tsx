/* eslint-disable import/no-cycle */
import { useEffect, useState } from 'react';
import cn from 'classnames';
import { useTodo } from '../../TodoContext';

export const Footer = () => {
  const [filterOption, setFilterOption] = useState('all');
  const { todos, setFilteredTodos, handlerDeleteCompletedTodos } = useTodo();
  const completedTodos = todos.filter((todo) => todo.completed);

  useEffect(() => {
    if (filterOption === 'active') {
      setFilteredTodos(todos.filter((todo) => !todo.completed));
    } else if (filterOption === 'completed') {
      setFilteredTodos(todos.filter((todo) => todo.completed));
    } else {
      setFilteredTodos(todos);
    }
  }, [filterOption, todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.length - completedTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            'filter__link selected': filterOption === 'all',
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterOption('all')}
        >
          All
        </a>
        <a
          href="#/active"
          className={cn('filter__link', {
            'filter__link selected': filterOption === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterOption('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            'filter__link selected': filterOption === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterOption('completed')}
        >
          Completed
        </a>
      </nav>
      {completedTodos.length > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={() => handlerDeleteCompletedTodos(completedTodos)}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
