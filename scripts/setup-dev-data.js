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
          if (callback) {
            callback(null, jsonData);
          }
        } catch (error) {
          if (callback) {
            callback(error);
          }
        }
      });
    },
  );
  if (body) {
    req.write(JSON.stringify(body));
  }
  req.end();
}

function getStandardCallbackFor(label) {
  return (err, res) => {
    if (err) {
      console.error(`Fail: ${label}`, err);
      return;
    }
    console.log(`Success: ${label}`, res);
  };
}

function createAdmin(idx) {
  const email = `admin${idx}@admin.com`;
  const body = {
    adminEmail: email,
    adminName: `Adam The ${idx}`,
    adminPhoneNumber: `+65${80000000 + idx}`,
  };
  doRequest(
    "POST",
    "/api/dangerous/admins",
    body,
    getStandardCallbackFor(`Create ${email}`),
  );
}

function createVet(idx) {
  const email = `vet${idx}@vet.com`;
  const body = {
    vetEmail: email,
    vetName: `Vet Clinic ${idx}`,
    vetPhoneNumber: `+65${60000000 + idx}`,
    vetAddress: `${idx} Dog Park Drive`,
  };
  doRequest(
    "POST",
    "/api/dangerous/vets",
    body,
    getStandardCallbackFor(`Create ${email}`),
  );
}

function userEmail(idx) {
  return `user${idx}@user.com`;
}

function createUser(idx, callback) {
  const email = userEmail(idx);
  const body = {
    userEmail: email,
    userName: `Bob Name ${idx}`,
    userPhoneNumber: `+65${90000000 + idx}`,
  };
  callback = callback || getStandardCallbackFor(`Create ${email}`);
  doRequest("POST", "/api/dangerous/users", body, callback);
}

function createDog(idx) {
  const email = userEmail(idx);
  const body = {
    userEmail: email,
    dogOii: {
      dogName: `Woofie${idx}`,
    },
    dogDetails: {
      dogStatus: "NEW_PROFILE",
      dogBreed: `Serbian Poodle Type ${idx}`,
      dogBirthday: `2022-0${1 + (idx % 9)}-15`,
      dogGender: "MALE",
      dogWeightKg: null,
      dogDea1Point1: "UNKNOWN",
      dogEverPregnant: "NO",
      dogEverReceivedTransfusion: "NO",
    },
  };
  doRequest(
    "POST",
    "/api/dangerous/dogs",
    body,
    getStandardCallbackFor(`Create dog for ${email}`),
  );
}

for (let i = 1; i <= 3; ++i) {
  const idx = i;
  createAdmin(idx);
  createVet(idx);
  createUser(idx, (err, res) => {
    if (err) {
      console.error("Failed to create user ", idx);
      return;
    }
    createDog(idx);
  });
}
