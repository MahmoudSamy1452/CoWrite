import { Button, Label, Modal, TextInput } from "flowbite-react";
import { Listbox } from '@headlessui/react'
import { toast } from "sonner"
import axios from "axios";
import { VITE_BACKEND_URL } from "../../config";
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import RoleSelect from "./RoleSelect";


const roles = [
  { id: 'v', name: 'Viewer' },
  { id: 'e', name: 'Editor' },
]

function ShareModal(props) {
  const [inputValue, setInputValue] = useState("");
  const [ role, setRole ] = useState(roles[0]);
  const { token } = useAuthContext();

  const shareDocument = (e) => {
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log(props.isOpen)
    if(inputValue === "") {
      toast.error("User must be specified");
      return;
    }
    if(props.action === "Share") {
      axios.post(`${VITE_BACKEND_URL}/contributor/share`, {
        username: {
          username: inputValue
        },
        document: {
          id: props.isOpen
        },
        role: role.id
      }).then((res) => {
        toast.success(res?.data?.message || "Document shared successfully");
        closeModal();
      }).catch((error) => {
        toast.error(error?.response?.data?.message || "Document sharing failed. Please try again");
      });
    }
  }

  const updateValue = (e) => {
    setInputValue(e.target.value);
    if (e.key === 'Enter') {
      shareDocument();
    }
  }

  const closeModal = () => {
    props.setIsOpen(-1);
    setInputValue("");
  }

  useEffect(() => {
    console.log(role)
  }, [role])

  return (
    <>
      <Modal show={props.isOpen >= 0 && props.action == "Share"} size="md" popup onClose={closeModal}>
        <Modal.Header />
        <Modal.Body className="p-5">
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Share Document</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="username" value="Username" />
              </div>
              <TextInput id="username" placeholder="" onKeyUp={updateValue} required />
              {/* <Dropdown className="z-30" label="Dropdown button" dismissOnClick={false}>
                <Dropdown.Item>Dashboard</Dropdown.Item>
                <Dropdown.Item>Settings</Dropdown.Item>
                <Dropdown.Item>Earnings</Dropdown.Item>
                <Dropdown.Item>Sign out</Dropdown.Item>
              </Dropdown> */}
              <RoleSelect roles={roles} role={role} setRole={setRole}/>
            </div>
            <div className="flex justify-center text-blue-400">
              <Button className="bg-slate-100 text-blue" onClick={shareDocument}>Submit</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ShareModal;