const { test, expect } = require('@playwright/test');
const { baseUrl, operatorID, campaign_uuid } = require('../config/freebetsAPIConfig');
const { generateSignature } = require('../utils/signature.js');

// Campaign Info Tests
test.describe('Campaign Info Endpoint', () => {
  test('Proper response to valid campaign info', async ({ request }) => {
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
      data: requestBodyJSON,
      timeout: 8000 // Will fail if request takes longer than 8 seconds
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
    console.log('✅ Campaign info test passed');
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
          data: requestBodyJSON,
          timeout: 8000 // Will fail if request takes longer than 8 seconds
      });

      const body = await response.json();

      // Validate response status
      expect(response.status()).toBe(401);

      // Parse and validate response body
      expect(body.error).toContain('signature');
      console.log('✅ Invalid signature test passed');
  });

  // Negative Test - Missing Operator ID
  test('Proper error to missing operator ID', async ({ request }) => {
      const requestBody = {
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

      const body = await response.json();

      // Validate response status
      expect(response.status()).toBe(400);

      // Parse and validate response body
      expect(body.error).toContain('operator_id');
      console.log('✅ Missing operator ID test passed');
  });

  // Negative Test - Missing Campaign UUID
  test('Proper error to missing campaign UUID', async ({ request }) => {
      const requestBody = {
          operator_id: operatorID
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

      const body = await response.json();

      // Validate response status
      expect(response.status()).toBe(400);

      // Parse and validate response body
      expect(body.error).toContain('campaign_uuid');
      console.log('✅ Missing campaign UUID test passed');
  });

  // Negative Test - Campaign UUID Null is Invalid
  test('Proper error to campaign info for Hub88 with campaign UUID null', async () => {
      const requestBody = {
          operator_id: operatorID,
          campaign_uuid: null
      };

      // Generate signature before sending request
      const signature = await generateSignature(requestBody);
      
      const response = await fetch(`${baseUrl}/freebet/campaigns/info`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'x-hub88-signature': signature
          },
          body: JSON.stringify(requestBody)
      });

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toContain('campaign_uuid');
      console.log('✅ Campaign UUID null test passed');
  });

  // Negative Test - Campaign UUID Empty is Invalid
  test('Proper error to campaign info for Hub88 with campaign UUID empty', async () => {
      const requestBody = {
          operator_id: operatorID,
          campaign_uuid: ''
      };

      // Generate signature before sending request
      const signature = await generateSignature(requestBody);
      
      const response = await fetch(`${baseUrl}/freebet/campaigns/info`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'x-hub88-signature': signature
          },
          body: JSON.stringify(requestBody)
      });

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toContain('campaign_uuid');
      console.log('✅ Campaign UUID empty test passed');
  });
});

// Campaign List Tests
test.describe('Campaign List Endpoint', () => {
  // Functional Test
  test('Proper response to valid campaign list', async ({ request }) => {
    const requestBody = {
      operator_id: operatorID
    };

    // Generate signature before sending request
    const signature = await generateSignature(requestBody);
    
    // Set timeout to 8000ms (8 seconds) to ensure response time is acceptable
    const response = await request.post(`${baseUrl}/freebet/campaigns/list`, {
        headers: {
            'Content-Type': 'application/json',
            'x-hub88-signature': signature
        },
        data: JSON.stringify(requestBody),
        timeout: 8000 // Will fail if request takes longer than 8 seconds
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    // Parse and validate response body
    expect(Object.keys(body[0]).sort()).toEqual([
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
    expect(typeof body[0].name).toBe('string');
    expect(body[0].start_time === null || typeof body[0].start_time === 'string').toBe(true);
    expect(typeof body[0].currency).toBe('string');
    expect(body[0].end_time === null || typeof body[0].end_time === 'string').toBe(true);
    expect(typeof body[0].game_code).toBe('string');
    expect(typeof body[0].game_id).toBe('number');
    expect(typeof body[0].bet_count).toBe('number');
    expect(typeof body[0].bet_value).toBe('number');
    expect(body[0].operator_reference === null || typeof body[0].operator_reference === 'string').toBe(true);
    expect(body[0].prepaid_uuid).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
    expect(body[0].campaign_uuid).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
    console.log('✅ Campaign List Functional Test passed');
  });

  // Functional Test Using Only Operator ID and start_time
  test('Proper response to valid campaign list using only operator id and start_time', async ({ request }) => {
    const requestBody = {
      operator_id: operatorID,
      start_time: '2025-06-01T00:00:00'
    };

    // Generate signature before sending request
    const signature = await generateSignature(requestBody);
    
    const response = await request.post(`${baseUrl}/freebet/campaigns/list`, {
        headers: {
            'Content-Type': 'application/json',
            'x-hub88-signature': signature
        },
        data: JSON.stringify(requestBody),
        timeout: 8000 // Will fail if request takes longer than 8 seconds
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    // Parse and validate response body
    expect(Object.keys(body[0]).sort()).toEqual([
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
    expect(typeof body[0].name).toBe('string');
    expect(body[0].start_time === null || typeof body[0].start_time === 'string').toBe(true);
    expect(typeof body[0].currency).toBe('string');
    expect(body[0].end_time === null || typeof body[0].end_time === 'string').toBe(true);
    expect(typeof body[0].game_code).toBe('string');
    expect(typeof body[0].game_id).toBe('number');
    expect(typeof body[0].bet_count).toBe('number');
    expect(typeof body[0].bet_value).toBe('number');
    expect(body[0].operator_reference === null || typeof body[0].operator_reference === 'string').toBe(true);
    expect(body[0].prepaid_uuid).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
    expect(body[0].campaign_uuid).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);

    body.forEach(campaign => {
      if (campaign.start_time) {
        const campaignStartTime = new Date(campaign.start_time).getTime();
        const requestBodyStartTime = new Date(requestBody.start_time).getTime();
        expect(campaignStartTime).toBeGreaterThanOrEqual(requestBodyStartTime);
      }
    });
    console.log('✅ Campaign List Functional Test using only operator id and start_time passed');
  });

  // Functional Test Using Only Operator ID and end_time
  test('Proper response to valid campaign list using only operator id and end_time', async ({ request }) => {
    const requestBody = {
      operator_id: operatorID,
      end_time: '2025-06-01T00:00:00'
    };

    // Generate signature before sending request
    const signature = await generateSignature(requestBody);
    
    const response = await request.post(`${baseUrl}/freebet/campaigns/list`, {
        headers: {
            'Content-Type': 'application/json',
            'x-hub88-signature': signature
        },
        data: JSON.stringify(requestBody),
        timeout: 8000 // Will fail if request takes longer than 8 seconds
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    // Parse and validate response body
    expect(Object.keys(body[0]).sort()).toEqual([
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
    expect(typeof body[0].name).toBe('string');
    expect(body[0].start_time === null || typeof body[0].start_time === 'string').toBe(true);
    expect(typeof body[0].currency).toBe('string');
    expect(body[0].end_time === null || typeof body[0].end_time === 'string').toBe(true);
    expect(typeof body[0].game_code).toBe('string');
    expect(typeof body[0].game_id).toBe('number');
    expect(typeof body[0].bet_count).toBe('number');
    expect(typeof body[0].bet_value).toBe('number');
    expect(body[0].operator_reference === null || typeof body[0].operator_reference === 'string').toBe(true);
    expect(body[0].prepaid_uuid).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
    expect(body[0].campaign_uuid).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);

    body.forEach(campaign => {
      if (campaign.end_time) {
        const campaignEndTime = new Date(campaign.end_time).getTime();
        const requestBodyEndTime = new Date(requestBody.end_time).getTime();
        expect(campaignEndTime).toBeLessThanOrEqual(requestBodyEndTime);
      }
    });
    console.log('✅ Campaign List Functional Test using only operator id and end_time passed');
  });

  // Security Test - Invalid Signature
  test('Proper error to invalid signature', async ({ request }) => {
    const requestBody = {
      operator_id: operatorID
    };
    
    const response = await request.post(`${baseUrl}/freebet/campaigns/list`, {
        headers: {
            'Content-Type': 'application/json',
            'x-hub88-signature': 'invalid'
        },
        data: JSON.stringify(requestBody),
        timeout: 8000 // Will fail if request takes longer than 8 seconds
    });

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error).toContain('signature');
    console.log('✅ Invalid signature test passed');
  });


  // Functional Test Using Only Operator ID and name
  test('Proper response to valid campaign list using only operator id and name', async ({ request }) => {
    const requestBody = {
      operator_id: operatorID,
      name: 'test2'
    };

    // Generate signature before sending request
    const signature = await generateSignature(requestBody);
    
    const response = await request.post(`${baseUrl}/freebet/campaigns/list`, {
        headers: {
            'Content-Type': 'application/json',
            'x-hub88-signature': signature
        },
        data: JSON.stringify(requestBody),
        timeout: 8000 // Will fail if request takes longer than 8 seconds
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    // Parse and validate response body
    expect(Object.keys(body[0]).sort()).toEqual([
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
    expect(typeof body[0].name).toBe('string');
    expect(body[0].start_time === null || typeof body[0].start_time === 'string').toBe(true);
    expect(typeof body[0].currency).toBe('string');
    expect(body[0].end_time === null || typeof body[0].end_time === 'string').toBe(true);
    expect(typeof body[0].game_code).toBe('string');
    expect(typeof body[0].game_id).toBe('number');
    expect(typeof body[0].bet_count).toBe('number');
    expect(typeof body[0].bet_value).toBe('number');
    expect(body[0].operator_reference === null || typeof body[0].operator_reference === 'string').toBe(true);
    expect(body[0].prepaid_uuid).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
    expect(body[0].campaign_uuid).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
    console.log('✅ Campaign List Functional Test using only operator id and name passed');
  });

  // Functional Test Using Only Operator ID and prepaid_uuid
  test('Proper response to valid campaign list using only operator id and prepaid_uuid', async ({ request }) => {
    const requestBody = {
      operator_id: operatorID,
      prepaid_uuid: 'c203c7f8-cace-59c8-a2fa-75519f78786b'
    };

    // Generate signature before sending request
    const signature = await generateSignature(requestBody);
    
    const response = await request.post(`${baseUrl}/freebet/campaigns/list`, {
        headers: {
            'Content-Type': 'application/json',
            'x-hub88-signature': signature
        },
        data: JSON.stringify(requestBody),
        timeout: 8000 // Will fail if request takes longer than 8 seconds
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    // Parse and validate response body
    expect(Object.keys(body[0]).sort()).toEqual([
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
    expect(typeof body[0].name).toBe('string');
    expect(body[0].start_time === null || typeof body[0].start_time === 'string').toBe(true);
    expect(typeof body[0].currency).toBe('string');
    expect(body[0].end_time === null || typeof body[0].end_time === 'string').toBe(true);
    expect(typeof body[0].game_code).toBe('string');
    expect(typeof body[0].game_id).toBe('number');
    expect(typeof body[0].bet_count).toBe('number');
    expect(typeof body[0].bet_value).toBe('number');
    expect(body[0].operator_reference === null || typeof body[0].operator_reference === 'string').toBe(true);
    expect(body[0].prepaid_uuid).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
    expect(body[0].campaign_uuid).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
    console.log('✅ Campaign List Functional Test using only operator id and prepaid_uuid passed');
  });

  // Negative Test - Wrong Name
  test('Empty response to wrong name', async ({ request }) => {
    const requestBody = {
      operator_id: operatorID,
      name: 'wrongName'
    };

    // Generate signature before sending request
    const signature = await generateSignature(requestBody);
    
    const response = await request.post(`${baseUrl}/freebet/campaigns/list`, {
        headers: {
            'Content-Type': 'application/json',
            'x-hub88-signature': signature
        },
        data: JSON.stringify(requestBody),
        timeout: 8000 // Will fail if request takes longer than 8 seconds
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.length).toBe(0);
    console.log('✅ Wrong name test passed');
  });

  // Negative Test - Wrong Time Structure
  test('Proper Error Message to wrong time structure', async ({ request }) => {
    const requestBody = {
      operator_id: operatorID,
      start_time: '2025-06-00:00'
    };

    // Generate signature before sending request
    const signature = await generateSignature(requestBody);    
    const response = await request.post(`${baseUrl}/freebet/campaigns/list`, {
        headers: {
            'Content-Type': 'application/json',
            'x-hub88-signature': signature
        },
        data: JSON.stringify(requestBody),
        timeout: 8000 // Will fail if request takes longer than 8 seconds
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('start_time');
    console.log('✅ Wrong time structure test passed');
  });

  // Wrong Prepaid UUID
  test('Proper Error Message to wrong prepaid UUID', async ({ request }) => {
    const requestBody = {
      operator_id: operatorID,
      prepaid_uuid: 'd3c804558b845a6287c59bba872d9230'
    };

    // Generate signature before sending request
    const signature = await generateSignature(requestBody);
    
    const response = await request.post(`${baseUrl}/freebet/campaigns/list`, {
        headers: {
            'Content-Type': 'application/json',
            'x-hub88-signature': signature
        },
        data: JSON.stringify(requestBody),
        timeout: 8000 // Will fail if request takes longer than 8 seconds
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('prepaid_uuid');
    console.log('✅ Wrong prepaid UUID test passed');
  });

  // Null Parameters Test
  test('Campigns List response to null parameters', async ({ request }) => {
    const requestBody = {
      operator_id: operatorID,
      prepaid_uuid: null,
      start_time: null,
      end_time: null,
      name: null,
    };

    // Generate signature before sending request
    const signature = await generateSignature(requestBody);
    
    const response = await request.post(`${baseUrl}/freebet/campaigns/list`, {
        headers: {
            'Content-Type': 'application/json',
            'x-hub88-signature': signature
        },
        data: JSON.stringify(requestBody),
        timeout: 8000 // Will fail if request takes longer than 8 seconds
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    // Parse and validate response body
    expect(Object.keys(body[0]).sort()).toEqual([
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
    expect(typeof body[0].name).toBe('string');
    expect(body[0].start_time === null || typeof body[0].start_time === 'string').toBe(true);
    expect(typeof body[0].currency).toBe('string');
    expect(body[0].end_time === null || typeof body[0].end_time === 'string').toBe(true);
    expect(typeof body[0].game_code).toBe('string');
    expect(typeof body[0].game_id).toBe('number');
    expect(typeof body[0].bet_count).toBe('number');
    expect(typeof body[0].bet_value).toBe('number');
    expect(body[0].operator_reference === null || typeof body[0].operator_reference === 'string').toBe(true);
    expect(body[0].prepaid_uuid).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
    expect(body[0].campaign_uuid).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
    console.log('✅ Null parameters test passed');
  });
});