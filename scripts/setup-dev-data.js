const http = require("http");

function doRequest(method, path, body) {
  return new Promise((resolve, reject) => {
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
          console.log({ responseData });
          try {
            const jsonData = JSON.parse(responseData);
            resolve(jsonData);
          } catch (error) {
            reject(error);
          }
        });
      },
    );
    if (body) {
      console.log(body);
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

function doQuery(sql, args) {
  return doRequest("POST", "/api/dangerous/sql", { sql, args });
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

function createAdmin(idx) {
  const email = `admin${idx}@admin.com`;
  const nameIdx = nextInt(getRng("createAdmin", idx));
  const body = {
    adminEmail: email,
    adminName: getHumanName(nameIdx),
    adminPhoneNumber: `+65${80000000 + idx}`,
  };
  return doRequest("POST", "/api/dangerous/admins", body).then((res) => {
    console.log(`Created admin: ${email}`);
    return res;
  });
}

function createVet(idx) {
  const email = `vet${idx}@vet.com`;
  const body = {
    vetEmail: email,
    vetName: `Vet Clinic ${idx}`,
    vetPhoneNumber: `+65${60000000 + idx}`,
    vetAddress: `${idx} Dog Park Drive`,
  };
  return doRequest("POST", "/api/dangerous/vets", body)
    .then((res) => {
      console.log(`Created vet: ${email}`);
      return res;
    })
    .then((vet) => {
      return new Promise((resolve) => {
        const sql = `
        INSERT INTO vet_accounts (vet_account_email, vet_id)
        VALUES ($1, $2)
        RETURNING vet_id as "vetId"
        `;
        doQuery(sql, [`manager${idx}@vet.com`, vet.vetId]).then((_) => {
          resolve(vet);
        });
      });
    });
}

function getUserEmail(idx) {
  return `user${idx}@user.com`;
}

function getUserResidency(idx) {
  const rng = getRng("getUserResidency", idx);
  const p = rng();
  if (p < 0.05) {
    return "OTHER";
  }
  return "SINGAPORE";
}

function createUser(idx, callback) {
  const email = getUserEmail(idx);
  const nameIdx = nextInt(getRng("createUser", idx));
  const userPii = {
    userEmail: email,
    userName: getHumanName(nameIdx),
    userPhoneNumber: `+65${90000000 + idx}`,
  };
  const userResidency = getUserResidency(idx);
  const body = { userPii, userResidency };
  return doRequest("POST", "/api/dangerous/users", body).then((res) => {
    console.log(`Created user: ${email}`);
    return res;
  });
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
    "Bailey",
    "Barkus",
    "Bear",
    "Bentley",
    "Buddy",
    "Charlie",
    "Cooper",
    "Dingo",
    "Duke",
    "Jack",
    "Max",
    "Milo",
    "Oliver",
    "Peter",
    "Rocky",
    "Teddy",
    "Toby",
    "Woofus",
    "Zeus",
  ];
  const femaleDogNames = [
    "Aurora",
    "Bella",
    "Carol",
    "Chloe",
    "Daisy",
    "Lily",
    "Lola",
    "Lucy",
    "Luna",
    "Maggie",
    "Molly",
    "Olive",
    "Rosie",
    "Ruby",
    "Sadie",
    "Sophie",
    "Stella",
    "Vella",
    "Zoe",
  ];
  const rng = getRng("getDogName", idx);
  const k1 = nextInt(rng);
  const k2 = nextInt(rng);
  const gender = getGender(idx);
  if (gender === "MALE") {
    return (
      maleDogNames[k1 % maleDogNames.length] +
      " " +
      maleDogNames[k2 % maleDogNames.length]
    );
  }
  return (
    femaleDogNames[k1 % femaleDogNames.length] +
    " " +
    femaleDogNames[k2 % femaleDogNames.length]
  );
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
  return formatBirthday(birthday);
}

function formatBirthday(birthday) {
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

function getDogFields(idx, overrides) {
  const base = {
    dogName: getDogName(idx),
    dogBreed: getDogBreed(idx),
    dogBirthday: getBirthday(idx),
    dogGender: getGender(idx),
    dogWeightKg: getWeightKg(idx),
    dogDea1Point1: getDea1Point1(idx),
    dogEverPregnant: getEverPregnant(idx),
    dogEverReceivedTransfusion: getEverReceivedTransfusion(idx),
  };
  return { ...base, ...overrides };
}

const MILLIS_PER_YEAR = 365 * 86400 * 1000;
const MILLIS_PER_MONTH = MILLIS_PER_YEAR / 12;

function getIncompleteDogOverrides(dogName) {
  return {
    dogName,
    dogBreed: "",
    dogBirthday: formatBirthday(new Date(Date.now() - 3 * MILLIS_PER_YEAR)),
    dogGender: "MALE",
    dogWeightKg: null,
    dogDea1Point1: "UNKNOWN",
    dogEverPregnant: "NO",
    dogEverReceivedTransfusion: "UNKNOWN",
  };
}

function getEligibleDogOverrides(dogName) {
  return {
    dogName,
    dogBreed: "Singapore Special",
    dogBirthday: formatBirthday(new Date(Date.now() - 2 * MILLIS_PER_YEAR)),
    dogGender: "FEMALE",
    dogWeightKg: 23,
    dogDea1Point1: "UNKNOWN",
    dogEverPregnant: "NO",
    dogEverReceivedTransfusion: "NO",
  };
}

function getIneligibleDogOverrides(dogName) {
  return {
    dogName,
    dogBreed: "Singapore Special",
    dogBirthday: formatBirthday(new Date(Date.now() - 3 * MILLIS_PER_MONTH)),
    dogGender: "FEMALE",
    dogWeightKg: 23,
    dogDea1Point1: "UNKNOWN",
    dogEverPregnant: "NO",
    dogEverReceivedTransfusion: "NO",
  };
}

function getPermanentlyIneligibleDogOverrides(dogName) {
  return {
    dogName,
    dogBreed: "Singapore Special",
    dogBirthday: formatBirthday(new Date(Date.now() - 10 * MILLIS_PER_YEAR)),
    dogGender: "MALE",
    dogWeightKg: 25,
    dogDea1Point1: "UNKNOWN",
    dogEverPregnant: "NO",
    dogEverReceivedTransfusion: "NO",
  };
}

function createDog(userEmail, idx, overrides) {
  const fields = getDogFields(idx, overrides);
  const { dogName, ...dogDetails } = fields;
  const body = {
    userEmail,
    dogOii: {
      dogName,
    },
    dogDetails,
  };
  return doRequest("POST", "/api/dangerous/dogs", body).then((res) => {
    const { dogId } = res;
    console.log(
      `Created idx=${idx} dogId ${dogId} for user ${userEmail} named ${dogName}`,
    );
    return {
      dogId,
      ...fields,
    };
  });
}

/**
 * @returns [1, 2, 3, ..., n]
 */
function irange(n) {
  return Array.from(Array(n).keys()).map((i) => i + 1);
}

function generateAccounts() {
  const numAdmins = 3;
  const numVets = 3;
  const numUsers = 9;
  const maxDogsPerUser = 4;
  const userIdxToUserId = {};
  const vetIdxToVetId = {};
  const dogIdToDog = {};

  function createAdminAccounts() {
    return Promise.all(irange(numAdmins).map(createAdmin));
  }

  function createVetAccounts() {
    return Promise.all(
      irange(numVets).map((vetIdx) => {
        return createVet(vetIdx).then((vet) => {
          vetIdxToVetId[vetIdx] = vet.vetId;
        });
      }),
    );
  }

  function createUserAccountsAndDogs() {
    return Promise.all(
      irange(numUsers).map((idx) => {
        return createUser(idx).then((user) => {
          const { userId } = user;
          userIdxToUserId[idx] = userId;
          const email = getUserEmail(idx);
          const offset = idx * maxDogsPerUser;
          const numDogs = idx % (maxDogsPerUser + 1);
          return Promise.all(
            irange(numDogs).map((j) =>
              createDog(email, offset + j).then((dog) => {
                dogIdToDog[dog.dogId] = dog;
                return dog;
              }),
            ),
          );
        });
      }),
    );
  }

  function addVetPreferences() {
    return Promise.all(
      irange(numUsers).map((userIdx) => {
        const rng = getRng("choose a vet", userIdx);
        const vetIdx = (nextInt(rng) % numVets) + 1;
        const userId = userIdxToUserId[userIdx];
        const vetId = vetIdxToVetId[vetIdx];
        return Promise.resolve()
          .then(() =>
            doQuery(`select dog_id as "dogId" from dogs where user_id = $1`, [
              userId,
            ]),
          )
          .then((res) =>
            Promise.all(
              res.rows.map((row) => {
                const { dogId } = row;
                return doQuery(
                  `
                  insert into dog_vet_preferences (user_id, vet_id, dog_id)
                  values ($1, $2, $3)
                  `,
                  [userId, vetId, dogId],
                ).then((res) => {
                  const dog = dogIdToDog[dogId];
                  const { dogName } = dog;
                  console.log(
                    `dogId ${dogId} prefers vetId ${vetId} - ${dogName}`,
                  );
                  return res;
                });
              }),
            ),
          );
      }),
    );
  }

  function addAppointment(userIdx) {
    const userId = userIdxToUserId[userIdx];
    const sql = `
      WITH
      mInsertion as (
        INSERT INTO calls (
          dog_id,
          vet_id,
          call_outcome,
          encrypted_opt_out_reason
        )
        SELECT
          dog_id,
          vet_id,
          'APPOINTMENT' as call_outcome,
          '' as encrypted_opt_out_reason
        FROM dog_vet_preferences
        WHERE user_id = $1
        ORDER BY dog_id ASC
        LIMIT 1
        RETURNING *
      )
      SELECT * FROM mInsertion
			`;
    return doQuery(sql, [userId]).then((res) => {
      console.log("Created appointment:", {
        userIdx,
        userId,
        call: res.rows[0],
      });
    });
  }

  return Promise.resolve()
    .then(createAdminAccounts)
    .then(createVetAccounts)
    .then(createUserAccountsAndDogs)
    .then(addVetPreferences)
    .then(() => {
      // Create appointments for the first 3 users.
      return Promise.all(irange(3).map(addAppointment));
    })
    .then(() => console.log("Generated Accounts"));
}

function deleteData() {
  return Promise.resolve()
    .then(() => doQuery(`delete from reports`, []))
    .then(() => doQuery(`delete from calls`, []))
    .then(() => doQuery(`delete from dogs`, []))
    .then(() => doQuery(`delete from users`, []))
    .then(() => doQuery(`delete from vet_accounts`, []))
    .then(() => doQuery(`delete from vets`, []))
    .then(() => doQuery(`delete from admins`, []))
    .then(() => console.log("Deleted data"));
}

function createUiTestUserAccount() {
  const toCreate = [
    getIncompleteDogOverrides("Bentley"),
    getEligibleDogOverrides("Mape"),
    getIneligibleDogOverrides("Ridley"),
    getPermanentlyIneligibleDogOverrides("Perry"),
    getEligibleDogOverrides("Klaus"),
  ];
  const appointmentDogName = "Klaus";
  return Promise.resolve()
    .then(() => {
      const userEmail = "test_user@user.com";
      const userName = "Tess Yu Ser";
      const userPhoneNumber = "+65 30002000";
      const userPii = {
        userEmail,
        userName,
        userPhoneNumber,
      };
      const userResidency = "SINGAPORE";
      const body = { userPii, userResidency };
      return doRequest("POST", "/api/dangerous/users", body).then((res) => {
        const { userId } = res;
        console.log(`Created user ${userEmail} (userId: ${userId})`);
        return { userId, userEmail, userName, userPhoneNumber };
      });
    })
    .then((state) => {
      const { userEmail } = state;
      const futureDogs = toCreate.map((spec, idx) => {
        return createDog(userEmail, idx, spec).then((dog) => {
          const { dogId, dogName } = dog;
          console.log(
            `Added dog ${dogName} (dogId: ${dogId}) for user ${userEmail}`,
          );
          return dog;
        });
      });
      return Promise.all(futureDogs).then((dogs) => {
        return { ...state, dogs };
      });
    })
    .then((state) => {
      const sql = `select vet_id as "vetId" from vets where vet_email = $1`;
      return doQuery(sql, ["vet1@vet.com"]).then((res) => {
        const { vetId } = res.rows[0];
        return { ...state, vetId };
      });
    })
    .then((state) => {
      const { userId, vetId, dogs } = state;
      const insertions = dogs.map((dog) => {
        const { dogId } = dog;
        const sql = `insert into dog_vet_preferences(user_id, vet_id, dog_id) values ($1, $2, $3)`;
        return doQuery(sql, [userId, vetId, dogId]).then(() => {
          console.log("Inserted preference", { dogId, vetId });
        });
      });
      return Promise.all(insertions).then(() => state);
    })
    .then((state) => {
      const { vetId, dogs } = state;
      const dog = dogs.filter((dog) => dog.dogName === appointmentDogName)[0];
      const sql = `
      insert into calls(
        dog_id, vet_id, call_outcome, encrypted_opt_out_reason
      )
      values (
        $1, $2, 'APPOINTMENT', ''
      )
      returning call_id as "callId"
      `;
      return doQuery(sql, [dog.dogId, vetId]).then((res) => {
        const { callId } = res.rows[0];
        console.log(
          `Scheduled appointment for ${appointmentDogName} (callId: ${callId})`,
        );
        return {
          ...state,
          appointment: { dogName: appointmentDogName, callId },
        };
      });
    })
    .then((state) => {
      console.log("Created test user:", state);
    });
}

function main() {
  return Promise.resolve()
    .then(deleteData)
    .then(generateAccounts)
    .then(createUiTestUserAccount)
    .then(() => console.log("Done"));
}

main();
