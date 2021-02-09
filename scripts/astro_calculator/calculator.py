from tokenize import String
from redis.client import PubSub
from skyfield import data
from skyfield.api import Star, load, E, S, N, W, wgs84
from skyfield.data import hipparcos
from random import random
import sys, time, redis, json, pdb


# python3 calculator.py <latitude [float]> <longitude [float]> <object [json]> <execution time [int|seconds]>
lat = float(sys.argv[1])
long = float(sys.argv[2])
object = json.loads(sys.argv[3])
executionTime = int(sys.argv[4])

# setting up redis
redis = redis.Redis(host="localhost", port=6379)
pubsub = redis.pubsub(ignore_subscribe_messages=True)
pubsub.subscribe("astro_calculator")

# loading all nedeed info for astro calculations
timescale = load.timescale()
planets = load("de421.bsp")
with load.open("hip_main.dat") as f:
    stars = hipparcos.load_dataframe(f)

if object["type"] == "star":
    trackedObject = Star.from_dataframe(stars.loc[int(object["id"])])
elif object["type"] == "planet":
    trackedObject = planets[object["id"]]

earth = planets["earth"]
place = earth + wgs84.latlon(lat * N, long * E)

# main loop that transmits data to arduino serial port
while True:
    message = pubsub.get_message()
    if message:
        if (message["data"].decode("utf-8")) == "stop":
            print("Execution stopped with redis message from server")
            break

    currentTime = timescale.now()
    astrometric = place.at(currentTime).observe(trackedObject)
    ha, dec, distance = astrometric.apparent().hadec()
    time2 = timescale.now()
    print(
        str(ha)
        + "  "
        + str(dec)
        + " calculation time: "
        + str((time2 - currentTime) * 1000),
        end="\r",
    )
    redis.publish("serial-port", {"n": "moveTo", "p": {"ha": ha, "dec": dec}})
    time.sleep(0.5)
