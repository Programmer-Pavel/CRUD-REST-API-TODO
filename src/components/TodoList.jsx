import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import TodoItem from './TodoItem';

const useStyles = makeStyles({
  header: {
    display: 'flex',
    alignItems: 'stretch',
  },
  btn: {
    width: 100,
  },
  input: {
    marginRight: 10,
    width: 500,
  },
});

const TodoList = ({
  setIsError,
  setErrorMessages,
  todos,
  setTodos,
}) => {
  const classes = useStyles();

  const [inp, setInp] = useState('');
  const [todoEditing, setTodoEditing] = React.useState(null);
  const [editingText, setEditingText] = React.useState('');

  const onRemove = async (id) => {
    const shouldRemove = window.confirm('A you really delete?');
    if (shouldRemove) {
      await axios.delete(`${process.env.REACT_APP_API_URL}/tasks/${id}`)
        .then(() => {
          setTodos((prev) => prev.filter((t) => t.id !== id));
        })
        .catch(() => {
          setErrorMessages(['Delete failed! Server error']);
          setIsError(true);
        });
    }
  };

  const onAdd = (input) => {
    const newTodo = {
      title: input,
      completed: false,
    };
    axios.post(`${process.env.REACT_APP_API_URL}/tasks`, newTodo)
      .then(() => {
        setTodos((prev) => [newTodo, ...prev]);
      })
      .catch(() => {
        setErrorMessages(['Cannot add data. Server error!']);
        setIsError(true);
      });
  };

  const inputHandler = (event) => {
    setInp(event.target.value);
  };

  const onKeyPress = (event) => {
    if (event.key === 'Enter') {
      onAdd(inp);
      setInp('');
    }
  };

  const addTask = () => {
    onAdd(inp);
    setInp('');
  };

  const toggleHandler = async (bool, id) => {
    await axios.patch(`${process.env.REACT_APP_API_URL}/tasks/${id}`, { completed: !bool })
      .then(() => {
        setTodos((prev) => prev.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              completed: !todo.completed,
            };
          }
          return todo;
        }));
      })
      .catch(() => {
        setErrorMessages(['Cannot toggle handler. Server error!']);
        setIsError(true);
      });
  };

  const editTodo = (event) => {
    if (event.key === 'Enter') {
      axios.patch(`${process.env.REACT_APP_API_URL}/tasks/${todoEditing}`, { title: editingText })
        .then(() => {
          const updatedTodos = [...todos].map((todo) => {
            if (todo.id === todoEditing) {
              // eslint-disable-next-line no-param-reassign
              todo.title = editingText;
            }
            return todo;
          });
          setTodos(updatedTodos);
          setTodoEditing(null);
          setEditingText('');
        })
        .catch(() => {
          setErrorMessages(['Cannot edit todo. Server error!']);
          setIsError(true);
        });
    }
  };

  const onFocus = () => {
    setTodoEditing(null);
    setEditingText('');
  };

  return (
    <>
      <div className={classes.header}>
        <TextField
          className={classes.input}
          label="Task"
          variant="outlined"
          value={inp}
          onChange={inputHandler}
          onKeyPress={onKeyPress}
        />
        <Button
          variant="outlined"
          color="inherit"
          className={classes.btn}
          onClick={addTask}
        >
          ADD
        </Button>
      </div>
      <TodoItem
        todos={todos}
        todoEditing={todoEditing}
        setTodoEditing={setTodoEditing}
        editingText={editingText}
        setEditingText={setEditingText}
        onFocus={onFocus}
        editTodo={editTodo}
        toggleHandler={toggleHandler}
        onRemove={onRemove}
        onAdd={onAdd}
      />
    </>
  );
};

export default TodoList;

TodoList.propTypes = {
  setIsError: PropTypes.func.isRequired,
  todos: PropTypes.instanceOf(Array).isRequired,
  setErrorMessages: PropTypes.func.isRequired,
  setTodos: PropTypes.func.isRequired,
};
