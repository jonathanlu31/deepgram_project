from sqlite3 import IntegrityError
from flask import Flask, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError
from flask_marshmallow import Marshmallow
from werkzeug.utils import secure_filename
from mutagen.wave import WAVE
from mutagen.mp3 import MP3
import datetime
import utils
import os

app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'db.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join(basedir, 'recordings')
db = SQLAlchemy(app)
ma = Marshmallow(app)

@app.route('/post', methods=["POST"])
def post_audio():
    if 'file' not in request.files:
        return 'No file attached', 400
    file = request.files['file']
    if file and utils.is_filetype_allowed(file.filename):
        secure_name = secure_filename(file.filename)
        file.save(get_filepath(secure_name))
        new_recording = Recording(file.filename, secure_name)
        db.session.add(new_recording)
        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            os.remove(get_filepath(secure_name))
            return "Can't save recording", 400
        return recording_schema.jsonify(new_recording)

@app.route('/download')
def download():
    filename = request.args.get('name')
    if not filename:
        return 'No file specified', 400
    secure_name = secure_filename(filename)
    return send_from_directory(app.config['UPLOAD_FOLDER'], secure_name)

@app.route('/list')
def list_files():
    query_params = request.args
    recording_query = Recording.query
    if 'maxduration' in query_params:
        recording_query = recording_query.filter(Recording.duration <= query_params.get('maxduration'))
    all_recordings = recording_query.all()
    result = recordings_schema.dump(all_recordings)
    return result

@app.route('/delete', methods=['DELETE'])
def delete():
    filename = request.args.get('name')
    if not filename:
        return 'No file specified', 400
    secure_name = secure_filename(filename)
    recording = Recording.query.filter_by(name=filename).first()
    if not recording:
        return "File doesn't exist", 404
    db.session.delete(recording)
    db.session.commit()
    os.remove(get_filepath(secure_name))
    return recording_schema.jsonify(recording)
    

@app.route('/info')
def get_metadata():
    filename = request.args.get('name')
    if not filename:
        return 'No file specified', 400
    recording = Recording.query.filter_by(name=filename).first()
    if not recording:
        return "File doesn't exist", 404
    return recording_schema.jsonify(recording)

class Recording(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True)
    duration = db.Column(db.Integer)
    upload_date = db.Column(db.Date)
    type = db.Column(db.String(3))

    def __init__(self, record_filename, secure_name):
        self.name = record_filename
        self.type = record_filename.rsplit('.', 1)[1].lower()
        if self.type == 'mp3':
            audio = MP3(get_filepath(secure_name))
        elif self.type == 'wav':
            audio = WAVE(get_filepath(secure_name))
        self.duration = int(audio.info.length)
        self.upload_date = datetime.datetime.now()

class RecordingSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'duration', 'upload_date', 'type')

recording_schema = RecordingSchema()
recordings_schema = RecordingSchema(many=True)

def get_filepath(filename):
    return os.path.join(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(port=8080, debug=True)