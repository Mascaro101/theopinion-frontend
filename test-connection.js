// Test script para verificar la conexión con el backend
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const testConnection = async () => {
  console.log('🔄 Testing backend connection...');
  
  try {
    // Test 1: Health check
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health check:', healthResponse.data);
    
    // Test 2: Register a test user
    console.log('\n2. Testing user registration...');
    const testUser = {
      email: `test${Date.now()}@example.com`,
      password: 'SecureP@ssw0rd2024!',
      firstName: 'Test',
      lastName: 'User'
    };
    
    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, testUser);
    console.log('✅ Registration successful:', {
      success: registerResponse.data.success,
      message: registerResponse.data.message,
      userEmail: registerResponse.data.data.user.email
    });
    
    const token = registerResponse.data.data.token;
    
    // Test 3: Login with the same user
    console.log('\n3. Testing user login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login successful:', {
      success: loginResponse.data.success,
      message: loginResponse.data.message,
      userEmail: loginResponse.data.data.user.email
    });
    
    // Test 4: Get user profile
    console.log('\n4. Testing get profile...');
    const profileResponse = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('✅ Profile retrieved:', {
      success: profileResponse.data.success,
      userEmail: profileResponse.data.data.user.email,
      userRole: profileResponse.data.data.user.role
    });
    
    // Test 5: Logout
    console.log('\n5. Testing logout...');
    const logoutResponse = await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('✅ Logout successful:', {
      success: logoutResponse.data.success,
      message: logoutResponse.data.message
    });
    
    console.log('\n🎉 All tests passed! Backend connection is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
};

// Run the test
testConnection(); 