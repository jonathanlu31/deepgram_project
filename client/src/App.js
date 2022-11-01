import { useState, useEffect } from 'react';
import RecordingList from './components/RecordingList.react';
import Uploader from './components/Uploader.react';
import { Paper } from '@mui/material';

function App() {
  const [recordings, setRecordings] = useState([]);

  useEffect(() => {
    fetch('/list')
      .then((res) => res.json())
      .then((data) => {
        setRecordings(data);
      });
  }, []);

  return (
    <Paper className="App" sx={{ padding: '1rem', width: '80%', margin: '0 auto' }} elevation={0}>
      <Uploader setRecordings={setRecordings} />
      <RecordingList recordings={recordings} setRecordings={setRecordings} />
    </Paper>
  );
}

export default App;
