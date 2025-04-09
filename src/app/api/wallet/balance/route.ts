import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get token from the request headers
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.error('Unauthorized - No token provided for wallet balance API');
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    console.log('Forwarding wallet balance request to backend');

    // Forward request to backend API with token
    const response = await fetch('http://localhost:5000/api/v1/wallet/balance', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    console.log('Backend wallet balance response status:', response.status);
    
    if (!response.ok) {
      console.error('Backend wallet balance request failed:', {
        status: response.status,
        message: data.message || 'Unknown error'
      });
      
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || 'Failed to fetch wallet balance',
          error: data.error
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.data || data
    });
  } catch (error: any) {
    console.error('Error in wallet balance API route:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
} 