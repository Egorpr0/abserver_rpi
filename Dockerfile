FROM ruby:2.7.0

RUN apt update

RUN apt -y install curl gnupg ca-certificates apt-transport-https nodejs

RUN wget https://dl.yarnpkg.com/debian/pubkey.gpg
RUN cat pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt update

RUN apt -y install yarn

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
COPY ./Gemfile* ./

RUN yarn install --network-timeout 100000
RUN bundle install

COPY . .

ENV MARIADB_USERNAME=root
ENV MARIADB_PASSWORD=root
ENV MARIADB_ADDRESS=mariadb
ENV REDIS_URL=redis
