import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import axios from 'axios';
import Alert from '@material-ui/lab/Alert';
import TodoList from './components/TodoList';

const useStyles = makeStyles({
  root: {
    maxWidth: 600,
    padding: 10,
  },
});

export default function App() {
  const classes = useStyles();

  const [todos, setTodos] = useState([]);
  const [isError, setIsError] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/tasks`);
      return res;
    }

    fetchData()
      .then((r) => setTodos(r.data))
      .catch(() => {
        console.log('Error');
      });
  }, []);

  return (
    <Card className={classes.root}>
      <div>
        {isError
                && (
                <Alert severity="error">
                  {errorMessages.map((msg) => <div key={msg}>{msg}</div>)}
                </Alert>
                )}
      </div>
      <TodoList
        todos={todos}
        setIsError={setIsError}
        setErrorMessages={setErrorMessages}
        setTodos={setTodos}
      />
    </Card>
  );
}
