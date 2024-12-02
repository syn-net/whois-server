#!/usr/bin/env node
/*
 * And connect with a tcp client from the command line using netcat, the *nix
 * utility for reading and writing across tcp/udp network connections.  I've only
 * used it for debugging myself.
 *
 * $ netcat 127.0.0.1 1337
 *
 * You should see:
 * > Echo server
 *
 * */

/* Or use this example tcp client written in node.js.  (Originated with
 * example code from
 * http://www.hacksparrow.com/tcp-socket-programming-in-node-js.html.) */

`use strict`;
import net from 'net';
import {
  env as ENV,
  argv,
  exit,
} from 'node:process';

const APP_PORT = ENV['PORT'] || 43;
const APP_HOST = ENV['BIND_ADDRESS'] || `127.0.0.1`;

const usage = `
    Usage: whois [OPTION]... OBJECT...

    -h HOST, --host HOST   connect to server HOST
    -p PORT, --port PORT   connect to PORT
    -I                     query whois.iana.org and follow its referral
    -H                     hide legal disclaimers
          --verbose        explain what is being done
          --no-recursion   disable recursion from registry to registrar servers
          --help           display this help and exit
          --version        output version information and exit
`;

function onSocketClose(handle) {
  handle.destroy();
  // console.log(`Connection closed`);
}

function onSocketData(data) {
  let result = ``;
  if(data && data.length > 0) {
    result = data.toString(`utf8`);
  }

  if(result.includes(`ENOENT`)) {
    return exit(1);
  }

  return result;
}

function main() {
  const args = argv;
  const numArgs = args.length;
  let query = ``;

  args.forEach((arg, pos) => {
    if(pos == 2) {
      if(arg && arg.length > 0) {
        query = arg;
      }
    }
  });

  if(!query || query && query.length < 1) {
    console.log(usage);
    exit(1);
  }

  const client = new net.Socket();
  client.connect(APP_PORT, APP_HOST, function() {
    // console.debug(`Connected to ${APP_HOST}:${APP_PORT}...\n`);
  	client.write(query);
  });

  client.on(`data`, (data) => {
    return console.log(onSocketData(data));
  });

  client.on(`close`, () => {
    onSocketClose(client);
  });
}

main();
