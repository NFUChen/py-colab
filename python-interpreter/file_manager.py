import os
import shutil
import random
import string
import datetime

def generate_random_chars(length: int = 10) -> str:
    chars = string.ascii_letters + string.digits
    random_chars = ''.join(random.choice(chars) for _ in range(length))
    return random_chars


def get_file_date_stats(path: str) -> dict[str, datetime.datetime]:
    return {
        "created_time": datetime.datetime.utcfromtimestamp(os.path.getctime(path)).isoformat(),
        "last_modified_time": datetime.datetime.utcfromtimestamp(os.path.getmtime(path)).isoformat()
    }


class FileManager:
    def __init__(self, base_dir: str) -> None:
        self.base_dir = base_dir
        self._file_system_dict_info = self._traverse_file_system()
        self._file_system_dict = self._file_system_dict_info["file_system_dict"]
        self._json_file_system_dict = self._file_system_dict_info["json_file_system_dict"]


    def _create_file_dict(self, path: str, type: str) -> dict[str, str]:
        file_stats = get_file_date_stats(path)
        parent_dir, file_name = self._serperate_file_into_parent_and_base(path)
        return {
            "parent_id": parent_dir,
            "full_path": path,
            "name": file_name,
            "type": type,
            **file_stats
        }
    

    def _serperate_file_into_parent_and_base(self, path: str) -> str:
        parent_dir, file_name = path.rsplit("/", 1)
        return parent_dir, file_name

    def _traverse_file_system(self) -> dict[str,dict[str, str]]:
        file_system_dict: dict[str, dict[str, dict[str, str]]] = {}
        json_file_system_dict:dict[str, list[dict[str, str]]] = {
           "dir": [],
            "file": [], 
        }

        for parent_dir, dirs, files in os.walk(self.base_dir):
            parent_dir_dict = self._create_file_dict(parent_dir, "dir")

            file_system_dict[parent_dir] = parent_dir_dict
            json_file_system_dict["dir"].append(parent_dir_dict)

            for dir in dirs:
                full_path = os.path.join(parent_dir, dir)
                dir_dict = self._create_file_dict(full_path, "dir")

                file_system_dict[full_path] = dir_dict
                json_file_system_dict["dir"].append(dir_dict)

            for file in files:
                full_path = os.path.join(parent_dir, file)
                file_dict = self._create_file_dict(full_path, "file")

                file_system_dict[full_path] = file_dict
                json_file_system_dict["file"].append(file_dict)

        return {
            "file_system_dict": file_system_dict,
            "json_file_system_dict": json_file_system_dict,
        }
    
    def get_file_system_dict(self) -> dict[str, dict[str, str]]:
        return self._file_system_dict
    
    def get_json_file_system_dict(self) -> dict[str, list[dict[str, str]]]:
        return self._json_file_system_dict
    
    def create_dir(self, dir_path_name: str) -> None:
        full_path = f"{self.base_dir}/{dir_path_name}"
        os.makedirs(f"{full_path}", exist_ok=True)

        dir_dict = self._create_file_dict(full_path, "dir")

        self._file_system_dict[full_path] = dir_dict
        self._json_file_system_dict["dir"].append(dir_dict)

    def create_file(self, file_name: str) -> None:
        # Open the file in write mode (create it if it doesn't exist)
        full_path = f"{self.base_dir}/{file_name}"
        file = open(full_path, 'w')
        # Close the file
        file.close()

        file_dict = self._create_file_dict(full_path, "file")

        self._file_system_dict[full_path] = file_dict
        self._json_file_system_dict["file"].append(file_dict)
    def delete_file(self, full_path: str) -> None:
        if full_path == self.base_dir:
            raise Exception("You can't delete the base directory")

        shutil.rmtree(full_path)

        self = self.__init__(self.base_dir)