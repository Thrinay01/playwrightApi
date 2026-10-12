class APIUtils {

    constructor(apiContext,loginPayLoad) {
        this.apiContext = apiContext;
        this.loginPayLoad = loginPayLoad;
    }

    async getToken(loginPayLoad) {

        let token;
        
        const loginResponse =

            await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",

                { data: this.loginPayLoad }
            )

        const loginResponseJson = await loginResponse.json();

        token = loginResponseJson.token;

        return token;
    }

    async createOrder(orderPayload) {

        let response = {};
        response.token = await  this.getToken();

        const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",

            {
                data: orderPayload,
                headers: {
                    'Authorization': response.token,  // here it calls this method and return value will be placed here
                    'Content-Type': 'application/json'
                },
            })

        const orderResponseJson = await orderResponse.json();

        const orderId = orderResponseJson.orders[0];

        console.log(orderId);

        response.orderId = orderId;

        return response;
    }
}

module.exports = {APIUtils};

