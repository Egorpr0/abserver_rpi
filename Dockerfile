FROM ruby:2.7.0

RUN apt-get update

RUN apt-get -y install curl gnupg ca-certificates apt-transport-https

RUN curl -sL https://deb.nodesource.com/setup_14.x  | bash -
RUN wget https://dl.yarnpkg.com/debian/pubkey.gpg
RUN cat pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update

RUN apt -y install yarn

COPY package.json ./

RUN yarn install --check-files

COPY . .

RUN bundle install