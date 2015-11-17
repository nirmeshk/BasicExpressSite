FROM    ubuntu:14.04

# Enable EPEL for Node.js
RUN 	apt-get install -y curl
RUN     curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
RUN     apt-get install -y nodejs

RUN     apt-get install -y build-essential

# Bundle app source
COPY . /src
# Install app dependencies
RUN cd /src; npm install

EXPOSE  3000
CMD ["node", "/src/app.js"]
