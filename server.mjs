#!/usr/bin/env node
/* https://gist.github.com/tedmiston/5935757 */
/*
 * In the node.js intro tutorial (http://nodejs.org/), they show a basic tcp
 * server, but for some reason omit a client connecting to it.  I added an
 * example at the bottom.
 *
 * Save the following server in example.js:
 * */

`use strict`;
import net from 'net';
import {
  access,
  constants,
  readFile,
} from 'fs';
import {tos} from './lib/constants.js';

const APP_PORT = process.env['PORT'] || 43;
const APP_HOST = process.env['BIND_ADDRESS'] || `127.0.0.1`;

const onSocketFinish = function() {}

const server = net.createServer( function(socket) {
	socket.pipe(socket);

  socket.on(`data`, (data) => {
    const query = data.toString();
    const fp = `./data/${query}.json5`;

    // access(fp, constants.F_OK, (err) => {
    //   const result = err ? 2 : 0;
    //   if(err) {
    //     return console.error(err.message);
    //   }
    //
    //   console.log(`${fp} ${result}`);
    //   return result;
    // });

    // import data from './package.json' with { "type": "json" };
    // return console.log(data.domain);
    readFile(fp, (err, data) => {
      if(err) {
        if(err.code === 'ENOENT') {
          console.error(`ENOENT`);
          return socket.write(`ENOENT`);
        }

        throw err;
      }

      // const json = data.toString();
      const json = JSON.parse(data.toString());
      const domainName = json.domain || ``;
      const registryDomainId = json.id || 0;
      const registrarWhoisServer = json.whois || `${APP_HOST}:${APP_PORT}`;
      const registrarUrl = json.registrar_url || ``;
      const updatedAt = json.updated || ``;
      const createdOn = json.created || ``;
      const expiryAt = json.expiry || ``;
      const registrar = json.registrar || ``;
      const registrarId = json.registrar_id || ``;
      const registrarAbuseEmail = json.registrar_abuse_email || ``;
      const registrarAbusePhone = json.registrar_abuse_phone || ``;
      const domainStatus = json.status || ``;
      const nameServers = json.nameservers || [];
      const lastUpdated = json.last_updated || ``;
      const dnssec = json.dnssec || `unsigned`;

      // https://nodejs.org/docs/latest-v16.x/api/stream.html#readablepipedestination-options
      // socket.write(data, `utf8`, () => {
        // return json;
      // });

      socket.write(`Domain Name: ${domainName}\n`, `utf8`, onSocketFinish);
      socket.write(`Registry Domain ID: ${registryDomainId}\n`, `utf8`, onSocketFinish);
      socket.write(`Registrar WHOIS Server: ${registrarWhoisServer}\n`, `utf8`, onSocketFinish);
      socket.write(`Registrar URL: ${registrarUrl}\n`, `utf8`, onSocketFinish);
      socket.write(`Updated Date: ${updatedAt}\n`, `utf8`, onSocketFinish);
      socket.write(`Creation Date: ${createdOn}\n`, `utf8`, onSocketFinish);
      socket.write(`Registry Expiration Date: ${expiryAt}\n`, `utf8`, onSocketFinish);
      socket.write(`Registrar: ${registrar}\n`, `utf8`, onSocketFinish);
      socket.write(`Registrar ID: ${registrarId}\n`, `utf8`, onSocketFinish);
      socket.write(`Registrar Abuse Email: ${registrarAbuseEmail}\n`, `utf8`, onSocketFinish);
      socket.write(`Registrar Abuse Phone: ${registrarAbusePhone}\n`, `utf8`, onSocketFinish);

      domainStatus.forEach((statusLine, row) => {
        if(statusLine && statusLine.length > 0) {
          socket.write(`Domain Status: ${statusLine}\n`);
        }
      });

      nameServers.forEach((ns, index) => {
        if(ns && ns.length > 0) {
          socket.write(`Name Server: ${ns}\n`, `utf8`, onSocketFinish);
        }
      });

      socket.write(`\nDNSSEC: ${dnssec}\n`, `utf8`, onSocketFinish);
      socket.write(`>>> Last update of whois database: ${lastUpdated} <<<\n`, `utf8`, onSocketFinish);
      socket.write(tos, `utf8`, onSocketFinish);
      socket.end();
    });
  });

});


server.listen(APP_PORT, APP_HOST);
