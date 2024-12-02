---
title: WHOIS server
---

# whois server

This is a *partial* whois server implementation for the sake of learning about low-level sockets and such with [NodeJS](https://nodejs.org).

**WARNING**: This is intended to be used solely within your own internal LAN, in companionship with DNS root zones that you **own** and wish to advertise.

## usage

```shell
# install deps
npm install
# execute server-side inside of another terminal
npm run serve
# test the server implementation with the client
npm run client
```

# TODO

- [ ] make our server implementation spec compliant so we can use `whois` client for returning results
  * `whois --host localhost --port 43 lan`
  * **See also**: `/etc/whois.conf`
