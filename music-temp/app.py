from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from pymongo import MongoClient

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('search.html')
  
@app.route('/addMusic', methods=["POST"])
def addMusic():
    title_receive = request.form['title_give']
    artist_receive = request.form['artist_give']
    doc: {
        'music_title': title_receive,
        'music_artist': artist_receive
    }
    
    # 검색조건이 있기 때문에 id가 sampleID인 collection에만 저장됩니다
    db.playlists.update_one({'user_id': "sampleID"}, {'$push': {'playlist_music': {'music_title': title_receive, 'music_artist': artist_receive}}});
    return jsonify({'msg': '추가했습니당'})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
