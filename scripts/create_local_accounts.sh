#!/bin/bash

set -e
echo

echo "Create admin account for Alice:"
curl -X POST \
  http://localhost:3000/api/dangerous/admins \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Basic ZGV2ZWxvcGVyOnBhc3N3b3Jk' \
  -d '{
    "adminEmail": "alice@admin.com",
    "adminName": "Alice",
    "adminPhoneNumber": "+6588001001"
  }'
echo $?
echo

echo "Create user account for Ursula:"
curl -X POST \
  http://localhost:3000/api/dangerous/users \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Basic ZGV2ZWxvcGVyOnBhc3N3b3Jk' \
  -d '{
    "userEmail": "bob@user.com",
    "userName": "Bob",
    "userPhoneNumber": "+6598001001"
  }'
echo $?
echo

echo "Create vet account for Vincent Vet Clinic:"
curl -X POST \
  http://localhost:3000/api/dangerous/vets \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Basic ZGV2ZWxvcGVyOnBhc3N3b3Jk' \
  -d '{
    "vetEmail": "vincent@vet.com",
    "vetName": "Vincent Vet Clinic",
    "vetPhoneNumber": "+6568001001",
    "vetAddress": "36 Dog Park Drive"
  }'
echo $?
echo
