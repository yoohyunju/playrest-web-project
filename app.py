from flask import Flask, render_template, request, jsonify, session, redirect, url_for, flash
from pymongo import MongoClient
from datetime import timedelta

app = Flask(__name__)
app.secret_key = 'super secret key'
# app.config['SESSION_TYPE'] = 'filesystem'
# app.config["PERMANET_SESSION_LIFETIME"] = timedelta(minutes=1)


client = MongoClient('localhost', 27017)
db = client.makingproject


@app.route('/')
def homework():
    # user_id = session.get('user_id', None)
    # print(user_id)

    return render_template('index.html')


# @app.route('/signup', methods=['GET','POST'])
# def signup():
#     if request.method == 'GET':
#         return render_template('index.html')
#     else:
#         newid_receive = request.form['newid_give']
#         newpw_receive = request.form['newpw_give']
#         newname_receive = request.form['newname_give']
#
#         userinfo = {
#             'user_id': newid_receive,
#             'user_pw': newpw_receive,
#             'user_name': newname_receive,
#             'user_like': []
#         }
#
#         if not (newid_receive and newpw_receive and newname_receive):
#             return jsonify({'msg': '모두 입력해주세요'})
#         else:
#             db.users.insert_one(userinfo)
#             return jsonify({'msg': '회원가입 완료'})
#
# @app.route('/login', methods = ['GET','POST'])
# def login():
#     if request.method == 'GET':
#         return render_template("login.html")
#     else:
#         id_receive = request.form['id_give']
#         pw_receive = request.form['pw_give']
#         user = db.users.find_one({'user_id':id_receive, 'user_pw':pw_receive})
#
#         if user is None:
#             return '실패'
#             return jsonify({'msg': '로그인에 실패했습니다'})
#         else:
#             session['user_id'] = id_receive
#             return redirect(url_for('homework'))
#             return jsonify({'msg': '로그인에 성공했습니다'})
#
# @app.route("/logout")
# def logout():
#     session.clear()
#     return redirect(url_for('homework'))

@app.route('/playlist', methods=['GET'])
def playlist():
    show_stars()
    return render_template('search.html')


def show_stars():
    songs = list(db.playlists.find({}, {'_id': False}))
    print(songs)
    return '확인'


# @app.route('/addMusic', methods=["POST"])
# def addMusic():
#     title_receive = request.form['title_give']
#     artist_receive = request.form['artist_give']
#     doc: {
#         'music_title': title_receive,
#         'music_artist': artist_receive
#     }
#     db.playlists.update_one({'user_id': "sampleID"}, {'$push': {'playlist_music': {'music_title': title_receive, 'music_artist': artist_receive}}});
#     return jsonify({'msg': '추가했습니당'})
#
if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)