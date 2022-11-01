def is_filetype_allowed(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ['wav', 'mp3']