# REST

## GET /user/:id
Input:

Output:
200
```js
{
  id: 1,
  name: "Ivanov Ivan",
  balance: 250 
}
```
400

## POST /transaction
Input:
```js
{
    client_id: 1,
    side: "WITHDRAW", // \ DEPOSIT
    amount: 123, // abs
}
```

Output: 
200:
```js
{
    id: 123,
    status: "IN_QUEUE",
    side: "",
    amount: 123
}
```
400, 500

## GET /transaction/:id
Output: 
Found, 200
```js
{
    id: 0,
    status: "",
    side: "",
    amount: 123
}
```
Not found, 404 

## POST /transaction/process/:id
Output:
200
```js
{
    user: UserData,
    transaction: TransactionData
}
```
400, 500