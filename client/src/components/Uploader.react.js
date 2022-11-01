import { Button, Typography } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import React, { useState } from 'react';
import { Container } from '@mui/system';

const Uploader = ({ setRecordings }) => {
  const [file, setFile] = useState(null);
  let onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/post', {
      method: 'POST',
      body: formData,
    });
    let resJson = await res.json();
    if (res.status === 200) {
      setRecordings((recList) => [resJson, ...recList]);
    } else {
      alert('An error occured, status ' + res.status);
    }
  };

  return (
    <form method="post" onSubmit={onSubmit}>
      <Container sx={{ display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }} disableGutters={true}>
        <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }} disableGutters={true}>
          <Button variant="contained" endIcon={<FileUploadIcon />} sx={{ marginRight: '8px' }} component="label">
            Upload
            <input hidden accept="audio/*" type="file" name="file" onChange={(e) => setFile(e.target.files[0])} />
          </Button>
          {file && <Typography>{file.name}</Typography>}
        </Container>
        <Button variant="contained" component="label">
          Submit
          <input hidden type="submit" />
        </Button>
      </Container>
    </form>
  );
};

export default Uploader;
