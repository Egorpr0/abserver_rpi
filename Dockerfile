FROM ruby:2.7.0

RUN apt update

RUN apt -y install curl gnupg ca-certificates apt-transport-https

RUN curl -sL https://deb.nodesource.com/setup_14.x  | bash -
RUN wget https://dl.yarnpkg.com/debian/pubkey.gpg
RUN cat pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt update

RUN apt -y install yarn

COPY ./package.json ./package.json
COPY ./Gemfile ./Gemfile

RUN yarn install --frozen-lockfile --link-duplicates
RUN bundle install --jobs `getconf _NPROCESSORS_ONLN`

COPY . .

ENV MARIADB_USERNAME=root
ENV MARIADB_PASSWORD=root
ENV MARIADB_ADDRESS=mariadb
ENV REDIS_URL=redis