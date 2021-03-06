import React from 'react';
import axios from 'axios';
import './App.css';
import NavMenu from './NavMenu.js';

import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

// Icons
import DeleteIcon from '@material-ui/icons/Delete';

const useSemiPersistentState = (key, initState) => {
  const isMounted = React.useRef(false);

  const [value, setValue] = React.useState(
      localStorage.getItem(key) || initState
  );

  React.useEffect(() => {
    // Use ref.current to check if we're here because of first component render
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      localStorage.setItem(key, value);
    }
  }, [value, key]);

  return [value, setValue];
};

const getSumComments = (stories) => {
  return stories.data.reduce(
    (result, value) => result + value.num_comments,
    0
  );
};

// HackerNews
const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

function App() {
  // React.useReducer scaffolding
  const storiesReducer = (state, action) => {
    switch (action.type) {
      case "STORIES_FETCH_INIT":
        return {
          ...state,
          isLoading: true,
          isError: false
        };
      case "STORIES_FETCH_SUCCESS":
        return {
          ...state,
          data: action.payload,
          isLoading: false,
          isError: false
        };
      case "STORIES_FETCH_FAILURE":
        return {
          ...state,
          isLoading: false,
          isError: true
        };
      case "REMOVE_STORY":
        return {
          ...state,
          data: state.data.filter((story) => action.payload.objectID !== story.objectID)
        };
      default:
        throw new Error();
    }
  };

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );

  // Search stories and persist search term
  const [searchTerm, setSearchTerm] = useSemiPersistentState("searchTerm", "React");

  const [url, setUrl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`
  );

  const handleSearchInput = event => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = event => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);

    // Don't reload browser on submit
    event.preventDefault();
  };

  // Get async stories.
  // useCallback gets called when the searchTerm is modified
  const handleFetchStories = React.useCallback(() => {
    if (!url) return;

    dispatchStories({ type: "STORIES_FETCH_INIT" });

    axios.get(url)
      .then(result => {
        dispatchStories({
          type: "STORIES_FETCH_SUCCESS",
          payload: result.data.hits
        });
      })
      .catch(() => dispatchStories({ type: "STORIES_FETCH_FAILURE" }));
  }, [url]);

  // Gets called when searchTerm is modified
  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  // Create handler as callback with empty array deps so it won't be recreated on render
  // This helps .memo the unchanged List component between subsequent App renders
  const handleRemoveStory = React.useCallback((item) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item
    });
  }, []);

  // Simulate expensive computation
  // Use .memo to cache computation results; change only if stories change
  const sumComments = React.useMemo(() => { getSumComments(stories); }, [stories]);

  return (
    <>
    <NavMenu />
    <Container maxWidth="false">
      <div>
      <Typography variant="h1" component="h1">
        HN stories with {sumComments} comments.
      </Typography>
      </div>

      <SearchForm
        searchTerm={searchTerm}
        handleSearchInput={handleSearchInput}
        handleSearchSubmit={handleSearchSubmit}
      />

      <hr />

      { stories.isError && <p>Something went wrong...</p> }

      { stories.isLoading ? (
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <CircularProgress />
        </div>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      ) }
    </Container>
    </>
  );
}

const SearchForm = ({ searchTerm, handleSearchInput, handleSearchSubmit }) => (
  <form onSubmit={handleSearchSubmit}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      onInputChange={handleSearchInput}
    >
      <Typography>Search HN:</Typography>
    </InputWithLabel>

    <button
      type="submit"
      style={{display:"none"}}
    >
      Submit
    </button>
  </form>
);

const InputWithLabel = ({ id, type="text", value, onInputChange, children }) => (
    <>
      <TextField id="standard-basic" label={children} onChange={onInputChange} value={value} />
    </>
);

const List = React.memo(
  ({ list, onRemoveItem }) => list.length === 0 ? (<></>) : (
    <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell><Typography> Title </Typography></TableCell>
              <TableCell align="right"><Typography> Author </Typography></TableCell>
              <TableCell align="right"><Typography> Num Comments </Typography></TableCell>
              <TableCell align="right"><Typography> Points </Typography></TableCell>
              <TableCell align="right"><Typography> Remove </Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map(item => <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />)}
          </TableBody>
        </Table>
    </TableContainer>
  )
);

const Item = ({ item, onRemoveItem }) => {
  const handleRemoveItem = () => onRemoveItem(item);

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        <Typography>
          <a href={item.url} rel="noreferrer" target="_blank">{item.title}</a>
        </Typography>
      </TableCell>
      <TableCell align="right"><Typography> {item.author} </Typography></TableCell>
      <TableCell align="right"><Typography> {item.num_comments} </Typography></TableCell>
      <TableCell align="right"><Typography> {item.points} </Typography></TableCell>
      <TableCell align="right">
        <IconButton color="primary" aria-label="delete item" component="span" onClick={handleRemoveItem}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default App;
