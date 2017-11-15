# rainbow
[Pigato](https://github.com/prdn/pigato) GraphQL wrapper for lazy dude 🌈

## Overview

### Announce Services
```
Broker (Services Directory) <--- Worker (Service)
```

### Client Request
```
Client (GraphQL) ---> Broker ---> Worker ---> Server (GraphQL)
```
### Worker Reply
```
Client (GraphQL) <--- Broker <--- Worker ---> Server (GraphQL)
```

## Setup (macOS)
```shell
brew install zeromq
```

## Setup (Ubuntu16)
```shell
# Ubuntu 16, for node-gyp
apt install -y make g++

# Download zeromq
# Ref http://zeromq.org/intro:get-the-software
wget https://github.com/zeromq/libzmq/releases/download/v4.2.2/zeromq-4.2.2.tar.gz

# Unpack tarball package
tar xvzf zeromq-4.2.2.tar.gz

# Install dependency
sudo apt-get update && \
sudo apt-get install -y libtool pkg-config build-essential autoconf automake uuid-dev

# Create make file
cd zeromq-4.2.2
./configure

# Build and install(root permission only)
sudo make install

# Install zeromq driver on linux
sudo ldconfig

# Check installed
ldconfig -p | grep zmq
```

## How to use
- See test folder, more example

## Test
```shell
npm test
```
## TODO
- [ ] Secure
- [ ] Monitoring
- [ ] Alert
- [ ] Simple example

## Totest
- [ ] 1 client, 1 broker, 1 worker
- [ ] 1 client, 1 broker, 2 workers
- [ ] 2 clients, 1 broker,1 worker
- [ ] 2 clients, 1 broker,2 workers
- [ ] 1 client, 2 brokers, 1 worker
- [ ] 1 client, 2 brokers, 2 workers
- [ ] 2 clients, 2 brokers,1 worker
- [ ] 2 clients, 2 brokers,2 workers