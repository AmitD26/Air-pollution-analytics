
import os
import pandas as pd
from flask import jsonify
from flask import *
from sklearn.decomposition import PCA
import numpy as np
from sklearn import preprocessing


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

@app.route('/overview_bar_chart')
def overview_bar_chart():
    pollutant = request.args.get("pollutant")
    #bar_chart = aqi_data_yearwise[aqi_data_yearwise.State == state][["Year", pollutant + " AQI"]]
    bar_chart = df.groupby("year")[pollutant+ " AQI"].mean()
    bar_chart = bar_chart.reset_index()
    return bar_chart.to_json(orient="records")


@app.route('/overview_line_chart')
def overview_line_chart():
    state = request.args.get("state")
    pollutant = request.args.get("pollutant")
    df_state = df[df["State"]==state]
    df_state = df_state[["year", pollutant + " AQI"]]
    df_state = df_state.groupby("year").mean()
    df_state = df_state.reset_index()
    print(df_state)
    return df_state.to_json(orient="records")


@app.route('/popn_US_map')
def popn_US_map():
    year = request.args.get("year")
    popn_US = deaths_data_states[deaths_data_states["Year"] == int(year)]
    popn_US = popn_US[["Area", "Population"]]
    popn_US = popn_US.rename({"Area": "State"}, axis="columns")
    popn_US = popn_US.reset_index()
    popn_US = popn_US[["State", "Population"]]
    print(popn_US)
    popn_US.to_dict()
    popn_US = popn_US.to_json()
    return jsonify(popn_US)

@app.route('/population_pollution_US_line_chart')
def population_pollution_US_line_chart():
    pollutant = request.args.get("pollutant")
    df_polln_US = df.groupby("year").mean().reset_index()
    df_polln_US = df_polln_US[["year", pollutant + " AQI"]]
    death1_yearwise = deaths_data_US[["Year", "Population"]]
    line_chart = pd.merge(df_polln_US, death1_yearwise, left_on="year", right_on="Year")
    print("line chart ********************************************")
    print(line_chart)
    return line_chart.to_json(orient="records")



@app.route('/deaths_pollution_US_line_chart')
def deaths_pollution_US_line_chart():
    pollutant = request.args.get("pollutant")
    df_polln_US = df.groupby("year").mean().reset_index()
    df_polln_US = df_polln_US[["year", pollutant + " AQI"]]
    death1_yearwise = deaths_data_US[["Year", "DeathCount"]]
    line_chart = pd.merge(df_polln_US, death1_yearwise, left_on="year", right_on="Year")
    print("line chart ********************************************")
    print(line_chart)
    return line_chart.to_json(orient="records")


@app.route('/deaths_US_map')
def deaths_US_map():
    year = request.args.get("year")
    deaths_US = deaths_data_states[deaths_data_states["Year"] == int(year)]
    deaths_US = deaths_US[["Area", "DeathCount"]]
    deaths_US = deaths_US.rename({"Area": "State"}, axis="columns")
    deaths_US = deaths_US.reset_index()
    deaths_US = deaths_US[["State", "DeathCount"]]
    print(deaths_US)
    deaths_US.to_dict()
    deaths_US = deaths_US.to_json()
    return jsonify(deaths_US)

@app.route('/population_pollution_states_line_chart')
def population_pollution_states_line_chart():
    state = request.args.get("state")
    pollutant = request.args.get("pollutant")
    df_state = df[df["State"] == state]
    df_state = df_state.groupby("year").mean().reset_index()
    df_state = df_state[["year", pollutant + " AQI"]]
    death_state = death_states[death_states["Area"] == state]
    death_state = death_state[["Year", "Population"]]
    line_chart = pd.merge(df_state, death_state, left_on="year", right_on="Year")
    print(death_state)
    print("line chart ********************************************")
    print(state)
    print(line_chart)
    return line_chart.to_json(orient="records")


@app.route('/deaths_pollution_states_line_chart')
def deaths_pollution_states_line_chart():
    state = request.args.get("state")
    pollutant = request.args.get("pollutant")
    df_state = df[df["State"] == state]
    df_state = df_state.groupby("year").mean().reset_index()
    df_state = df_state[["year", pollutant + " AQI"]]
    death_state = death_states[death_states["Area"] == state]
    death_state = death_state[["Year", "DeathCount"]]
    line_chart = pd.merge(df_state, death_state, left_on="year", right_on="Year")
    print(death_state)
    print("line chart ********************************************")
    print(state)
    print(line_chart)
    return line_chart.to_json(orient="records")

@app.route('/brush_chart')
def brush_chart():
    year = request.args.get("year")
    #pollutant = request.args.get("pollutant")
    temp = df[df["year"] == int(year)].groupby("State")["O3 AQI","NO2 AQI"].mean()
    temp = temp.reset_index()
    return temp.to_json(orient="records")



@app.route('/pca_scree_plot')
def pca_scree_plot():
    df_pca = df[["NO2 Mean", "NO2 AQI", "O3 Mean", "O3 AQI", "SO2 Mean", "SO2 AQI", "CO Mean", "CO AQI"]]
    df_pca['O3 Mean'] = df_pca['O3 Mean'].apply(lambda x: x * 1000)
    df_pca['CO Mean'] = df_pca['CO Mean'].apply(lambda x: x * 1000)

    pca = PCA()
    # print(normalize(df_pca))
    # pca.fit(normalize(df_pca))

    min_max_scaler = preprocessing.MinMaxScaler()
    df_pca = min_max_scaler.fit_transform(df_pca)
    print(df_pca)
    pca.fit(df_pca)

    scree_plot_data = [np.cumsum(pca.explained_variance_ratio_), pca.explained_variance_ratio_]
    labels = np.array([[1, 2, 3, 4, 5, 6, 7, 8]])
    scree_plot_data = np.concatenate((labels.T, np.array(scree_plot_data).T.tolist()), axis=1)
    return str(np.array(scree_plot_data).tolist())

@app.route('/pca_loadings')
def pca_loadings():
    df_pca = df[["NO2 Mean", "NO2 AQI", "O3 Mean", "O3 AQI", "SO2 Mean", "SO2 AQI", "CO Mean", "CO AQI"]]
    df_pca['O3 Mean'] = df_pca['O3 Mean'].apply(lambda x: x * 1000)
    df_pca['CO Mean'] = df_pca['CO Mean'].apply(lambda x: x * 1000)

    pca = PCA()
    # print(normalize(df_pca))
    # pca.fit(normalize(df_pca))

    min_max_scaler = preprocessing.MinMaxScaler()
    df_pca_norm = min_max_scaler.fit_transform(df_pca)
    pca.fit(df_pca_norm)
    squared_loadings = np.sqrt(np.add(np.square(pca.components_[0]), np.square(pca.components_[1], np.square(pca.components_[2]))))
    table = pd.DataFrame(np.append(np.array(df_pca.columns).reshape(8, 1), squared_loadings.reshape(8, 1), axis=1),
                 columns=["Attribute names", "Squared PCA loadings"])
    table = table.sort_values(by="Squared PCA loadings", ascending=False)
    table_html = table.to_html(classes=["table-bordered", "table-striped", "table-hover"])
    return table_html

if __name__ == "__main__":
    df = pd.read_csv("pollution.csv")
    deaths_data1 = pd.read_csv("USCS_TrendChart.csv")
    deaths_data_US = deaths_data1[["Area", "Year", "DeathCount", "Population"]]
    death_states = pd.read_csv("USCS_TrendMap_states.csv")
    deaths_data_states = death_states[["Area", "Year", "DeathCount", "Population"]]
    app.run(debug=True)

