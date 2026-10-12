const { test, expect , request} = require('@playwright/test');
const { APIUtils} = require('./utils/APIUtils');
const loginPayLoad = {userEmail: "dummy123@gmail.com", userPassword: "Password@10"};
const orderPayload = {orders: [{country: "India", productOrderedId: "6960eac0c941646b7a8b3e68"}]};

let response;

test.beforeAll( async () =>
    {
        const apiContext = await request.newContext();
        const apiutils = new APIUtils(apiContext,loginPayLoad); // login
        response = await apiutils.createOrder(orderPayload);     // createOrder
})

test('verifyOrder', async({page}) =>
    
    {
      await page.addInitScript(value => 
        
        { window.localStorage.setItem('token',value);
    
        }, response.token );

        await  page.goto("https://rahulshettyacademy.com/client");
       
       const pageTitle =  await page.title(); 

       await page.getByRole('button', { name: 'ORDERS'}).click();

       const rows = await page.locator('tbody tr');

       await expect(rows.first()).toBeVisible();

       const rowsCount = await rows.count();

     //  await rows.tr.th == orderId

     for(let i = 0 ; i < rowsCount ; i++)
        
        {
          const rowOrderId = await rows.nth(i).locator('th').textContent();

        if(response.orderId.includes(rowOrderId)){

            await rows.nth(i).locator('button').first().click();

            break;
        }
     }
    
     const orderIDDetailsPage = await page.locator('.col-text').textContent();
    
      await  expect(response.orderId.includes(orderIDDetailsPage)).toBeTruthy();    

    }
)



