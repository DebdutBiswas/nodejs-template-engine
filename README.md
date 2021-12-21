# nodejs-template-engine
Custom made lightweight template engine for Node.js

## Codesandbox playground link:
https://codesandbox.io/s/nodejs-template-engine-md1hb

## Features:
- Light weight
- Has it's own parsing template literal: $nv{}
- We can pass objects through the routes like so:
```js
  if (req.url === '/') {
      httpStaticCall.serve(req, res, {
          uri: req.url,
          method: req.method,
          host: req.headers.host,
          remoteAddress: req.connection.remoteAddress
      });
  }
```
- Then we can use and access those objects by using our template literal ```$nv{}``` like so:
```html
  <div>
      <h3>Dynamic Object Variables Processed By Template Engine:</h3>
      <span>
          <span>Request URI: $nv{uri}</span><br/>
          <span>Request Method: $nv{method}</span><br/>
          <span>Request Host: $nv{host}</span><br/>
          <span>Request Remote Host: $nv{remoteAddress}</span><br/><br/>
      </span>
  </div>
```

## Install required node modules:
- npm install

## How to run the code?
### First, start the server:
- npm start

### Test the template engine:
- Open http://localhost on any browser of your choice.
- You will see an web page which contains Request URI, Request Method, Request Host, Request Remote Host variables.
- Those variables are rendered by our template engine which parses by ```$nv{}``` template literal.
- Click on the "Form post to mongodb test" link or open http://localhost/get-form-test.html
- You will see a form with ```Msg id``` and ```Msg``` field

## User Inputs / Outputs:
#### Input:
- Put any random id and random message into the form and click on "Submit" button.
- It will post the form data through the api.
- You will get back json response from the api on successful insertion of documet to mongodb collection.
- The JSON response uses template our custon engine to render it to browser.

#### Output:
- JSON Response like this:
```json
  [{"_id":"61c1d8b039e9a2004a1771b6","test-msg-id":"d456","test-msg":"User data"}]
```
