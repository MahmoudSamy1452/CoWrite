import { Button, Label, Modal, TextInput } from "flowbite-react";
import { toast } from "sonner"
import axios from "axios";
import { VITE_BACKEND_URL } from "../../config";
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

function CustomModal(props) {
  const [inputValue, setInputValue] = useState("");
  const [ error, setError ] = useState(null);
  const { token } = useAuthContext();

  const setTitle = (e) => {
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    if(props.action === "Create") {
      axios.post(`${VITE_BACKEND_URL}/document`, {
        name: inputValue
      }).then((res) => {
        toast.success("Document created successfully")
      }).catch((error) => {
        toast.error("Document creation failed. Please try again")
      });
    } else {
      axios.put(`${VITE_BACKEND_URL}/document/rename/${props.isOpen}`, {
        name: inputValue
      }).then((res) => {
        toast.success("Document renamed successfully")
      })
      .catch((error) => {
        console.log(error);
        toast.error("Document rename failed. Please try again")
      });
    }
    closeModal();
  }

  const updateValue = (e) => {
    setInputValue(e.target.value);
    if (e.key === 'Enter') {
      setTitle();
    }
  }

  const closeModal = () => {
    props.setIsOpen(-1);
    setError(null);
    setInputValue("");
  }

  return (
    <>
      <Modal className="w-[300px] mt-20 mx-auto rounded-sm" show={props.isOpen >= 0} size="md" popup onClose={closeModal}>
        <Modal.Header />
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 mx-3 py-3 rounded relative">
              <strong className="font-bold">Error!</strong>
              <br />
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
        <Modal.Body className="p-5">
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Set Document Title</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="title" value="New title" />
              </div>
              <TextInput id="title" placeholder="My Document" onKeyUp={updateValue} required />
            </div>
            <div className="flex justify-center text-blue-400">
              <Button className="bg-slate-100 text-blue" onClick={setTitle}>Submit</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CustomModal;