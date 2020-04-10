# index

Index is an automatic time-tracker which can synchronize across multiple computers.

- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Building and Running](#building-and-running)
- [Testing](#testing)

## Architecture

Index grew out of a desire to have a time-tracker which can sync across multiple computers without requiring a cloud service, like the excellent [ManicTime Cloud](https://www.manictime.com/cloud/). So instead of using a database, Index will save logs to JSON files, and sync them across different computers by using Git.

Index is comprised of three components:

| Name            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Language   | Runtime                  | Directory                |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------ | ------------------------ |
| Server          | This forms the core of the application. This is an Express.js server which communicates with frontends using REST and websockets. This also subscribes to the monitor, and logs the output into the log files.                                                                                                                                                                                                                                                                                                       | TypeScript | Node.js                  | [app/server](app/server) |
| Frontend client | This is what users will typically interact with. This will provide ways for users to see their activity and perform queries. Currently, the idea is to have this frontend served to a browser window which is controlled by [Playwright](https://github.com/microsoft/playwright), similiarly to how Google Chrome's [Carlo](https://github.com/GoogleChromeLabs/carlo) used Puppeteer. The UI is written in React, and uses the [Base Web](https://baseweb.design/guides/theming#) design and components from Uber. | TypeScript | Browsers                 | [app/client](app/client) |
| Monitor         | The monitor will attach to events from the operating system (just Windows at this point), and provide the server notifications via websockets about the current running programs and open documents.                                                                                                                                                                                                                                                                                                                 | C#         | .NET (version undecided) | [monitor](monitor)       |

## Prerequisites

- [Git](https://git-scm.com/)
- [Yarn (classic)](https://classic.yarnpkg.com/en/)
- [NodeJS >= 12.16.2 LTS](https://nodejs.org/en/)
- TODO: dotnet

## Building and Running

First, get the source:

```console
~$ git clone https://github.com/dalyIsaac/index.git
```

Then, install dependencies for the server and frontend:

```console
~$ cd index/app
~/index/app$ yarn
```

Build the helper and api packages, and ensure that yarn has them correctly linked:

```console
~/index/app$ cd api
~/index/app/api$ yarn build

~/index/app/api$ cd ../helpers
~/index/app/helpers$ yarn build

# For Linux:
~/index/app/helpers$ cd ../node_modules/@index
~/index/app/node_modules/@index$ rm api helpers && ln -s ../../api api && ln -s ../../helpers helpers

# For Windows:
~/index/app/helpers$ cd ../node_modules/@index
~/index/app/node_modules/@index$ Remove-Item -Force api
~/index/app/node_modules/@index$ cmd /c mklink /D api ..\..api
~/index/app/node_modules/@index$ Remove-Item -Force helpers
~/index/app/node_modules/@index$ cmd /c mklink /D helpers ..\..helpers
```

Run the server:

```console
~/index/app/node_modules/@index$ cd ../../server
~/index/app/server$ yarn build
```

To run the monitor:

```console
# TODO
```

In another terminal, run the frontend client:

```console
~$ cd ~/index/app/client
~/index/app/client$ yarn build
```

## Testing

To test the server:

```console
# TODO
```

To test the frontend client:

```console
~$ cd ~/index/app/client
~/index/app/client$ yarn test
```

To test the monitor (Windows):

```console
# TODO
```
