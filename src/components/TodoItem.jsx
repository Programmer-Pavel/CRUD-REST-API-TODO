import React from 'react';
import {
  Checkbox,
  IconButton, List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
} from '@material-ui/core';
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';

const TodoItem = ({
  todos,
  editTodo,
  setTodoEditing,
  editingText,
  setEditingText,
  todoEditing,
  onFocus,
  onRemove,
  toggleHandler,
}) => (
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
);

export default TodoItem;
