from flask import Flask, render_template, jsonify
import requests
import time

app = Flask(__name__)

# Function to fetch ISS position
def get_iss_position():
    response = requests.get("http://api.open-notify.org/iss-now.json")
    if response.status_code == 200:
        return response.json()
    else:
        print("Unable to retrieve ISS position")
        return None

# Route to serve the HTML page
@app.route('/')
def index():
    return render_template('index.html')

# Route to serve the initial ISS position data
@app.route('/initial_iss_position')
def initial_iss_position():
    iss_data = get_iss_position()
    return jsonify(iss_data)

@app.route('/iss_position')
def iss_position():
    time.sleep(5)
    iss_data = get_iss_position()
    return iss_data


if __name__ == '__main__':
    app.run(debug=True)
