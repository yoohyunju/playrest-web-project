from flask import Flask, render_template, jsonify, request, session, redirect, url_for

app = Flask(__name__)
app.secret_key = 'super secret key'     # 세션 때문에 있는 건데 아무키나 넣어도 괜찮습니다

from pymongo import MongoClient

client = MongoClient('mongodb://test:test@localhost', 27017)  # id:password
# client = MongoClient('localhost', 27017)
db = client.makingproject


## HTML 화면 보여주기
@app.route('/')
def homework():
    return render_template('/home/index.html')

@app.route('/playlist')
def getPlaylist():
    return render_template('/playlist/playlist.html')


## 회원가입 (비밀번호 암호화해서 저장하는 걸로 나중에 바꾸기)
@app.route('/signup', methods=['GET','POST'])
def signup():
    if request.method == 'GET':
        return render_template('signUp/signUp.html')
    else:
        newid_receive = request.form['newid_give']
        newpw_receive = request.form['newpw_give']
        newname_receive = request.form['newname_give']

        userinfo = {
            'user_id': newid_receive,
            'user_pw': newpw_receive,
            'user_name': newname_receive,
            'user_like': []
        }

        if not (newid_receive and newpw_receive and newname_receive):
            return jsonify({'msg': '모두 입력해주세요'})
        else:
            db.users.insert_one(userinfo)
            return jsonify({'msg': '회원가입 완료'})

        
## 로그인 (세션에 남기는 기능은 추후 구현 예정 / 비밀번호 암호화 방식이면 나중에 변경 필요)
@app.route('/login', methods = ['GET','POST'])
def login():
    if request.method == 'GET':
        return render_template('/login/login.html')
    else:
        id_receive = request.form['id_give']
        pw_receive = request.form['pw_give']
        user = db.users.find_one({'user_id':id_receive, 'user_pw':pw_receive})

        if user is None:
            return jsonify({'msg': '로그인에 실패했습니다'})
        else:
            session['user_id'] = id_receive     # 세션에 id 저장
            return jsonify({'msg': '로그인에 성공했습니다'})      # 임의

## 로그아웃
@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for('homework'))    # 맨 위 homework 함수로 가게됩니다(임의)

## 노래검색하는 html
@app.route('/search')
def home():
    return render_template('/search/search.html')

## 노래 검색 및 db에 추가하는
@app.route('/addMusic', methods=["POST"])
def addMusic():
    title_receive = request.form['title_give']
    artist_receive = request.form['artist_give']
    doc: {
        'music_title': title_receive,
        'music_artist': artist_receive
    }

    # 검색조건이 있기 때문에 id가 sampleID인 collection에만 저장됩니다
    db.playlists.update_one({'user_id': "sampleID"}, {
        '$push': {'playlist_music': {'music_title': title_receive, 'music_artist': artist_receive}}});
    return jsonify({'msg': '추가했습니당'})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
