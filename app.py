from bson import json_util
from flask import Flask, render_template, jsonify, request, session, redirect, url_for

app = Flask(__name__)
app.secret_key = 'super secret key'     # 세션 때문에 있는 건데 아무키나 넣어도 괜찮습니다

from pymongo import MongoClient
# client = MongoClient('mongodb://test:test@localhost', 27017)  # id:password
client = MongoClient('localhost', 27017)
db = client.makingproject

from bson.objectid import ObjectId  # mongodb object id 값 갖고오기
import json # dict타입을 json으로 변환하기 위한 라이브러리


## HTML 화면 보여주기
@app.route('/')
def homework():
    return render_template('/home/index.html')

@app.route('/playlist')
def playlist():
    return render_template('/playlist/playlist.html')

# 플레이리스트 1개의 상세 목록보기(Read) API
@app.route('/getPlaylist', methods=['GET'])
def view_playlist():
    id_receive = request.args.get('id_give')
    print('id_receive:', id_receive)

    playlist_dict = db.playlists.find_one({'_id': ObjectId(id_receive)})
    playlist_json = parse_json(playlist_dict)
    return playlist_json

# dict를 json으로 바꿔주는 함수
def parse_json(data):
    return json.loads(json_util.dumps(data))

# The web framework gets post_id from the URL and passes it as a string
def get(post_id):
    # Convert from string to ObjectId:
    document = client.db.collection.find_one({'_id':ObjectId(post_id)})

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


'''
# 주문하기(POST) API
@app.route('/order', methods=['POST'])
def save_order():
    name_receive = request.form['name_give']
    count_receive = request.form['count_give']
    address_receive = request.form['address_give']
    phone_receive = request.form['phone_give']

    doc = {
        'name': name_receive,
        'count': count_receive,
        'address': address_receive,
        'phone': phone_receive
    }
    db.orders.insert_one(doc)

    return jsonify({'result': 'success', 'msg': '주문 완료!'})


# 주문 목록보기(Read) API
@app.route('/order', methods=['GET'])
def view_orders():
    orders = list(db.orders.find({}, {'_id': False}))
    return jsonify({'result': 'success', 'orders': orders})

'''
if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
