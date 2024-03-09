const http = require("http");

function doRequest(method, path, body, callback) {
  const req = http.request(
    {
      hostname: "localhost",
      port: 3000,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic ZGV2ZWxvcGVyOnBhc3N3b3Jk",
      },
    },
    (res) => {
      let responseData = "";
      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        try {
          const jsonData = JSON.parse(responseData);
          callback(null, jsonData);
        } catch (error) {
          callback(error);
        }
      });
    },
  );
  if (body) {
    req.write(JSON.stringify(body));
  }
  req.end();
}

function createAdmin(idx) {
  const email = `admin${idx}@admin.com`;
  const body = {
    adminEmail: email,
    adminName: `Adam The ${idx}`,
    adminPhoneNumber: `+65${80000000 + idx}`,
  }
  doRequest("POST", "/api/dangerous/admins", body, (err, res) => {
    if (err) {
      console.error(`Failed to create ${email}`, err);
      return;
    }
    console.log(`Created ${email}`, res);
  });
}

function createVet(idx) {
  const email = `vet${idx}@vet.com`;
  const body = {
    vetEmail: email,
    vetName: `Vet Clinic ${idx}`,
    vetPhoneNumber: `+65${60000000 + idx}`,
    vetAddress: `${idx} Dog Park Drive`,
  }
  doRequest("POST", "/api/dangerous/vets", body, (err, res) => {
    if (err) {
      console.error(`Failed to create ${email}`, err);
      return;
    }
    console.log(`Created ${email}`, res);
  });
}

function userEmail(idx) {
  return `user${idx}@user.com`;
}

function createUser(idx) {
  const email = userEmail(idx);
  const body = {
    userEmail: email,
    userName: `Bob Name ${idx}`,
    userPhoneNumber: `+65${90000000 + idx}`,
  }
  doRequest("POST", "/api/dangerous/users", body, (err, res) => {
    if (err) {
      console.error(`Failed to create ${email}`, err);
      return;
    }
    console.log(`Created ${email}`, res);
  });
}


for (let i = 1; i <= 3; ++i) {
  createAdmin(i);
  createVet(i);
  createUser(i);
}
