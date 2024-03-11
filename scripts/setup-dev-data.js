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

// https://stackoverflow.com/a/47593316
function cyrb128(str) {
  let h1 = 1779033703,
    h2 = 3144134277,
    h3 = 1013904242,
    h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  (h1 ^= h2 ^ h3 ^ h4), (h2 ^= h1), (h3 ^= h1), (h4 ^= h1);
  return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
}

function sfc32(a, b, c, d) {
  return function () {
    a |= 0;
    b |= 0;
    c |= 0;
    d |= 0;
    var t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

function getRng(purpose, seed) {
  const x = cyrb128(`seed-${purpose}-${seed * 5336}-seed`);
  return sfc32(x[0], x[1], x[2], x[3]);
}

function nextInt(rng) {
  return Math.floor(rng() * 2147483647);
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
  const nameIdx = nextInt(getRng("createAdmin", idx));
  const body = {
    adminEmail: email,
    adminName: getHumanName(nameIdx),
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
  const nameIdx = nextInt(getRng("createUser", idx));
  const body = {
    userEmail: email,
    userName: getHumanName(nameIdx),
    userPhoneNumber: `+65${90000000 + idx}`,
  };
  callback = callback || getStandardCallbackFor(`Create ${email}`);
  doRequest("POST", "/api/dangerous/users", body, callback);
}

function getFirstName(idx) {
  const firstNames = [
    "Emma",
    "Liam",
    "Olivia",
    "Noah",
    "Ava",
    "William",
    "Sophia",
    "James",
    "Isabella",
    "Oliver",
    "Mia",
    "Benjamin",
    "Charlotte",
    "Elijah",
    "Amelia",
    "Lucas",
    "Harper",
    "Alexander",
    "Evelyn",
    "Henry",
  ];
  const rng = getRng("getFirstName", idx);
  const k = nextInt(rng);
  return firstNames[k % firstNames.length];
}

function getLastName(idx) {
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Jones",
    "Brown",
    "Davis",
    "Miller",
    "Wilson",
    "Moore",
    "Taylor",
  ];
  const rng = getRng("getLastName", idx);
  const k = nextInt(rng);
  return lastNames[k % lastNames.length];
}

function getHumanName(idx) {
  return `${getFirstName(idx)} ${getLastName(idx)}`;
}

function getDogName(idx) {
  const maleDogNames = [
    "Max",
    "Buddy",
    "Charlie",
    "Jack",
    "Cooper",
    "Rocky",
    "Toby",
    "Bear",
    "Duke",
    "Teddy",
    "Bailey",
    "Oliver",
    "Milo",
    "Bentley",
    "Zeus",
  ];
  const femaleDogNames = [
    "Bella",
    "Lucy",
    "Daisy",
    "Luna",
    "Molly",
    "Sadie",
    "Lola",
    "Sophie",
    "Chloe",
    "Lily",
    "Ruby",
    "Rosie",
    "Maggie",
    "Zoe",
    "Stella",
  ];
  const rng = getRng("getDogName", idx);
  const k = nextInt(rng);
  const gender = getGender(idx);
  if (gender === "MALE") {
    return maleDogNames[k % maleDogNames.length];
  }
  return femaleDogNames[k % femaleDogNames.length];
}

function getDogBreed(idx) {
  const dogBreeds = [
    "Labrador Retriever",
    "German Shepherd",
    "Golden Retriever",
    "Bulldog",
    "Beagle",
    "Poodle",
    "Rottweiler",
    "Yorkshire Terrier",
    "Boxer",
    "Dachshund",
    "Siberian Husky",
    "Great Dane",
    "Shih Tzu",
    "Doberman Pinscher",
    "Pembroke Welsh Corgi",
    "Australian Shepherd",
    "Cavalier King Charles Spaniel",
    "Miniature Schnauzer",
    "Shetland Sheepdog",
    "Boston Terrier",
  ];
  const rng = getRng("getDogBreed", idx);
  const k = nextInt(rng);
  return dogBreeds[k % dogBreeds.length];
}

function getGender(idx) {
  const rng = getRng("getGender", idx);
  if (rng() < 0.5) {
    return "MALE";
  }
  return "FEMALE";
}

function getDea1Point1(idx) {
  const rng = getRng("getDea1Point1", idx);
  // Assume 80% of owners do not know the answer
  if (rng() < 0.8) {
    return "UNKNOWN";
  }
  // Approximately 40% of dogs are DEA 1.1 Positive.
  // https://www.msdvetmanual.com/dog-owners/blood-disorders-of-dogs/blood-groups-and-blood-transfusions-in-dogs
  if (rng() < 0.4) {
    return "POSITIVE";
  }
  return "NEGATIVE";
}

function getEverReceivedTransfusion(idx) {
  const rng = getRng("getEverReceivedTransfusion", idx);
  // Assume 10% yes, 10% don't know, and the rest no.
  const k = rng();
  if (k < 0.1) {
    return "YES";
  }
  if (k < 0.2) {
    return "UNKNOWN";
  }
  return "NO";
}

function getEverPregnant(idx) {
  const gender = getGender(idx);
  if (gender === "MALE") {
    return "NO";
  }
  if (gender === "UNKNOWN") {
    return "UNKNOWN";
  }
  // Assume 15% don't know
  const rng = getRng("getEverPregnant", idx);
  if (rng() < 0.15) {
    return "UNKNOWN";
  }
  // Amongst those that know, 10% have been pregnant.
  if (rng() < 0.1) {
    return "YES";
  }
  return "NO";
}

function getBirthday(idx) {
  const today = new Date();
  const millisPerDay = 24 * 60 * 60 * 1000;
  const maxAgeDays = 16 * 365;
  const minAgeDays = 30;
  const rng = getRng("getBirthday", idx);
  const ageInDays = Math.floor(minAgeDays + rng() * (maxAgeDays - minAgeDays));
  const ageInMillis = ageInDays * millisPerDay;
  const birthday = new Date(today.getTime() - ageInMillis);
  const iso8601 = birthday.toISOString();
  return iso8601.split("T")[0];
}

function getWeightKg(idx) {
  const rng = getRng("getWeightKg", idx);
  // 30% don't know.
  if (rng() < 0.3) {
    return null;
  }
  const maxWeightKg = 30;
  const minWeightKg = 2;
  return Math.floor(minWeightKg + rng() * (maxWeightKg - minWeightKg));
}

function createDog(idx) {
  const email = userEmail(idx);
  const body = {
    userEmail: email,
    dogOii: {
      dogName: getDogName(idx),
    },
    dogDetails: {
      dogStatus: "NEW_PROFILE",
      dogBreed: getDogBreed(idx),
      dogBirthday: getBirthday(idx),
      dogGender: getGender(idx),
      dogWeightKg: getWeightKg(idx),
      dogDea1Point1: getDea1Point1(idx),
      dogEverPregnant: getEverPregnant(idx),
      dogEverReceivedTransfusion: getEverReceivedTransfusion(idx),
    },
  };
  doRequest("POST", "/api/dangerous/dogs", body, (err, res) => {
    if (err) {
      console.error(`Failed to create dog for ${email}`, body, err);
      return;
    }
    console.log(`Create dog for ${email}`, body, res);
  });
}

for (let i = 1; i <= 3; ++i) {
  const idx = i;
  createAdmin(idx);
  createVet(idx);
}

for (let i = 1; i < 100; ++i) {
  const idx = i;
  createUser(idx, (err, res) => {
    if (err) {
      console.error("Failed to create user ", idx);
      return;
    }
    createDog(idx);
  });
}
