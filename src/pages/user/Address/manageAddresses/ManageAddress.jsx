import React, { useEffect, useState } from "react";
import { FaPlusCircle, FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  useLazyGetAddressesQuery,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} from "../../../../slices/user/profile/address/addressApiSlice";
import Modal from "../../../../components/common/Modals/Modal";
import { useSelector } from "react-redux";
import LoadingBlurScreen from "../../../../components/common/LoadingScreens/LoadingBlurFullScreen";
import LoadingScreen from "../../../../components/common/LoadingScreens/LoadingScreen";
import { Button } from "@mui/material";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { motion } from "framer-motion"; // Import motion

const ManageAddresses = ({ checkout = true }) => {
  const [fetchAddresses, { isLoading }] = useLazyGetAddressesQuery();
  const [removeAddress] = useDeleteAddressMutation();
  const [setDefaultAddress] = useSetDefaultAddressMutation();

  const navigate = useNavigate();
  const { addresses } = useSelector((state) => state.userAddresses);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deletingAddress, setDeletingAddress] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  useEffect(() => {
    if (addresses.length) {
      const defaultAddress = addresses.find(
        (address) => address.isDefaultAddress
      );
      if (defaultAddress) {
        setSelectedAddress(defaultAddress._id);
      }
    }
  }, [addresses]);

  const handleSelectAddress = async (id) => {
    setSelectedAddress(id);
    try {
      await setDefaultAddress({ addressId: id }).unwrap();
    } catch (error) {
      console.error("Failed to set default address:", error);
    }
  };

  const handleEditAddress = (id) => {
    navigate(checkout ? `edit?id=${id}` : `edit-addresses?id=${id}`);
  };

  const handleRemoveAddress = async () => {
    try {
      await removeAddress({ addressId: deletingAddress }).unwrap();
      closeModal();
      setDeletingAddress(null);
    } catch (error) {
      console.error("Failed to remove address:", error);
    }
  };

  if (isLoading) {
    return checkout ? <LoadingBlurScreen /> : <LoadingScreen />;
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 bg-white shadow-lg rounded-xl">
      {checkout && (
        <button
          className="w-fit bg-blue-500 text-white p-3 m-3 rounded-lg flex items-center"
          onClick={() => navigate("/checkOut",{state:{from:"/addresses"}})}
        >
          <AiOutlineArrowLeft className="mr-2" />
          Back
        </button>
      )}
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4 text-center">
        Manage Address
      </h2>
      {!checkout && (
        <>
          <button
            onClick={() => navigate("add-addresses")}
            className="flex items-center justify-center w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          >
            <FaPlusCircle className="mr-2" />
            Add New Address
          </button>
          <div className="flex items-center justify-center my-2">
            <span className="text-gray-500 text-sm">OR</span>
          </div>
        </>
      )}
      {addresses?.length === 0 ? (
        <div className="text-2xl text-center md:text-3xl text-gray-600">No Addresses</div>
      ) : (
        addresses.map((address) => (
          <motion.div
            key={address._id}
            className={`border rounded-xl p-4 md:p-6 mb-4 transition-colors duration-300 ${
              selectedAddress === address._id ? "border-blue-500 bg-blue-50" : "border-gray-200"
            }`}
            whileHover={{ scale: 1.02 }}
          >
            {selectedAddress === address._id && (
              <span className="text-xs text-white bg-blue-500 px-3 py-1 rounded-full inline-block mb-2">
                Default
              </span>
            )}
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm md:text-base">
                <p className="font-semibold text-gray-800">
                  {`${address.firstName} ${address.lastName}`}
                </p>
                <p className="text-gray-600">{`${address.city}, ${address.district}, ${address.state}`}</p>
                <p className="text-gray-600">{address.pincode}</p>
                <p className="text-gray-600">{address.mobileNumber}</p>
              </div>
              <div className="flex space-x-2 mt-3 md:mt-0">
                <button
                  onClick={() => handleSelectAddress(address._id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                    selectedAddress === address._id
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {selectedAddress === address._id ? "Selected" : "Use Address"}
                </button>
                <button
                  onClick={() => handleEditAddress(address._id)}
                  className="flex items-center px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                  <FaEdit className="mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setDeletingAddress(address._id);
                    openModal();
                  }}
                  className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <FaTrashAlt className="mr-2" />
                  Remove
                </button>
              </div>
            </div>
          </motion.div>
        ))
      )}
      {checkout && (
        <>
          <div className="flex items-center justify-center my-2">
            <span className="text-gray-500 text-sm">OR</span>
          </div>
          <button
            onClick={() => navigate("add")}
            className="flex items-center justify-center w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          >
            <FaPlusCircle className="mr-2" />
            Add New Address
          </button>
        </>
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Are you sure to remove this address?"
        footer={
          <>
            <Button variant="outlined" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={handleRemoveAddress}>
              Confirm
            </Button>
          </>
        }
      >
        <p>Are you sure you want to remove this address?</p>
      </Modal>
    </div>
  );
};

import PropTypes from "prop-types";

ManageAddresses.propTypes = {
  checkout: PropTypes.bool,
};
export default ManageAddresses;
