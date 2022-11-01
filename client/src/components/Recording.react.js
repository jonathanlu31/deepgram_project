import { Button, TableCell, TableRow } from '@mui/material';
import React from 'react';
import download from 'downloadjs';

const Recording = ({ recording, setRecordings }) => {
  const { name, duration, upload_date } = recording;
  const downloadRecording = () => {
    fetch(`/download?name=${name}`)
      .then((res) => res.blob())
      .then((blob) => download(blob, name));
  };
  const deleteRecording = () => {
    fetch(`/delete?name=${name}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        setRecordings((recordings) => recordings.filter((record) => record.id !== data.id));
      });
  };
  return (
    <TableRow>
      <TableCell>{name}</TableCell>
      <TableCell>{duration}</TableCell>
      <TableCell>{upload_date}</TableCell>
      <TableCell>
        <Button variant="contained" onClick={downloadRecording}>
          Download
        </Button>
      </TableCell>
      <TableCell>
        <Button variant="contained" onClick={deleteRecording}>
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default Recording;
