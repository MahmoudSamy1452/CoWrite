import { Button, Label, Modal, TextInput, Spinner } from "flowbite-react";
import { toast } from "sonner"
import axios from "axios";
import { VITE_BACKEND_URL } from "../../config";
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

function CustomModal(props) {
  const [inputValue, setInputValue] = useState("");
  const [ error, setError ] = useState(null);
  const [ isLoading, setIsLoading ] = useState(false);
  const { token } = useAuthContext();

  const setTitle = (e) => {
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    if(inputValue === "") {
      toast.error("Title cannot be empty");
      return;
    }
    console.log("Setting title")
    setIsLoading(true);
    if(props.action === "Create") {
      axios.post(`${VITE_BACKEND_URL}/document`, {
        name: inputValue
      }).then((res) => {
        toast.success(res?.data?.message || "Document created successfully");
        closeModal();
      }).catch((error) => {
        toast.error(error?.response?.data?.message || "Document creation failed. Please try again");
        setIsLoading(false);
      });
    } else {
      axios.put(`${VITE_BACKEND_URL}/document/rename/${props.isOpen}`, {
        name: inputValue
      }).then((res) => {
        toast.success(res?.data?.message || "Document renamed successfully");
        closeModal();
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Document renaming failed. Please try again");
        setIsLoading(false);
      });
    }
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
    setIsLoading(false);
  }

  useEffect(()=>
    console.log(isLoading)
  ,[isLoading])

  return (
    <>
      <Modal show={props.isOpen >= 0 && props.action != "Share"} size="md" popup onClose={closeModal}>
        <Modal.Header />
        <Modal.Body className="p-5">
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Set Document Title</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="title" value="New title" />
              </div>
              <TextInput id="title" placeholder="My Document" onKeyUp={updateValue} required />
            </div>
            <div className="flex justify-center align-middle text-blue-400">
              {!isLoading && (
                <Button className="bg-slate-100 text-blue w-24 flex justify-center align-middle" onClick={setTitle}> 
                  Submit
                </Button>
              )}
              {isLoading && (
                <Button>
                  <Spinner aria-label="Spinner button example" size="sm" />
                  <span className="pl-3 text-blue-400">Loading...</span>
                </Button>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CustomModal;