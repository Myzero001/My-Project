import pandas as pd
import numpy as np
import os
from sqlalchemy import create_engine
from sklearn.ensemble import RandomForestClassifier

# ดึง path ของไฟล์ preproject.py
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  
csv_path = os.path.join(BASE_DIR, 'data', 'MML_data.csv')

def predict():
    engine = create_engine('mysql+pymysql://root:root@localhost:3306/gurucat')

    # ดึงข้อมูลล่าสุดจากแต่ละตาราง
    query_pulse = "SELECT Pulse FROM Pulse ORDER BY id DESC LIMIT 1"
    query_temp = "SELECT Temperature FROM Temp ORDER BY id DESC LIMIT 1"
    query_motion = "SELECT ActivityLevel FROM Motion ORDER BY id DESC LIMIT 1"

    pulse = pd.read_sql(query_pulse, con=engine).iloc[0]['Pulse']
    temp = pd.read_sql(query_temp, con=engine).iloc[0]['Temperature']
    activity = pd.read_sql(query_motion, con=engine).iloc[0]['ActivityLevel']

    # test data
    df_test = pd.DataFrame([{
        'Pulse': pulse,
        'Temperature': temp,
        'ActivityLevel': activity
    }])

    # train data
    df_train = pd.read_csv(csv_path)
    x_train = df_train.drop(columns=['Mood'])
    y_train = df_train['Mood']

    # train model
    model = RandomForestClassifier(n_estimators=10, max_depth=5, random_state=42)
    model.fit(x_train, y_train)
    y_pred = model.predict(df_test)[0]

    # insert into  Mood
    insert_query = """
        INSERT INTO Mood (PulseRate, Temperature, ActivityLevel, Mood, created_at)
        VALUES (%s, %s, %s, %s, CURRENT_TIMESTAMP)
    """
    conn = engine.raw_connection()
    cursor = conn.cursor()
    cursor.execute(insert_query, (pulse, temp, activity, y_pred))
    conn.commit()
    cursor.close()
    conn.close()

    # return {
    #     'PulseRate': pulse,
    #     'Temperature': temp,
    #     'ActivityLevel': activity,
    #     'Mood': y_pred,
    #     'status': 'inserted'
    # }
