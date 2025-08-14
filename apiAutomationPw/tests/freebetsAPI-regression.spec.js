const { test, expect } = require('@playwright/test');
const { baseUrl, operatorID, campaign_uuid } = require('../config/freebetsAPIConfig');
const { generateSignature } = require('../utils/signature.js');

// Campaign Info Test
test.describe('Campaign Info Endpoint', () => {
  test('Should get campaign info for Hub88', async ({ request }) => {
    const requestBody = {
      operator_id: operatorID,
      campaign_uuid: campaign_uuid
    };

    // Generate signature before sending request
    const signature = await generateSignature(requestBody);

    // Stringify the request body to JSON before sending
    const requestBodyJSON = JSON.stringify(requestBody);

    // Make the API request using Playwright's request fixture
    const response = await request.post(`${baseUrl}/freebet/campaigns/info`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Hub88-Signature': signature
      },
      data: requestBodyJSON
    });

    const testdata = await response.json();


    // console.log('Original request body:', requestBody);
    // console.log('Signature:', signature);
    // console.log('Response status:', response.status());
    // console.log('Response data:', testdata);

    // Validate response status
    expect(response.status()).toBe(200);

    // Parse and validate response body
    expect(Object.keys(testdata).sort()).toEqual([
      'bet_count',
      'bet_value',
      'campaign_uuid',
      'currency',
      'end_time',
      'game_code',
      'game_id',
      'name',
      'operator_reference',
      'prepaid_uuid',
      'start_time',
    ].sort());

    expect(typeof testdata.name).toBe('string');
    expect(testdata.start_time).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
    expect(typeof testdata.currency).toBe('string');
    expect(testdata.end_time).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
    expect(typeof testdata.game_code).toBe('string');
    expect(typeof testdata.game_id).toBe('number');
    expect(typeof testdata.bet_count).toBe('number');
    expect(typeof testdata.bet_value).toBe('number');
    expect(testdata.operator_reference === null || typeof testdata.operator_reference === 'string').toBe(true);
    expect(testdata.prepaid_uuid).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
    expect(testdata.campaign_uuid).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
  });


    // Security Test - Invalid Signature
    test('Proper error to invalid signature', async ({ request }) => {
        const requestBody = {
            operator_id: operatorID,
            campaign_uuid: campaign_uuid
        };

        // Stringify the request body to JSON before sending
        const requestBodyJSON = JSON.stringify(requestBody);

        // Make the API request using Playwright's request fixture
        const response = await request.post(`${baseUrl}/freebet/campaigns/info`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Hub88-Signature': 'invalid'
            },
            data: requestBodyJSON
        });

        const body = await response.json();

        // Validate response status
        expect(response.status()).toBe(401);

        // Parse and validate response body
        expect(body.error).toContain('signature');
    });

    //     expect(response.status).toBe(401);
    //     const body = await response.json();
    //     expect(body.error).toContain('signature');
    // });

    // // Negative Test - Missing Operator ID
    // test('Should get campaign info for Hub88 with missing operator ID', async () => {
    //     const requestBody = {
    //         campaign_uuid: campaign_uuid
    //     };

    //     // Get signature from helper function
    //     const signature = await generateSignature(requestBody);
        
    //     const response = await fetch(`${baseUrl}/freebet/campaigns/info`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'x-hub88-signature': signature
    //         },
    //         body: JSON.stringify(requestBody)
    //     });

    //     expect(response.status).toBe(400);
    //     const body = await response.json();
    //     expect(body.error).toContain('operator_id');
    // });

    // // Negative Test - Missing Campaign UUID
    // test('Should get campaign info for Hub88 with missing campaign UUID', async () => {
    //     const requestBody = {
    //         operator_id: operatorID
    //     };

    //     // Get signature from helper function
    //     const signature = await getSignatureFromService(requestBody);
        
    //     const response = await fetch(`${baseUrl}/freebet/campaigns/info`, {
    //         method: 'POST',
    //         headers: { 
    //             'Content-Type': 'application/json',
    //             'x-hub88-signature': signature
    //         },
    //         body: JSON.stringify(requestBody)
    //     });

    //     expect(response.status).toBe(400);
    //     const body = await response.json();
    //     expect(body.error).toContain('campaign_uuid');
    // });

    // // Negative Test - Campaign UUID Null is Invalid
    // test('Proper error message for campaign info for Hub88 with campaign UUID null', async () => {
    //     const requestBody = {
    //         operator_id: operatorID,
    //         campaign_uuid: null
    //     };

    //     // Get signature from helper function
    //     const signature = await getSignatureFromService(requestBody);
        
    //     const response = await fetch(`${baseUrl}/freebet/campaigns/info`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'x-hub88-signature': signature
    //         },
    //         body: JSON.stringify(requestBody)
    //     });

    //     expect(response.status).toBe(400);
    //     const body = await response.json();
    //     expect(body.error).toContain('campaign_uuid');
    // });

    // // Negative Test - Campaign UUID Empty is Invalid
    // test('Proper error message for campaign info for Hub88 with campaign UUID empty', async () => {
    //     const requestBody = {
    //         operator_id: operatorID,
    //         campaign_uuid: ''
    //     };

    //     // Get signature from helper function
    //     const signature = await getSignatureFromService(requestBody);
        
    //     const response = await fetch(`${baseUrl}/freebet/campaigns/info`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'x-hub88-signature': signature
    //         },
    //         body: JSON.stringify(requestBody)
    //     });

    //     expect(response.status).toBe(400);
    //     const body = await response.json();
    //     expect(body.error).toContain('campaign_uuid');
    // });
});