import axios from "axios";
import { interpreterServerUrl } from "../components/ApiUrl";
import { useEffect, useState } from "react";

interface IModule {
  name: string;
  version: string;
}

interface IModuleAPI {
  message: string;
  packages?: IModule[];
  operation: string;
}
export const usePythonPackage = () => {
  const [packages, setPackages] = useState<IModule[]>([]);
  const [serverMsg, setServerMsg] = useState<string>("");
  const [serverError, setServerError] = useState<string>("");
  const [isInstalling, setIsInstalling] = useState<boolean>(false);

  const fetchPackageInfo = () => {
    axios
      .get<IModuleAPI>(`${interpreterServerUrl}/list_packages`)
      .then(resp => {
        setPackages(resp.data.packages || []);
      })
      .catch(err => setServerError(err.message));
  };

  useEffect(fetchPackageInfo, []);
  const installPackage = (packageName: string) => {
    setIsInstalling(true);
    axios
      .post<IModuleAPI>(`${interpreterServerUrl}/install_package`, { package_name: packageName })
      .then(resp => {
        setServerMsg(resp.data.operation);
        fetchPackageInfo();
        setIsInstalling(false);
      })
      .catch(err => setServerError(err.message));
  };
  const uninstallPackage = (packageName: string) => {
    axios
      .post<IModuleAPI>(`${interpreterServerUrl}/uninstall_package`, { package_name: packageName })
      .then(resp => {
        setServerMsg(resp.data.operation);
        fetchPackageInfo();
      })
      .catch(err => setServerError(err.message));
  };
  const clearVenv = () => {
    axios
      .get<IModuleAPI>(`${interpreterServerUrl}/clear_venv`)
      .then(resp => {
        setServerMsg(resp.data.operation);
        fetchPackageInfo();
      })
      .catch(err => setServerError(err.message));
  };

  return {
    packages: packages,
    serverError: serverError,
    serverMsg: serverMsg,
    installPackage: installPackage,
    isInstalling: isInstalling,
    uninstallPackage: uninstallPackage,
    clearVenv: clearVenv
  };
};
