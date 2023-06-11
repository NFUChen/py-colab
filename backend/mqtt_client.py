from enum import IntEnum
from typing import Callable, List, Tuple, Union

import paho.mqtt.client as mqtt
from threading import Thread
import time
import os

class Client:
    pass


class UserData:
    pass


class Flags:
    pass


Message = str


class ReturnCode(IntEnum):
    '''
    0: Connection successful
    1: Connection refused : incorrect protocol version
    2: Connection refused : invalid client identifier
    3: Connection refused : server unavailable
    4: Connection refused : bad username or password
    5: Connection refused : not authorised
    6-255: Currently unused.

    '''
    CONNECTION_SUCCESSFUL = 0
    CONNECTION_REFUSED_INCORRECT_PROTOCOL_VERSION = 1
    CONNECTION_REFUSED_INVALID_CLIENT_IDENTIFIER = 2
    CONNECTION_REFUSED_SERVER_UNAVAILABLE = 3
    CONNECTION_REFUSED_BAD_USERNAME_OR_PASSWORD = 4
    CONNECTION_REFUSED_NOT_AUTHORIZED = 5


class QoS(IntEnum):
    '''
    Quality of Service, detailed information,
    please refer https://www.hivemq.com/blog/mqtt-essentials-part-6-mqtt-quality-of-service-levels/
    '''
    AT_MOST_ONCE = 0  # unsafest but quickest
    AT_LEASET_ONCE = 1
    EXACTLY_ONCE = 2  # safest but slowest


def default_on_connect(client, userdata, flags, return_code) -> None:
    msg = {
        0: "Connection successful",
        1: "Connection refused: incorrect protocol version",
        2: "Connection refused: invalid client identifier",
        3: "Connection refused: server unavailable",
        4: "Connection refused: bad username or password",
        5: "Connection refused: not authorised"
    }
    print(msg[return_code])
    return

def default_on_disconnect(client, userdata, return_code):
    if return_code != 0:
        
        print(f"Code: {return_code}, unexpected disconnection. Exited")
        os._exit(1) # help docker to restart container
    else :
        print("Disconnected successfully")


def default_on_message(client, userdata, message):
    print(f"message received: {str(message.payload.decode('utf-8'))}")
    print(f"message topic: {message.topic}")


QoSLevel = int
Topics = Union[str, Tuple[str, QoSLevel], List[Tuple[str, QoSLevel]]]

OnMessageCallable = Callable[
    [Client, UserData, Message],
    None
]
OnConnectCallable = Callable[
    [Client, UserData, Flags, ReturnCode],
    None
]

OnDisconnectCallable = Callable[
    [Client, UserData, Flags, ReturnCode],
    None
]


class Client:
    def __init__(self,
                 client_name: str,
                 broker_address: str,
                 topics_subscribed: Topics,
                 quality_of_sevice_level: QoSLevel = QoS.AT_LEASET_ONCE,
                 on_connect_callback: OnConnectCallable = default_on_connect,
                 on_message_callback: OnMessageCallable = default_on_message,
                 on_disconnect_callback: OnDisconnectCallable = default_on_disconnect 
                 ) -> None:
        self.MQTT_port = 1883
        self.client_name = client_name
        self.broker_address = broker_address
        self.topics_subscribed = topics_subscribed
        self.quality_of_service_level = quality_of_sevice_level

        self.mqtt_client = mqtt.Client(client_name)
        self.mqtt_client.on_connect = on_connect_callback
        self.mqtt_client.on_message = on_message_callback
        self.mqtt_client.on_disconnect = on_disconnect_callback

        self.__connect()
        self.__handle_connection_on_failure()

    def __connect(self) -> None:
        print(f"{self.client_name} connecting to {self.broker_address}...")
        self.mqtt_client.connect(self.broker_address, self.MQTT_port)

    def __exit_if_disconnected(self) -> None:
        time.sleep(5) # waiting 5 seconds to connect
        while (True):
            print("Checking connection...")
            if not self.mqtt_client.is_connected():
                print("Exited and restart")
                os._exit(1) # help docker to restart container
            time.sleep(1)


    def __handle_connection_on_failure(self) -> None:
        Thread(target= self.__exit_if_disconnected).start()
            


    def is_connected(self) -> bool:
        return self.mqtt_client.is_connected()

    def publish(self, topic: str, payload: str):
        self.mqtt_client.loop_start()
        print(
            f"{self.client_name} publish to {self.broker_address}, topic: {topic}, message: {payload}")
        self.mqtt_client.publish(
            topic, payload, qos=self.quality_of_service_level
        )
        self.mqtt_client.loop_stop()

    def listen(self) -> None:
        # Subscribe function accept one or more topics to be subscribed.
        print(f"Subscribing {self.topics_subscribed}...")
        if isinstance(self.topics_subscribed, str):
            self.mqtt_client.subscribe(
                self.topics_subscribed, self.quality_of_service_level
            )
        else:
            self.mqtt_client.subscribe(self.topics_subscribed)

        print(f"Listening to {self.broker_address}...")

        # make sure we continue the execution of the main thread (e.g., runing a server),
        # or the program will just finish execution after loop_start
        self.mqtt_client.loop_start()

    def set_on_message_callback(self, on_message_callback: OnMessageCallable) -> None:
        self.mqtt_client.on_message = on_message_callback

    def __repr__(self) -> str:
        qos_repr = {
            QoS.AT_MOST_ONCE: "At most once",
            QoS.AT_LEASET_ONCE: "At least once",
            QoS.EXACTLY_ONCE: "Exactly once"
        }[self.quality_of_service_level]

        return (
            f'''
            Client: {self.client_name}, 
            Broker: {self.broker_address}, 
            Topics subscribed: {self.topics_subscribed}, 
            Quality of Service Level: {qos_repr} ({self.quality_of_service_level})
            '''
        )
