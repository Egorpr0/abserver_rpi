FROM ruby:2.7.0

RUN apt-get update

RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_14.x  | bash -
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update
RUN apt -y install yarn

RUN yarn --version

COPY package.json yarn.lock ./
RUN yarn --pure-lockfile

RUN yarn install
RUN yarn install --check-files

COPY . .

RUN bundle install