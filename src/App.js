import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import {
  Checkbox, IconButton, List,
  ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText,
  TextField,
} from '@material-ui/core';
import axios from 'axios';
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';

const useStyles = makeStyles({
  root: {
    maxWidth: 600,
    padding: 10,
  },
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

export default function App() {
  const classes = useStyles();

  const [todos, setTodos] = useState([]);
  const [inp, setInp] = useState('');
  const [todoEditing, setTodoEditing] = React.useState(null);
  const [editingText, setEditingText] = React.useState('');

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/tasks`);
      return res;
    }
    fetchData()
      .then((r) => setTodos(r.data));
  }, []);

  const onRemove = async (id) => {
    const shouldRemove = window.confirm('A you really delete?');
    if (shouldRemove) {
      setTodos((prev) => prev.filter((t) => t.id !== id));
      await axios.delete(`${process.env.REACT_APP_API_URL}/tasks/${id}`);
    }
  };

  const onAdd = (input) => {
    const newTodo = {
      title: input,
      completed: false,
    };
    setTodos((prev) => [newTodo, ...prev]);
    axios.post(`${process.env.REACT_APP_API_URL}/tasks`, newTodo);
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
    setTodos((prev) => prev.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: !todo.completed,
        };
      }
      return todo;
    }));
    await axios.patch(`${process.env.REACT_APP_API_URL}/tasks/${id}`, { completed: !bool });
  };

  const editTodo = (event) => {
    if (event.key === 'Enter') {
      axios.patch(`${process.env.REACT_APP_API_URL}/tasks/${todoEditing}`, { title: editingText });
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
    }
  };

  const onFocus = () => {
    setTodoEditing(null);
    setEditingText('');
  };

  return (
    <Card className={classes.root}>
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
      <List>
        {todos.map((value) => (
          <ListItem key={value.id} role={undefined} dense button>
            <ListItemIcon>
              <Checkbox
                checked={value.completed}
                onChange={() => toggleHandler(value.completed, value.id)}
              />
            </ListItemIcon>
            {
                  value.id === todoEditing
                    ? (
                      <TextField
                        value={editingText}
                        onKeyPress={editTodo}
                        onBlur={onFocus}
                        onChange={(e) => setEditingText(e.target.value)}
                      />
                    )
                    : (
                      <ListItemText
                        primary={`${value.title}`}
                        onClick={() => setTodoEditing(value.id)}
                      />
                    )
                }
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="comments" onClick={() => onRemove(value.id)}>
                <ClearOutlinedIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Card>
  );
}
