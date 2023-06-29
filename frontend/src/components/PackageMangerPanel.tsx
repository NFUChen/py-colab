import { useState } from "react";
import { usePythonPackage } from "../hooks/usePythonPackage";
import { useSocket } from "../hooks/useSocket";
import { interpreterServerUrl } from "./ApiUrl";
import { motion } from "framer-motion";
interface IUninstallationPackageModal {
  packageName: string;
  handleUninstall: () => void;
}

interface IModal {
  modalId: string;
  label: string;
  confirmBtnName: string;
  confirmCallback: () => void;
}

const Button = ({
  label,
  className,
  isDisable = false,
  onClick
}: {
  label: string;
  isDisable?: boolean;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <button className={`btn duration-300 hover:-translate-y-1 ${className}`} onClick={onClick} disabled={isDisable}>
      {label}
    </button>
  );
};

const Modal: React.FC<IModal> = ({ modalId, label, confirmBtnName, confirmCallback }) => {
  return (
    <dialog id={modalId} className="modal">
      <form method="dialog" className="modal-box">
        <h3 className="text-lg font-bold">{label}</h3>
        <p className="py-4">Press ESC key or click the button below to close</p>
        <div className="modal-action">
          <Button label="Close" />
          <Button label={confirmBtnName} onClick={confirmCallback} className="bg-red-600 text-white hover:bg-red-400" />
        </div>
      </form>
    </dialog>
  );
};

const UninstallationPackageModal: React.FC<IUninstallationPackageModal> = ({ packageName, handleUninstall }) => {
  return (
    <Modal
      modalId={packageName}
      label={`Do you want to uninstall ${packageName}`}
      confirmBtnName="Uninstall"
      confirmCallback={handleUninstall}
    />
  );
};

const ClearEnvironmentModal = ({ handleClear }: { handleClear: () => void }) => {
  return (
    <Modal
      modalId="clearVenv"
      label="Do you want to clear environment"
      confirmBtnName="Clear"
      confirmCallback={handleClear}
    />
  );
};

interface IPackage {
  name: string;
  version: string;
  handleUninstall: () => void;
  idx?: number;
}

const Package: React.FC<IPackage> = ({ name, version, handleUninstall, idx = 0 }) => {
  const handleOpneModal = () => {
    const modal = document.getElementById(name) as HTMLDialogElement;
    if (modal && !modal.open) {
      modal.showModal();
    }
  };

  return (
    <>
      <UninstallationPackageModal packageName={name} handleUninstall={handleUninstall} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex cursor-pointer flex-row justify-between px-5 py-3 duration-300 hover:-translate-y-1 hover:bg-white/40 hover:text-xl"
        onClick={handleOpneModal}
      >
        <div className="flex w-[70%] flex-row">
          <p className="text-white">{name}</p>
        </div>
        <p className="text-white">{version}</p>
      </motion.div>
    </>
  );
};

export const PackageManagerPanel = () => {
  const { data: packageLogs } = useSocket<string[]>(interpreterServerUrl, "on_log", []);
  const [inputPackage, setInputPackage] = useState("");
  const { packages, uninstallPackage, installPackage, clearVenv, isInstalling } = usePythonPackage();
  const handleUninstall = (name: string) => {
    uninstallPackage(name);
  };
  const handleInstall = (name: string) => {
    if (!inputPackage) {
      return;
    }
    installPackage(name);
    setInputPackage("");
  };

  const handleChangeInput = evt => {
    setInputPackage(evt.target.value);
  };

  const handleOpneClearModal = () => {
    const clearModal = document.getElementById("clearVenv") as HTMLDialogElement;
    if (clearModal && !clearModal.open) {
      clearModal.showModal();
    }
  };

  return (
    <>
      <ClearEnvironmentModal handleClear={clearVenv} />
      <div className="flex h-auto w-[90rem] flex-col justify-start rounded-lg bg-white/40 p-5">
        <div className="flex space-x-10">
          <div className="w-[40%]">
            <div className="mb-3 flex w-full justify-center">
              <p className="text-4xl">Packages</p>
            </div>
            <motion.div layout className="mb-3 h-[35rem] w-full overflow-auto rounded-lg bg-black/50">
              {packages.map(({ name, version }, idx) => (
                <Package
                  key={`${idx}-${name}`}
                  idx={idx}
                  name={name}
                  version={version}
                  handleUninstall={() => handleUninstall(name)}
                />
              ))}
            </motion.div>
            <div className="flex justify-between space-x-5">
              <input
                onChange={handleChangeInput}
                type="text"
                value={inputPackage}
                placeholder="What package would you like to install ?"
                className="input-bordered input w-full bg-white text-black"
              />
              <Button label="Install" onClick={() => handleInstall(inputPackage)} isDisable={isInstalling} />
            </div>
            <div className="mt-3 flex justify-center">
              <Button label="Clear Environment" className="w-full" onClick={handleOpneClearModal} />
            </div>
          </div>
          <div className="max-h-[50rem] w-[80%] overflow-auto rounded-lg bg-black/50 p-5">
            {packageLogs.map(
              (log, idx) =>
                log && (
                  <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={idx} className="mt-3">
                    {log}
                  </motion.p>
                )
            )}
          </div>
        </div>
      </div>
    </>
  );
};
