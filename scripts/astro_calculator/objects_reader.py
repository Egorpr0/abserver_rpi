from skyfield.data import hipparcos
from skyfield.api import load
from inspect import getmembers
import pdb

planets = load("de421.bsp")
with load.open("hip_main.dat") as f:
    stars = hipparcos.load_dataframe(f)
for planet in planets:
    print(planet)
pdb.set_trace()
data = {planets: planets, stars: stars}
print(data)