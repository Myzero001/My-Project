from flask import Blueprint, jsonify
import ML.preproject
from sqlalchemy import create_engine
import pandas as pd

main = Blueprint('main', __name__) #route name = main
engine = create_engine('mysql+pymysql://root:root@localhost:3306/gurucat')

@main.route('/', methods=['GET'])
def home ():
    # แปลง y_pred (ซึ่งเป็น numpy array) ให้เป็น list ก่อน
    # return jsonify({'predictions': y_pred.tolist()})
    return jsonify({'message': 'API is running'})

@main.route('/predict',methods=['POST'])
def predict():
    try:
        ML.preproject.predict() 
        return jsonify({'success': True, 'message': 'Prediction complete'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    

@main.route('/get-mood', methods=['GET'])
def get_mood():
    try:
        # ดึงแถวล่าสุดที่ Mood ไม่เป็น NULL
        query = """
            SELECT Mood 
            FROM Mood 
            ORDER BY id DESC 
            LIMIT 1
        """
        df = pd.read_sql(query, con=engine)

        if df.empty:
            return jsonify({'success': False, 'message': 'No predicted mood found'}), 404

        latest = df.iloc[0].to_dict()

        return jsonify({'success': True, 'Mood': latest})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@main.route('/get-pulse', methods=['GET'])
def get_pulse():
    try:
        # ดึงแถวล่าสุดที่ Mood ไม่เป็น NULL
        query = """
            SELECT Pulse , created_at
            FROM Pulse 
            ORDER BY id DESC 
            LIMIT 10
        """
        df = pd.read_sql(query, con=engine)

        if df.empty:
            return jsonify({'success': False, 'message': 'No Pulse Rate'}), 404

        df['created_at'] = df['created_at'].dt.time
        df['created_at'] = df['created_at'].apply(lambda t: t.strftime('%H:%M:%S'))
        result = df.to_dict(orient='records')

        return jsonify({'success': True, 'pulse_rate': result})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@main.route('/get-temp', methods=['GET'])
def get_temp():
    try:
        # ดึงแถวล่าสุดที่ Mood ไม่เป็น NULL
        query = """
            SELECT Temperature , created_at
            FROM Temp 
            ORDER BY id DESC 
            LIMIT 10
        """
        df = pd.read_sql(query, con=engine)

        if df.empty:
            return jsonify({'success': False, 'message': 'No Temperature'}), 404

        df['created_at'] = df['created_at'].dt.time
        df['created_at'] = df['created_at'].apply(lambda t: t.strftime('%H:%M:%S'))
        result = df.to_dict(orient='records')


        return jsonify({'success': True, 'temperature': result})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    
@main.route('/get-motion', methods=['GET'])
def get_motion():
    try:

        # ดึงแถวล่าสุดที่ Mood ไม่เป็น NULL
        query = """
            SELECT ActivityLevel , created_at
            FROM Motion 
            ORDER BY id DESC 
            LIMIT 10
        """
        df = pd.read_sql(query, con=engine)

        if df.empty:
            return jsonify({'success': False, 'message': 'No Motion'}), 404

        df['created_at'] = df['created_at'].dt.time
        df['created_at'] = df['created_at'].apply(lambda t: t.strftime('%H:%M:%S'))
        result = df.to_dict(orient='records')

        return jsonify({'success': True, 'activity_level': result})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500