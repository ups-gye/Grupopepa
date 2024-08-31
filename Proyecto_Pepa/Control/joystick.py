from serial import Serial
from time import sleep
import pyautogui

try:
    arduino = Serial(port='COM3', baudrate=9600, timeout=1)
    sleep(2)         
except Exception as e:
    print(f"Error connecting to Arduino: {e}")
    exit()

def process_data(data_str):
    command_map = {
        "Forward": "up",
        "Back": "down",
        "Right": "right",
        "Left": "left",
        "Up": "space",  
        "Down": "down",  
        "Turn Right": "right",  
        "Turn Left": "left",  
        "Land": "enter",  
        "Fly": "space",  
        "Flip": "space"  
    }

    if data_str in command_map:
        pyautogui.press(command_map[data_str])


while True:
    try:
        if arduino.in_waiting > 0:  
            data = arduino.readline().decode().strip()
            if data:
                process_data(data)
        else:
            sleep(0.1)  
    except Exception as e:
        print(f"Error processing data: {e}")
        break
