import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

const testAuth = async () => {
  try {
    console.log('Testing authentication system...\n');

    // Test 1: Create a new user
    console.log('Test 1: Creating a new user');
    const newUser = {
      username: 'testuser' + Math.floor(Math.random() * 1000),
      password: 'testpass123'
    };
    
    console.log('Attempting to create user:', newUser.username);
    const createResponse = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });
    
    const createResult = await createResponse.json();
    console.log('Create user response:', createResult);
    console.log('Create user status:', createResponse.status);
    console.log('\n-------------------\n');

    // Test 2: Log in with created user
    console.log('Test 2: Logging in with created user');
    const loginResponse = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });
    
    const loginResult = await loginResponse.json();
    console.log('Login response:', loginResult);
    console.log('Login status:', loginResponse.status);
    console.log('\n-------------------\n');

    // Test 3: Try to create user with same username
    console.log('Test 3: Trying to create user with same username');
    const duplicateResponse = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });
    
    const duplicateResult = await duplicateResponse.json();
    console.log('Duplicate user response:', duplicateResult);
    console.log('Duplicate user status:', duplicateResponse.status);
    console.log('\n-------------------\n');

    // Test 4: Try to log in with wrong password
    console.log('Test 4: Trying to log in with wrong password');
    const wrongPass = { ...newUser, password: 'wrongpass' };
    const wrongPassResponse = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wrongPass)
    });
    
    const wrongPassResult = await wrongPassResponse.json();
    console.log('Wrong password response:', wrongPassResult);
    console.log('Wrong password status:', wrongPassResponse.status);
    console.log('\n-------------------\n');

    console.log('Authentication tests completed!');
  } catch (error) {
    console.error('Error during tests:', error);
  }
};

testAuth(); 