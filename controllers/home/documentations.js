export const docss = (req, res) => {
    const jsonData = {
      "Welcome to sporty": "200 status",
      "/api/users": "Get all the users",
      "/api/listing/": "Add listing",
      "/api/auth/login": "Login",
      "/api/auth/register": "Register",
    };
    const jsonString = JSON.stringify(jsonData);
    res.write(jsonString);
    res.end();
  };
  