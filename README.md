# turbulent-ws

simple exercise for websockets

### run the tests

```
npm t
```

### run the server

```
npm run dev
```

### add a reminder

Send a message to the connected websocket server running at `ws://localhost:1337` in the following format to set a reminder that will get sent at that time.

```
{
    "method": "add_reminder",
    "params": {
        "time": <FUTURE UNIX TIMESTAMP HERE>,
        "notice": "Hello future!"
    }
}
```

Response at timestamp.

```
{
    "notice": "Hello future!"
}
```

### errors

Errors are returned right away.

```
{
    "error": "Invalid request"
}
```
