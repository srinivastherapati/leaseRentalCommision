import axios from "axios";

axios.defaults.baseURL = "http://localhost:3001";
const baseUrl = "http://localhost:3001";

export const fetchComplaints = async () => {
  // Perform the API call to retrieve all complaints
  try {
    const response = await fetch(`${baseUrl}/api/getComplaints`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if the retrieval was successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const complaints = await response.json();
    return complaints;
  } catch (error) {
    console.error("Failed to fetch complaints:", error);
    return {
      status: "Failure",
      error: error.message,
    };
  }
};

export const fetchComplaintsByOwner = async (ownerId) => {
  // Perform the API call to retrieve all complaints
  try {
    const response = await fetch(`/api/complaints/owner/${ownerId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if the retrieval was successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const complaints = await response.json();
    return complaints;
  } catch (error) {
    console.error("Failed to fetch complaints for owner:", error);
    return {
      status: "Failure",
      error: error.message,
    };
  }
};

export const fetchUserComplaints = async (userId) => {
  // Perform the API call to retrieve all complaints
  try {
    const response = await fetch(`${baseUrl}/api/getComplaints/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if the retrieval was successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const complaints = await response.json();
    return complaints;
  } catch (error) {
    console.error("Failed to fetch complaints:", error);
    return {
      status: "Failure",
      error: error.message,
    };
  }
};

export const addComplaint = async (userId, payload) => {
  // Perform the API call to add a new complaint
  try {
    const response = await fetch(`${baseUrl}/api/complaints/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Check if the addition was successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const newComplaint = await response.json();
    return newComplaint;
  } catch (error) {
    console.error("Failed to add complaint:", error);
    return {
      status: "Failure",
      error: error.message,
    };
  }
};

export const updateComplaints = async (complaintId, payload) => {
  // Perform the API call to update the complaint on the server
  try {
    const response = await fetch(`${baseUrl}/api/complaints/${complaintId}`, {
      method: "PATCH", // Using PATCH for partial update
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Check if the update was successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const updatedComplaint = await response.json();
    return updatedComplaint;
  } catch (error) {
    console.error("Failed to update complaint:", error);
    return {
      status: "Failure",
      error: error.message,
    };
    // Optionally handle the error, e.g., show an error message to the user
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${baseUrl}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });

    return await response.json();
  } catch (error) {
    // Handle network errors or other errors during the API call
    return {
      error: error.message,
    };
  }
};

export const fetchAvailableApartments = async (availableFrom) => {
  try {
    const url = availableFrom 
      ? `${baseUrl}/api/apartmentDetails?availableFrom=${availableFrom}` 
      : `${baseUrl}/api/apartmentDetails`; // fixed backtick usage

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.status === 200) {
      return data;
    } else {
      return {
        error: "Something went wrong",
      };
    }
  } catch (error) {
    return {
      error: error.message,
    };
  }
};




export const fetchApartmentDetails = async (id) => {
  try {
    const response = await fetch(`${baseUrl}/api/apartmentDetails/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (response.status === 200) {
      console.log(data);
      return data;
    } else {
      return {
        error: "Something went wrong",
      };
    }
  } catch (error) {
    // Handle network errors or other errors during the API call
    return {
      error: error.message,
    };
  }
};

export const fetchOwnerApartments = async (ownerId) => {
  try {
    const response = await fetch(`${baseUrl}/api/owner/apartmentDetails/${ownerId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (response.status === 200) {
      return data;
    } else {
      return {
        error: "Something went wrong",
      };
    }
  } catch (error) {
    // Handle network errors or other errors during the API call
    return {
      error: error.message,
    };
  }
};

export const submitLeaseApplication = async (id, payload) => {
  try {
    const response = await fetch(`${baseUrl}/api/applyLease/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (e) {
    console.log(e);
  }
};

export const getAllUserPayments = async (id) => {
  try {
    const response = await fetch(
      `${baseUrl}/api/getAllRequiredPayments/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return await response.json();
  } catch (e) {
    console.log(e);
  }
};

export const addPayment = async (paymentData) => {
  try {
    const response = await fetch(`/api/create-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });
    return response;
  } catch (error) {
    console.error("Failed to add payment:", error);
    throw error;
  }
};

export const getPastPayments = async (id) => {
  try {
    const response = await fetch(`${baseUrl}/api/past-payments/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const getFuturePayments = async (id) => {
  try {
    const response = await fetch(`${baseUrl}/api/upcoming-payments/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const addMemberToLease = async (userId, addUserId) => {
  try {
    const response = await fetch(`${baseUrl}/api/addMemberToLease/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ addUserId }),
    });
    const data = await response.json();
    if (response.status !== 200) throw new Error(data.message);
    return data;
  } catch (error) {
    console.error("Error adding member:", error);
    alert(error.message);
  }
};

export const removeMemberFromLease = async (userId, removeUserId) => {
  try {
    const response = await fetch(
      `${baseUrl}/api/removeMemberFromLease/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ removeUserId }),
      }
    );
    const data = await response.json();
    if (response.status !== 200) throw new Error(data.message);
    return data;
  } catch (error) {
    console.error("Error removing member:", error);
    alert(error.message);
  }
};

export const createApartment = async (apartmentData) => {
  try {
    const response = await fetch("/api/createApartment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apartmentData),
    });
    if (!response.ok) {
      throw new Error("Failed to create apartment");
    }
    return await response.json(); // Assuming the server returns the created apartment
  } catch (error) {
    console.error("Error creating apartment:", error);
    throw error; // Rethrow to handle it in the component
  }
};

export const updateApartment = async (apartmentId, apartmentData) => {
  try {
    const response = await fetch(`/api/updateApartment/${apartmentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apartmentData),
    });
    if (!response.ok) {
      throw new Error("Failed to update apartment");
    }
    return await response.json(); // Assuming the server returns the updated apartment
  } catch (error) {
    console.error("Error updating apartment:", error);
    throw error; // Rethrow to handle it in the component
  }
};

export const deleteApartment = async (apartmentId) => {
  try {
    const response = await fetch(`/api/deleteApartment/${apartmentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete apartment");
    }
    return await response.json(); // Assuming the server sends some confirmation message
  } catch (error) {
    console.error("Error deleting apartment:", error);
    throw error; // Rethrow to handle it in the component
  }
};

export const fetchAllLeases = async () => {
  try {
    const response = await fetch("/api/getAllGivenLeases");
    if (!response.ok) {
      throw new Error("Failed to fetch leases");
    }
    const data = await response.json();
    return data.leases;
  } catch (error) {
    console.error("Error fetching leases:", error);
    throw error;
  }
};

export const registerUser = async (payload) => {
  try {
    const response = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error registering user :", error);
  }
};

export const registerOwner = async (payload) => {
  try {
    const response = await fetch("/api/owner/register", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error registering user :", error);
  }
};


export const getPendingOwners = async () => {
  try {
    const response = await fetch("/api/admin/pending-owners", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching pending owners :", error.message);
  }
};

export const approveOwner = async (userId) => {
  try {
    const response = await fetch(`/api/admin/approve-owner/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    alert("Error getting status : ", error);
  }
};


export const getStatus = async (id) => {
  try {
    const response = await fetch(`/api/getStatus/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    alert("Error getting status : ", error);
  }
};

export const getAllStatuses = async () => {
  try {
    const response = await fetch("/api/getAllStatus", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    alert("Error getting all statuses : ", error);
  }
};
export const getStatusesByOwner = async (ownerId) => {
  try {
    const response = await fetch(`/api/getStatusByOwner/${ownerId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    alert("Error getting all statuses : ", error);
  }
};

export const terminateLease = async (id) => {
  try {
    const response = await fetch(`/api/terminateLease/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    alert(error);
  }
};

export const updateStatus = async (flatNumber, aptNumber, status) => {
  try {
    const response = await fetch(
      `/api/updateStatus/${flatNumber}/${aptNumber}`,
      {
        method: "PUT",
        body: JSON.stringify({ status: status }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    alert(error);
  }
};

export const updatePaymentStatus = async (id, bodyContent) => {
  try {
    const response = await fetch(`/api/updatePayment/${id}`, {
      method: "PUT",
      body: JSON.stringify(bodyContent),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    alert(error);
  }
};
