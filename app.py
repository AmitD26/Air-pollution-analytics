
import os
import pandas as pd
from flask import jsonify
from flask import *



app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/us_map', methods=["POST"])
def us_map():
    response = request.get_json()
    temp = df[df["year"] == int(response["year"])].groupby("State")[response["pollutant"]+ " AQI"].mean()
    temp = temp.reset_index()
    temp.to_dict()
    temp = temp.to_json()
    return jsonify(temp)


@app.after_request
def add_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    return response



if __name__ == "__main__":
    df = pd.read_csv("pollution.csv")
    app.run(debug=True)

