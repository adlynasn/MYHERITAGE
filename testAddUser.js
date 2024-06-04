const axios = require("axios");

const userData = {
  firstname: "John",
  lastname: "Doe",
  email: "john.doe@example.com",
  mobile: "1234567890",
  password: "password123",
  address: "123 Main St",
};

axios
  .post("http://localhost:3000/addUser", userData)
  .then((response) => {
    console.log("Response:", response.data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
