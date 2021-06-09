# Pets-Deli-Backend-Assessment

This is a Node JS (Typescript) implementation of the Pets Deli Backend Engineer Assessment.

## Setup

- Clone the repository

```bash
git clone https://github.com/uzochukwuonuegbu/Pets-Deli-Backend-Assessment.git
```

- Install project dependencies

```bash
cd Pets-Deli-Backend-Assessment
npm install
```

> Make sure to configure AWS CLI to be able to run tests


- Run the following command to test endpoints using serverless offline.

```bash
sls offline start
```

### Testing (unit tests)
 Run:

```shell
npm run test
```

### Endpoints(Sample CURLs)


POST onClickEvent:

  curl --request POST \
    --url https://5u423ir723.execute-api.eu-central-1.amazonaws.com/dev/onClick \
    --header 'Content-Type: application/json' \
    --header 'x-api-key: L6gdlpCKYs2PwkJuCxpT3El0V0oJYvxaDgXCaLk3' \
    --data '{
    "eventType": "buttonClick",
    "eventSource": "button1",
    "userId": "12345"
  }'


Bonus Endpoint:

GET UserClickEvent: 

  curl --request GET \
    --url https://5u423ir723.execute-api.eu-central-1.amazonaws.com/dev/userClicks?userId=xyz \
    --header 'Content-Type: application/json' \
    --header 'x-api-key: L6gdlpCKYs2PwkJuCxpT3El0V0oJYvxaDgXCaLk3'


Points to note:

 - Deployed service to personal AWS account, and endpoint(s) can be accessed via the curl(s) above
 - Setup rest api endpoint (Infrastructure as Code)
 - Wrote tests for the onClickEventService(Proof of concept)
 - Validating the request data and reject all requests with an error code which doesn’t fit the schema (Infrastructure as code, and very extensible)
 - Set up middleware to handle KeyAuth and TokenAuth (Proof of Concept)
 - Setup a class(DB-Layer) for DynamoDB Client, so it's easy to switch underlying db-system


