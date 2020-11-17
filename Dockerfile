FROM ruby:2.7.0

RUN apt-get update -qq \
  && rm -rf /var/lib/apt/lists/*

RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_14.x  | bash -
RUN apt -y install nodejs


RUN npm install -g yarn
RUN yarn install --check-files

COPY . .

RUN yarn --version

RUN bundle install
