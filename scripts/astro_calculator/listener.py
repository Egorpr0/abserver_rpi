import json
import redis
import time
import skyfield
import requests
from skyfield.api import Loader
import pdb

# time.sleep(3)


def main():
    load = Loader(
        "~/Documents/projects/smart_telescope_rpi/scripts/astro_calculator"
    )  # TODO change file location in production/include necessary files with git
    planets = load("de421.bsp")
    earth = planets["earth"]

    # timeScale = load.timescale()
    # time = timeScale.now()
    # astrometric = earth.at(time).observe(mars)
    # ra, dec, distance = astrometric.radec()

    connection = redis.Redis(host="localhost", port=6379, db=1)
    PubSub = connection.pubsub(ignore_subscribe_messages=True)
    PubSub.subscribe("astro_calculator")

    print("Listener is running!")
    for message in PubSub.listen():
        print(message["data"])
        objectName = json.loads(message["data"])["object"]
        object = planets[objectName]

        timeScale = load.timescale()
        time = timeScale.now()

        astrometric = earth.at(time).observe(object)
        ra, dec, distance = astrometric.radec()
        data = (
            '{"ra": "'
            + str(ra)
            + '", "dec": "'
            + str(dec)
            + '", "distance": "'
            + str(distance)
            + '"}'
        )
        id = 0
        url = f"http://localhost:3000/api/v1/tasks/{id}/"
        requests.put(
            url, data={"ra": str(ra), "dec": str(dec)}
        )  # TODO add total time parameter


main()
