from flask import Flask, request
from flask_restful import Api
from flask_cors import CORS, cross_origin
import socket
import json
app = Flask(__name__)
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"
api = Api(app)

"""

echo '{"method":"setPilot","env":"pro","params":{"mac":"d8a0113a94b6","src":"","dimming":100,"rssi":-62,"state":false,"r":255,"g":0,"b":0,"c":0,"w":15}}' | nc -u 192.168.1.14 38899


"""


@app.route("/lights", methods=["POST"])
@cross_origin()
def lights():
    """
    state: bool on/off
    d: dimming
    r: red
    g: green
    b: blue
    c: unclear
    w: unclear

    """

    # [macIP, IP, port]
    lights = [
        ["d8a0113a94b6", "192.168.1.14", "38899"],
        ["d8a0113a94ec", "192.168.1.68", "38899"],
        ["d8a011c3f7f5", "192.168.1.193", "38899"]
    ]

    state = request.form.get("state")
    d = request.form.get("d")
    r = request.form.get("r")
    g = request.form.get("g")
    b = request.form.get("b")
    c = request.form.get("c")
    w = request.form.get("w")

    #print(d, r, g, b, c, w)

    def construct_data(light):
        DATA = json.loads(
            '{"method":"setPilot","env":"pro","params":{"mac":"","src":"","dimming":0,"rssi":-62,"state":"","r":0,"g":0,"b":0,"c":0,"w":0}}')

        DATA["params"]["mac"] = light[0]
        DATA["params"]["dimming"] = int(d)
        DATA["params"]["state"] = bool(state == "true")
        DATA["params"]["r"] = int(r)
        DATA["params"]["g"] = int(g)
        DATA["params"]["b"] = int(b)
        DATA["params"]["c"] = int(c)
        DATA["params"]["w"] = int(w)

        return json.dumps(DATA)

    # start lights
    for light in lights:

        DATA = construct_data(light)

        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.sendto(bytes(str(DATA), "utf-8"), (light[1], int(light[2])))

    return{"data": "HELLO WORLD!"}, 200


if __name__ == "__main__":
    app.run(host="0.0.0.0")
