from file_manager import FileManager
import json


file_manager = FileManager("./test")

print(json.dumps(file_manager.get_file_system_dict(), indent=4))
print(json.dumps(file_manager.get_json_file_system_dict(), indent=4))

file_manager.create_dir("test_dir_from_main.py/test")
file_manager.create_file("test_dir_from_main.py/test/test_file.py")

print(json.dumps(file_manager.get_file_system_dict(), indent=4))
print(json.dumps(file_manager.get_json_file_system_dict(), indent=4))

# import os

# def get_parent_directory(path):
#     abs_path = os.path.abspath(path)
#     return os.path.abspath(os.path.join(abs_path, os.pardir))

# path = 'relative/path/to/child_directory'
# parent_dir = get_parent_directory(path)
# print(os.pardir)