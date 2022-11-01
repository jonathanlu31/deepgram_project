import { TableBody, TableCell, TableHead, TableRow, Table, TableContainer, Paper } from '@mui/material';
import React from 'react';
import Recording from './Recording.react';

const RecordingList = ({ recordings, setRecordings }) => {
  return (
    <TableContainer component={Paper} elevation={3}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Recording Name</TableCell>
            <TableCell>Duration (sec)</TableCell>
            <TableCell>Date Uploaded</TableCell>
            <TableCell>Download</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {recordings.map((recording) => (
            <Recording recording={recording} key={recording.id} setRecordings={setRecordings} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RecordingList;
